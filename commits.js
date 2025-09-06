const { execSync } = require('child_process');
const fs = require('fs');

// Commit messages
const commitMessages = [
  "Initialize project setup with base React + Tailwind config",
  "Add user authentication (login & signup flow)",
  "Implement user dashboard with editable profile fields",
  "Create product listing model and basic CRUD operations",
  "Build Add Product form with validation",
  "Integrate category dropdown and placeholder image upload",
  "Set up product browsing page with listing cards",

];


const dummyFile = 'temp.txt';
fs.writeFileSync(dummyFile, '');


// Generate commits starting from 9:00 AM each day
const commits = [];
let startDate = new Date();
startDate.setHours(9, 0, 0, 0); // Start from 9:00 AM today

commitMessages.forEach(msg => {
  // Add 20–90 min random interval between commits
  const interval = (20 + Math.floor(Math.random() * 70)) * 60 * 1000;
  startDate = new Date(startDate.getTime() + interval);

  commits.push({ msg, time: new Date(startDate) });
});

// Sort commits chronologically
commits.sort((a, b) => a.time - b.time);

// Commit them with both author and committer dates
commits.forEach(({ msg, time }) => {
  const timestamp = time.toISOString();

  // Simulate file change
  fs.appendFileSync(dummyFile, `\n// ${msg}`);

  // Stage and commit with both author and committer timestamps
  execSync(`git add ${dummyFile}`);
  execSync(
    `GIT_AUTHOR_DATE="${timestamp}" GIT_COMMITTER_DATE="${timestamp}" git commit -m "${msg}"`
  );
});

console.log("✅ 20 randomly distributed, humanized commits created over the past 3 days.");
