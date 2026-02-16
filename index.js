require("dotenv").config();
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

// read config
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const repo = config.repo;

// init telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// GitHub API URL 
const GITHUB_API = `https://api.github.com/repos/${repo}/issues?sort=created&direction=desc`;

async function checkLatestIssue() {
    try {
        const response = await axios.get(GITHUB_API, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
            }
        });

        let issues = response.data;

        // FILTER OUT PRs
        issues = issues.filter((i) => !i.pull_request);

        if (issues.length === 0) {
            console.log("No issues found.");
            return;
        }

        const latest = issues[0];

        console.log(`Latest issue: #${latest.number} - ${latest.title}`);
        console.log(`URL: ${latest.html_url}`);

    } catch (err) {
        console.error("Error fetching issues:", err.response ? err.response.data : err);
    }
}

checkLatestIssue();
