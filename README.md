# GitHub Issue Notifier Bot

A simple Node.js bot that tracks new issues in a GitHub repository (e.g., any public repo) based on **labels** and sends notifications to **Telegram**.

---

## Why This Bot Exists

I recently got an opportunity to contribute to open source project. I enabled **watch** on the repository to get notified of new issues via email, but those notifications just got buried in a flood of other emails, and I missed some opportunities.  

I wanted a solution that would:

- Notify me **only for specific labels** like `help wanted` or `good first issue`.  
- Deliver the alert **directly to Telegram**.  
- Avoid duplicate notifications by keeping track of what I already saw.  

So I created this bot using Node.js with help from ChatGPT to make it functional and easy to configure.

---

## Features

- **Configurable repository & labels**: Track only the issues you care about (e.g., `Type: Maintainer Only`, `Status: Help Wanted`).  
- **Persistent state**: Keeps track of the last processed issue to avoid duplicate notifications.  
- **Filters out pull requests** automatically.  
- **Multiple new issue detection**: If several new issues appear since the last check, all are notified.  
- **Telegram notifications**: Sends messages for every new issue.  
- **Easy setup**: Use `setup.js` to configure repository, select labels, and initialize files.  
- **Runs continuously** with PM2 for background automation.

---

## How It Works

1. You run `setup.js` to select your GitHub repository and issue labels.  
2. The bot fetches the latest issues from GitHub and filters them by your chosen labels.  
3. Any new issues are sent to your Telegram account.  
4. The bot saves the last processed issue to `last_issue.txt` so it won’t repeat notifications.  
5. Use **PM2** to keep the bot running in the background.

---

## Setup

1. Clone this repo:

```bash
git clone git@github.com:sameeksha-dalvi/issue-notifier-bot.git
cd issue-notifier-bot
```
2. Install dependencies:

```bash
npm install
```
3. Create a .env file:

Before running the bot, you need to create a `.env` file with the following variables:

```bash
GITHUB_TOKEN=<your_github_personal_access_token>
TELEGRAM_BOT_TOKEN=<your_telegram_bot_token>
TELEGRAM_CHAT_ID=<your_chat_id>
```

- **GitHub Personal Access Token** – Required to access GitHub’s API.  
  Follow GitHub’s guide to create one: [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

- **Telegram Bot Token** – Required to send messages via your Telegram bot.  
  Follow this tutorial to create a bot and get the token: [Telegram Bot FAQ](https://core.telegram.org/bots#3-how-do-i-create-a-bot)

- **Telegram Chat ID** – The chat where notifications will be sent.  
  You can find your chat ID using this guide: [Getting your chat ID](https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id)


4. Run the setup script:

```bash
node setup.js
```

Follow the prompts to select your repository and issue labels.

## Setup Screenshots

### 1. Repository Configuration in Terminal
This screenshot shows the CLI asking for GitHub repository:

![Configure repository](https://raw.githubusercontent.com/sameeksha-dalvi/issue-notifier-bot/main/configure_repo.png)

### 2. Selecting Labels to Track
After fetching labels from GitHub, you can select which ones to monitor:

![Select labels](https://raw.githubusercontent.com/sameeksha-dalvi/issue-notifier-bot/main/select_labels.png)

---

## Run the Bot

Manual run (for testing):

```bash
node index.js
```

Run automatically every 5 minutes using PM2 (recommended):

```bash
pm2 start index.js --cron "*/5 * * * *" --name github-issue-bot
```

Save the PM2 process so it restarts after reboot:

```bash
pm2 save
pm2 startup
```

View logs:

```bash
pm2 logs github-issue-bot
```

Restart after code changes:

```bash
pm2 restart github-issue-bot
```
---

## Who This Bot Is For
Open-source contributors who want notifications only for certain labels (like good first issue, help wanted, maintainer only).

Maintainers who want to track specific types of issues quickly.

---

## Why Use This Bot
- **Runs locally** – your GitHub token stays on your machine; nothing is sent to third-party servers.
- **Zero cost** – Unlike some cloud automation services that have usage limits or subscription fees, this bot runs locally and is free.
- **Customizable** – select exactly which labels to track for notifications.
- **Lightweight** – simple Node.js script that works in the background without heavy infrastructure.

---

## Limitations

- **Runs only when your system is on** – The bot works only if the script is running; it cannot send notifications if your computer is off.  
- **Relies on GitHub API limits** – GitHub may restrict the number of requests per hour for personal access tokens.  
- **Only tracks selected labels** – Issues without the labels you chose in `config.json` will not trigger notifications.  
- **No user interface** – Configuration is done via CLI prompts and the `.env` file.  
- **Telegram notifications only** – Alerts are sent only through Telegram; other platforms like WhatsApp or email are not supported.  


---

## License

MIT License
