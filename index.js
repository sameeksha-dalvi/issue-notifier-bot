import dotenv from "dotenv";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

dotenv.config();

// read config
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const repo = config.repo;
const filterLabels = config.labels || []; // labels to track

// init telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// GitHub API URL (fetch newest created issues first, up to 100)
const GITHUB_API = `https://api.github.com/repos/${repo}/issues?sort=created&direction=desc&per_page=100`;

async function checkLatestIssue() {
  try {
    // Read last stored issue ID
    let lastIssueId = 0;
    if (fs.existsSync("last_issue.txt")) {
      lastIssueId = parseInt(fs.readFileSync("last_issue.txt", "utf8"));
    }

    const response = await axios.get(GITHUB_API, {
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });

    let issues = response.data;

    // FILTER OUT PRs
    issues = issues.filter((i) => !i.pull_request);

    // FILTER BY LABELS (case-insensitive)
    if (filterLabels.length > 0) {
      issues = issues.filter((issue) => {
        const issueLabels = issue.labels.map((l) => l.name.toLowerCase().trim());
        return filterLabels.some((label) => issueLabels.includes(label.toLowerCase().trim()));
      });
    }

    if (issues.length === 0) {
      console.log("No issues found matching your labels.");
      return;
    }

    // FILTER only NEW issues (id > lastIssueId)
    const newIssues = issues.filter((issue) => issue.id > lastIssueId);

    if (newIssues.length === 0) {
      console.log("No new issues.");
      return;
    }

    // Notify all new issues
    for (const issue of newIssues.reverse()) {
      console.log(`New issue: #${issue.number} - ${issue.title}`);
      console.log(`URL: ${issue.html_url}`);

      const message = `New issue detected!\n\n#${issue.number} - ${issue.title}\n${issue.html_url}`;

      await bot
        .sendMessage(process.env.TELEGRAM_CHAT_ID, message)
        .then(() => console.log("Telegram message sent"))
        .catch((err) => console.error("Telegram error:", err.message));

      // update lastIssueId after each message
      fs.writeFileSync("last_issue.txt", String(issue.id));
    }
  } catch (err) {
    console.error("Error fetching issues:", err.response ? err.response.data : err);
  }
}

checkLatestIssue();
