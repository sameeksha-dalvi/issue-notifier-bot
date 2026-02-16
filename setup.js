import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import inquirer from 'inquirer';

async function setupBot() {
    try {
        let config = { repo: '', labels: [] };
        let editConfig = false;

        // Check if config.json exists
        if (fs.existsSync('config.json')) {
            config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
            console.log('Found existing config.json');

            // Ask if user wants to edit it
            const { edit } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'edit',
                    message: 'Config already exists. Do you want to edit it?',
                    default: false
                }
            ]);
            editConfig = edit;
        } else {
            console.log('Creating new config.json');
            editConfig = true; // No config exists, so we need setup
        }

        if (editConfig) {
            // Ask for repo if not set or editing
            const { repo } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'repo',
                    message: 'Enter GitHub repo (owner/repo):',
                    default: config.repo
                }
            ]);
            config.repo = repo;

            // Create last_issue.txt if missing
            if (!fs.existsSync('last_issue.txt')) {
                fs.writeFileSync('last_issue.txt', '0');
                console.log('Created last_issue.txt with 0');
            }

            // Fetch all labels from GitHub

            async function fetchAllLabels(repo) {
                let page = 1;
                let allLabels = [];
                while (true) {
                    const response = await axios.get(`https://api.github.com/repos/${repo}/labels`, {
                        headers: {
                            Accept: 'application/vnd.github+json',
                            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
                        },
                        params: { per_page: 100, page } // fetch 100 per page
                    });

                    const labels = response.data.map(l => l.name);
                    allLabels.push(...labels);

                    if (response.data.length < 100) break; // last page
                    page++;
                }
                return allLabels;
            }


            console.log('Fetching labels from GitHub...');
            const allLabels = await fetchAllLabels(config.repo);

            console.log("Fetched labels from GitHub:");
            allLabels.forEach(l => console.log(`- "${l}"`));



            if (allLabels.length === 0) {
                console.log('No labels found in this repo.');
            } else {
                // Let user select labels to track
                const { selectedLabels } = await inquirer.prompt([
                    {
                        type: 'checkbox',
                        name: 'selectedLabels',
                        message: 'Select labels to track:',
                        choices: allLabels,
                        default: config.labels
                    }
                ]);

                config.labels = selectedLabels;
            }

            // Save updated config.json
            fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
            console.log('Setup complete! config.json saved with selected labels.');
        } else {
            console.log('Skipping edit. Using existing config.json.');
        }
    } catch (err) {
        console.error('Error during setup:', err.response ? err.response.data : err.message);
    }
}

// Run setup
setupBot();
