const { execSync } = require('child_process');
const fs = require('fs');

/**
 * @summary Generates an AI-powered Git branch name based on changed files
 * @description Sends a request to the Groq API to generate a descriptive branch name
 * @async
 * @function getAIBranchName
 * @param {string[]} changedFiles - Array of file paths that have been changed
 * @returns {Promise<string>} A lowercase, hyphenated branch name
 * @example
 * const branchName = await getAIBranchName(['src/components/Button.tsx', 'styles/main.css']);
 * // Returns: 'update-button-component-and-main-styles'
 * @see {@link https://github.com/Designaroni/js-doc-best-practices|JSDoc Best Practices}
 */
async function getAIBranchName(changedFiles) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [
        {role: "system", content: "You are an AI assistant tasked with creating descriptive Git branch names. Respond in JSON format with a 'branch_name' field."},
        {role: "user", content: `Create a descriptive Git branch name for changes in these files: ${changedFiles.join(', ')}`}
      ],
      temperature: 0.7,
      max_tokens: 100,
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  const branchName = JSON.parse(data.choices[0].message.content).branch_name;
  return branchName.toLowerCase().replace(/\s+/g, '-');
}

async function main() {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  const changedFiles = execSync('git diff --name-only HEAD@{1} HEAD').toString().trim().split('\n');

  let branchPrefix = 'feature';
  if (changedFiles.some(file => file.startsWith('apps/chrome-extension'))) {
    branchPrefix = 'feature/chrome-extension';
  } else if (changedFiles.some(file => file.startsWith('apps/web'))) {
    branchPrefix = 'feature/web';
  } else if (changedFiles.some(file => file.startsWith('.github/workflows'))) {
    branchPrefix = 'ci';
  } else if (changedFiles.some(file => file.startsWith('packages'))) {
    branchPrefix = 'feature/packages';
  } else if (changedFiles.some(file => file === 'package.json' || file === 'yarn.lock')) {
    branchPrefix = 'chore/dependencies';
  } else if (changedFiles.some(file => !file.includes('/'))) {
    branchPrefix = 'chore/root';
  }

  const aiBranchName = await getAIBranchName(changedFiles);
  const gitFlowBranch = `${branchPrefix}/${aiBranchName}`;

  if (gitFlowBranch !== currentBranch) {
    console.log(`Switching to GitFlow branch: ${gitFlowBranch}`);
    execSync(`git checkout -b ${gitFlowBranch}`);
  }

  const payload = {
    branch: gitFlowBranch,
    changedFiles: changedFiles
  };
  fs.writeFileSync('.github/workflow_payload.json', JSON.stringify(payload, null, 2));
  execSync('git add .github/workflow_payload.json');
  execSync('git commit -m "chore: add workflow payload for custom push"');
  
  console.log('Pushing changes and triggering GitHub Actions workflow...');
  execSync(`git push origin ${gitFlowBranch}`);
}

main().catch(console.error);
