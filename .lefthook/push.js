const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const util = require('util');
const execAsync = util.promisify(require('child_process').exec);

const { execSync } = require('child_process');
const { generateObject } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
const { z } = require('zod');

/**
 * Dynamically imports the 'ora' module for creating elegant terminal spinners.
 * If the import fails, a simple fallback is provided to ensure the script continues to function.
 * 
 * @type {Function|Object}
 * @example
 * // Successful import usage:
 * const spinner = ora('Loading...').start();
 * // ... some async operation
 * spinner.succeed('Operation completed');
 * 
 * // Fallback usage (if import fails):
 * const spinner = ora('Loading...').start();
 * // ... some async operation
 * spinner.succeed('Operation completed');
 * // Both cases will work, but the fallback won't display an actual spinner
 */
let ora;
import('ora').then(module => {
  ora = module.default;
}).catch(error => {
  console.error('Failed to import ora:', error);
  // Simple fallback in case ora fails to load
  ora = () => ({
    start: () => ({ succeed: () => {}, fail: () => {} }),
    succeed: () => {},
    fail: () => {}
  });
});

let inquirer;
import('inquirer').then(module => {
  inquirer = module.default;
}).catch(error => {
  console.error('Failed to import inquirer:', error);
});

/**
 * Creates and returns a CustomPushProcess instance.
 * This factory function initializes the process that automates Git operations
 * with AI-assisted branch and commit suggestions.
 * 
 * @returns {CustomPushProcess} An instance of the CustomPushProcess class.
 * @example
 * const customPushProcess = createCustomPushProcess();
 * await customPushProcess.main();
 */
function createCustomPushProcess() {
  class CustomPushProcess {
    /**
     * Initializes a new instance of the CustomPushProcess class.
     * Sets up the OpenAI API key.
     */
    constructor(options = {}) {
      this.openAiApiKey = null;
      this.recentCommitsLimit = options.recentCommitsLimit || 3;
    }

    /**
     * Retrieves file changes for the given list of changed files.
     * 
     * @param {string[]} changedFiles - An array of file paths that have been changed.
     * @returns {Array<Object>} An array of objects containing detailed information about each changed file.
     */
    getFileChanges(changedFiles) {
      return changedFiles.map(file => {
        const originalContent = this.getOriginalFileContent(file);
        const currentContent = fs.readFileSync(file, 'utf-8');
        const diff = this.getFileDiff(file);
    
        return {
          path: file,
          originalContent,
          currentContent,
          diff: this.truncateDiff(diff, 1000), // Limit diff size to avoid exceeding token limits
          metadata: {
            linesAdded: execSync(`git diff --numstat HEAD ${file} | cut -f1`).toString().trim(),
            linesRemoved: execSync(`git diff --numstat HEAD ${file} | cut -f2`).toString().trim(),
            fileType: path.extname(file),
            lastModified: execSync(`git log -1 --format=%cd ${file}`).toString().trim(),
          }
        };
      });
    }
    
    /**
     * Retrieves the original content of a file from the last commit.
     * 
     * @param {string} file - The path of the file.
     * @returns {string} The original content of the file or an empty string if the file is new.
     */
    getOriginalFileContent(file) {
      try {
        return execSync(`git show HEAD:${file}`).toString();
      } catch (error) {
        return ''; // File is new and not in the last commit
      }
    }
    
    /**
     * Retrieves the diff of a file compared to the HEAD.
     * 
     * @param {string} file - The path of the file.
     * @returns {string} The diff of the file or an empty string if there's an error.
     */
    getFileDiff(file) {
      try {
        return execSync(`git diff HEAD ${file}`).toString();
      } catch (error) {
        console.error(`Error getting diff for ${file}:`, error);
        return '';
      }
    }
    
    /**
     * Truncates a diff string to a specified maximum length.
     * 
     * @param {string} diff - The diff string to truncate.
     * @param {number} [maxLength=1000] - The maximum length of the truncated diff.
     * @returns {string} The truncated diff string.
     */
    truncateDiff(diff, maxLength = 1000) {
      if (!diff) return '';
      if (diff.length <= maxLength) return diff;
      return diff.substring(0, maxLength) + '...';
    }

    /**
     * Retrieves the OpenAI API key from environment variables or a config file.
     * If not found, prompts the user to enter it.
     * 
     * @returns {Promise<string>} The OpenAI API key.
     * @example
     * const apiKey = await customPushProcess.getOpenAiApiKey();
     * console.log('API Key:', apiKey);
     */
    async getOpenAiApiKey() {
      if (process.env.OPENAI_API_KEY) {
        return process.env.OPENAI_API_KEY;
      }

      const configPath = path.join(process.env.HOME, '.openai_config');
      if (fs.existsSync(configPath)) {
        try {
          const configContent = fs.readFileSync(configPath, 'utf8');
          const apiKey = configContent.trim();
          if (apiKey.startsWith('sk-')) {
            return apiKey;
          }
        } catch (error) {
          console.error('Error reading OpenAI config:', error);
        }
      }

      const apiKey = await this.promptForOpenAiApiKey();
      
      if (apiKey) {
        try {
          fs.writeFileSync(configPath, apiKey, { mode: 0o600 });
          console.log(chalk.green('OpenAI API Key saved for future use.'));
        } catch (error) {
          console.error('Error saving OpenAI config:', error);
        }
      }

      return apiKey;
    }

    /**
     * Prompts the user to enter their OpenAI API key and saves it for future use.
     * 
     * @returns {Promise<string>} The entered OpenAI API key.
     * @example
     * const apiKey = await customPushProcess.promptForOpenAiApiKey();
     * console.log('Entered API Key:', apiKey);
     */
    async promptForOpenAiApiKey() {
      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your OpenAI API Key:',
          validate: input => input.startsWith('sk-') || 'Invalid API Key format'
        }
      ]);

      const configPath = path.join(process.env.HOME, '.openai_config');
      fs.writeFileSync(configPath, apiKey, { mode: 0o600 });
      console.log(chalk.green('OpenAI API Key saved for future use.'));

      return apiKey;
    }

    /**
     * Generates a directory structure object, excluding specified directories.
     * 
     * @returns {Object} An object representing the directory structure.
     * @example
     * const structure = customPushProcess.getDirectoryStructure();
     * console.log('Project structure:', JSON.stringify(structure, null, 2));
     */
    getDirectoryStructure() {
      const ignoreDirs = fs.readFileSync('.gitignore', 'utf8')
        .split('\n')
        .filter(line => line.trim() !== '' && !line.startsWith('#'))
        .map(line => line.trim().replace(/^\//, ''));
      const structure = {};
    
      function readDir(dir, obj) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          if (ignoreDirs.includes(item)) continue;
          const path = `${dir}/${item}`;
          if (fs.statSync(path).isDirectory()) {
            obj[item] = {};
            readDir(path, obj[item]);
          } else {
            obj[item] = null;
          }
        }
      }
    
      readDir('.', structure);
      return structure;
    }

    /**
     * Splits an array into smaller chunks of a specified size.
     * 
     * @param {Array} array - The array to be split into chunks.
     * @param {number} chunkSize - The size of each chunk.
     * @returns {Array<Array>} An array of chunks, where each chunk is an array of elements from the original array.
     * @example
     * const originalArray = [1, 2, 3, 4, 5, 6, 7, 8];
     * const chunkedArray = splitIntoChunks(originalArray, 3);
     * // Result: [[1, 2, 3], [4, 5, 6], [7, 8]]
     */
    splitIntoChunks(array, chunkSize) {
      if (!array || array.length === 0) return [];
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    }

    /**
     * Retrieves the README file content.
     * @returns {string} The content of the README file or an empty string if an error occurs.
     */
    getReadme() {
      try {
        return fs.readFileSync('README.md', 'utf8');
      } catch (error) {
        return '';
      }
    }

    /**
     * Retrieves the project context including directory structure, package.json info, Git info, and recent commits.
     * @returns {Object} An object containing project context information.
     */
    getProjectContext() {
      const projectContext = {
        structure: this.getDirectoryStructure(),
        packageJson: this.getPackageJsonInfo(),
        readme: this.getReadme(),
        gitInfo: this.getGitInfo(),
        recentCommits: this.getRecentCommits(),
      };
      return projectContext;
    }

    /**
     * Retrieves information from the package.json file.
     * @returns {Object} An object containing package.json information or an empty object if an error occurs.
     */
    getPackageJsonInfo() {
      try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return {
          name: packageJson.name,
          version: packageJson.version,
          description: packageJson.description,
          dependencies: Object.keys(packageJson.dependencies || {}),
          devDependencies: Object.keys(packageJson.devDependencies || {})
        };
      } catch (error) {
        console.error('Error reading package.json:', error);
        return {};
      }
    }

    /**
     * Retrieves Git information including the current branch and remote URL.
     * @returns {Object} An object containing Git information or an empty object if an error occurs.
     */
    getGitInfo() {
      try {
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
        return { currentBranch, remoteUrl };
      } catch (error) {
        console.error('Error getting Git info:', error);
        return {};
      }
    }

    /**
     * Retrieves recent Git commits.
     * @param {number} [limit=5] - The number of recent commits to retrieve.
     * @returns {Array<Object>} An array of objects containing commit information or an empty array if an error occurs.
     */
    getRecentCommits(limit = 5) {
      const safeLimit = Math.max(1, Math.floor(Number(limit) || 5));
      
      try {
        const spawn = childProcess.spawnSync('git', ['log', `-${safeLimit}`, '--pretty=format:%h|%s|%an|%ad']);
        
        if (spawn.status !== 0) {
          const errorText = String(spawn.stderr);
          console.error('Error getting recent commits:', errorText);
          return [];
        }
        
        const commits = spawn.stdout.toString().trim().split('\n');
        return commits.map(commit => {
          const [hash, subject, author, date] = commit.split('|');
          return { hash, subject, author, date };
        });
      } catch (error) {
        console.error('Fatal error getting recent commits:', error);
        return [];
      }
    }

    /**
     * Generates AI-suggested branches and commits based on changed files.
     * 
     * @param {string[]} changedFiles - An array of file paths that have been changed.
     * @param {Object} originalFiles - An object containing the original content of changed files.
     * @param {string} [userContext=''] - Additional context provided by the user.
     * @returns {Promise<Object>} An object containing suggested branches and commits.
     * @throws {Error} If there's an issue generating suggestions.
     */
    async getAIBranchesAndCommits(changedFiles, originalFiles, userContext = '') {
      const spinner = ora('🤖 Analyzing changes and generating suggestions...').start();
      try {
        const projectContext = this.getProjectContext();
        const fileChanges = this.getFileChanges(changedFiles);
        
        // Reduzir o tamanho do contexto do projeto
        const reducedProjectContext = {
          name: projectContext.packageJson?.name || '',
          description: projectContext.packageJson?.description?.slice(0, 200) || '',
          recentCommits: this.getRecentCommits(this.recentCommitsLimit),
          mainDirectories: this.getMainDirectories(),
          readme: projectContext.readme,
        };
    
        // Preparar mudanças de arquivo com resumos concisos
        const preparedFileChanges = fileChanges.map(file => ({
          path: file.path,
          summary: this.summarizeChanges(file.diff, 150),
          metadata: {
            linesAdded: file.metadata.linesAdded,
            linesRemoved: file.metadata.linesRemoved,
            fileType: file.metadata.fileType,
          }
        }));
    
        // Dividir as mudanças em chunks
        const chunks = this.splitIntoChunks(preparedFileChanges, 5); // 5 arquivos por chunk
    
        let allAnalysis = [];
        
        for (const chunk of chunks) {
          const chunkAnalysis = await this.getAIAnalysisForChunk(reducedProjectContext, chunk, userContext);
          allAnalysis.push(...chunkAnalysis);
        }
        
        // Gerar sugestões finais com base em todas as análises
        const finalSuggestions = await this.getFinalAISuggestions(reducedProjectContext, allAnalysis, userContext);
    
        spinner.succeed(chalk.green('AI analysis and suggestions generated successfully!'));
        return finalSuggestions;
      } catch (error) {
        spinner.fail(chalk.red('Failed to generate AI analysis and suggestions'));
        console.error(chalk.red(error));
        throw error;
      }
    }

    /**
     * Summarizes the changes in a git diff.
     * @param {string} diff - The git diff string to summarize.
     * @param {number} maxLength - The maximum length of the summary.
     * @returns {string} A summary of the changes, including lines added and removed.
     */
    summarizeChanges(diff, maxLength) {
      const lines = diff.split('\n');
      const addedLines = lines.filter(line => line.startsWith('+')).length;
      const removedLines = lines.filter(line => line.startsWith('-')).length;
      return `${addedLines} lines added, ${removedLines} lines removed`.slice(0, maxLength);
    }
    
    /**
     * Retrieves the main directories of the project.
     * @returns {string[]} An array of directory names in the project root.
     */
    getMainDirectories() {
      return fs.readdirSync('.', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    }
    
    /**
     * Retrieves recent git commits.
     * @param {number} count - The number of recent commits to retrieve.
     * @returns {Array<{hash: string, subject: string, author: string, date: string}>} An array of recent commit objects.
     */
    getRecentCommits(count) {
      try {
        const output = execSync(`git log -${count} --pretty=format:"%h|%s|%an|%ad"`).toString().trim();
        if (!output) {
          console.warn('No recent commits found.');
          return [];
        }
        return output.split('\n').map(line => {
          const [hash, subject, author, date] = line.split('|');
          return { hash, subject, author, date };
        });
      } catch (error) {
        console.error('Error fetching recent commits:', error.message);
        return [];
      }
    }

    /**
     * Analyzes a chunk of file changes using AI.
     * 
     * @param {Object} projectContext - Context information about the project.
     * @param {Array<Object>} fileChangesChunk - A chunk of file changes to analyze.
     * @param {string} userContext - Additional context provided by the user.
     * @returns {Promise<Array<Object>>} An array of objects containing analysis for each file.
     */
    async getAIAnalysisForChunk(projectContext, fileChangesChunk, userContext) {
      const openai = createOpenAI({ apiKey: this.openAiApiKey });
  
      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          files: z.array(z.object({
            path: z.string(),
            summary: z.string(),
            impact: z.string()
          }))
        }),
        prompt: `Analyze the following file changes in the context of the project:

        Project Context:
        ${JSON.stringify(projectContext, null, 2)}

        File Changes:
        ${JSON.stringify(fileChangesChunk, null, 2)}

        User Context: ${userContext}

        For each file, provide a brief summary of the changes and assess their impact on the project.
        Focus on the most significant changes and their implications for the project's functionality, architecture, or performance.`
      });
  
      return object.files;
    }
  
    /**
     * Generates final AI suggestions for branches and commits based on all changes.
     * 
     * @param {Object} projectContext - Context information about the project.
     * @param {Array<Object>} allChanges - All analyzed file changes.
     * @param {string} userContext - Additional context provided by the user.
     * @returns {Promise<Object>} An object containing suggested branches and commits.
     */
    async getFinalAISuggestions(projectContext, allChanges, userContext) {
      const openai = createOpenAI({ apiKey: this.openAiApiKey });
  
      const { object } = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          branches: z.array(z.object({
            name: z.string(),
            description: z.string(),
            commits: z.array(z.object({
              message: z.string(),
              files: z.array(z.string())
            }))
          }))
        }),
        prompt: `Based on the following project context and file changes, generate appropriate Git branches and commits for implementing the repository workflow automation feature:
  
        Project Context: 
        ${JSON.stringify(projectContext)}

        User context: 
        ${userContext}

        All Changes: 
        ${JSON.stringify(allChanges)}
  
        Guidelines:
        1. Create branches that logically group related changes.
        2. Branch names should follow the format: feature/<scope>/<detailed-description>
        3. Commit messages must follow the conventional commits format: <type>(<scope>): <detailed description>
        4. Group related changes into logical commits within each branch.
        5. Consider the scope and impact of changes when deciding on the branch and commit structure.
        6. Provide a brief description for each branch to explain its purpose.
        7. Remember that these changes are part of automating the repository workflow, but there might be distinct aspects that warrant separate branches.
  
        Generate a JSON object with appropriate branches and commits based on these guidelines, ensuring they accurately reflect the nature and scope of the changes as part of the repository automation feature.`
      });
  
      return object;
    }

    /**
     * Allows the user to edit AI-generated suggestions interactively.
     * 
     * @param {Object} suggestions - The AI-generated suggestions.
     * @returns {Promise<Object>} The edited suggestions.
     */
    async editAISuggestions(suggestions) {
      const editedSuggestions = JSON.parse(JSON.stringify(suggestions)); // Deep copy

      console.log(chalk.cyan('\nCurrent suggestions:'));
      await this.displaySuggestions(editedSuggestions);

      const { editChoice } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'editChoice',
          message: 'Do you want to edit these suggestions?',
          default: false
        }
      ]);

      if (!editChoice) {
        return suggestions;
      }

      for (let i = 0; i < editedSuggestions.branches.length; i++) {
        const branch = editedSuggestions.branches[i];
        const { branchName, branchDescription } = await inquirer.prompt([
          {
            type: 'input',
            name: 'branchName',
            message: `Edit branch name:`,
            default: branch.name
          },
          {
            type: 'input',
            name: 'branchDescription',
            message: `Edit branch description:`,
            default: branch.description
          }
        ]);

        branch.name = branchName;
        branch.description = branchDescription;

        for (let j = 0; j < branch.commits.length; j++) {
          const commit = branch.commits[j];
          const { commitMessage } = await inquirer.prompt([
            {
              type: 'input',
              name: 'commitMessage',
              message: `Edit commit message:`,
              default: commit.message
            }
          ]);

          commit.message = commitMessage;
        }
      }

      console.log(chalk.cyan('\nUpdated suggestions:'));
      await this.displaySuggestions(editedSuggestions);

      const { confirmChoice } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmChoice',
          message: 'Do you want to proceed with these changes?',
          default: true
        }
      ]);

      return confirmChoice ? editedSuggestions : suggestions;
    }

    /**
     * Displays the AI-generated suggestions for branches and commits.
     * 
     * @param {Object} suggestions - The object containing branch and commit suggestions.
     * @param {Array} suggestions.branches - An array of branch objects.
     * @param {string} suggestions.branches[].name - The name of the branch.
     * @param {string} suggestions.branches[].description - The description of the branch.
     * @param {Array} suggestions.branches[].commits - An array of commit objects for the branch.
     * @param {string} suggestions.branches[].commits[].message - The commit message.
     * @param {Array} suggestions.branches[].commits[].files - An array of file paths affected by the commit.
     * @returns {Promise<void>}
     */
    async displaySuggestions(suggestions) {
      if (!suggestions || !suggestions.branches) {
        console.error('No valid suggestions available to display.');
        return;
      }

      console.log(chalk.bold.cyan('AI Suggestions'));
    
      suggestions.branches.forEach((branch, index) => {
        console.log(chalk.bold.green(`\nBranch ${index + 1}: ${branch.name}`));
        console.log(chalk.yellow(`Description: ${branch.description}`));
        console.log(chalk.cyan('Commits:'));
    
        branch.commits.forEach((commit, commitIndex) => {
          console.log(chalk.white(`  ${commitIndex + 1}. ${commit.message}`));
          console.log(chalk.gray(`     Files:`));
          commit.files.forEach(file => {
            console.log(chalk.gray(`       - ${file}`));
          });
          console.log(); // Add an empty line between commits
        });
    
        console.log(chalk.gray('---')); // Add a separator between branches
      });
    
      console.log(chalk.cyan('End of Suggestions'));
    }

    /**
     * Implements the suggested changes by creating branches, commits, and pushing to the remote repository.
     * 
     * @param {Object} suggestions - The object containing branch and commit suggestions.
     * @param {Array} suggestions.branches - An array of branch objects.
     * @param {string} suggestions.branches[].name - The name of the branch to create.
     * @param {Array} suggestions.branches[].commits - An array of commit objects for the branch.
     * @param {string} suggestions.branches[].commits[].message - The commit message.
     * @param {Array} suggestions.branches[].commits[].files - An array of file paths to be added in the commit.
     * @returns {Promise<void>}
     */
    async implementChanges(suggestions) {
      for (const branch of suggestions.branches) {
        const branchSpinner = ora(`Creating branch: ${branch.name}`).start();
        try {
          await execAsync(`git checkout -b ${branch.name}`);
          branchSpinner.succeed(chalk.green(`Branch created: ${branch.name}`));
    
          for (const commit of branch.commits) {
            const commitSpinner = ora(`Creating commit: ${commit.message}`).start();
            try {
              await execAsync(`git add ${commit.files.join(' ')}`);
              await execAsync(`git commit -m "${commit.message}"`);
              commitSpinner.succeed(chalk.green(`Commit created: ${commit.message}`));
            } catch (error) {
              commitSpinner.fail(chalk.red(`Failed to create commit: ${commit.message}`));
              console.error(error);
            }
          }
    
          const pushSpinner = ora(`Pushing branch: ${branch.name}`).start();
          try {
            await execAsync(`git push origin ${branch.name}`);
            pushSpinner.succeed(chalk.green(`Branch pushed: ${branch.name}`));
          } catch (error) {
            pushSpinner.fail(chalk.red(`Failed to push branch: ${branch.name}`));
            console.error(error);
          }
        } catch (error) {
          branchSpinner.fail(chalk.red(`Failed to create branch: ${branch.name}`));
          console.error(error);
        }
      }
    }

    /**
     * The main method that orchestrates the entire custom push process.
     * 
     * @returns {Promise<void>}
     */
    async main() {
      console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.cyan.bold('Shadcn/UI Theme Creator'));
      console.log(chalk.cyan('Custom Push Process for Chrome Extension'));
      console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.cyan('Author: Felipe Barcelos (felipe.barcelospro@gmail.com)'));
      console.log(chalk.cyan('Repo: https://github.com/felipebarcelospro/shadcn-theme-creator'));
      console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

      const steps = [
        '1. Analyze your changes using AI (OpenAI GPT-4)',
        '2. Suggest branch names and commit messages',
        '3. Allow you to review and edit the suggestions',
        '4. Create a new branch and commit your changes',
        '5. Push to the remote repository',
        '6. Trigger our CI/CD pipeline for building and testing'
      ];

      steps.forEach(step => console.log(chalk.cyan(`• ${step}`)));

      console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.cyan('For more details, see README.md and GITFLOW.md in the project root.'));
      console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

      try {
        this.openAiApiKey = await this.getOpenAiApiKey();

        if (!this.openAiApiKey) {
          console.log(chalk.red('OpenAI API Key is required to proceed.'));
          return;
        }

        console.log(chalk.cyan('📌 Current branch: ') + chalk.yellow(execSync('git rev-parse --abbrev-ref HEAD').toString().trim()));

        const changedFiles = execSync('git diff --name-only HEAD').toString().split('\n').filter(Boolean);
        console.log(chalk.cyan('📄 Changed files:'));
        console.log(chalk.yellow(`   Total files: ${changedFiles.length}`));
        console.log(chalk.yellow(`   Types: ${[...new Set(changedFiles.map(file => path.extname(file) || 'no extension'))].join(', ')}`));

        for (const file of changedFiles) {
          try {
            execSync(`git diff --exit-code --quiet HEAD ${file}`);
          } catch (error) {
            if (error.status === 1) {
              console.log(chalk.yellow(`   Modified: ${file}`));
            } else {
              console.error(chalk.red(`Error checking file ${file}:`, error));
            }
          }
        }

        const newFiles = execSync('git ls-files --others --exclude-standard').toString().split('\n').filter(Boolean);
        for (const file of newFiles) {
          console.log(chalk.green(`New file detected: ${file}`));
        }

        const { userContext } = await inquirer.prompt([
          {
            type: 'input',
            name: 'userContext',
            message: 'Enter any additional context for the AI (optional):',
          }
        ]);

        const aiSuggestions = await this.getAIBranchesAndCommits(changedFiles, [], userContext);

        await this.displaySuggestions(aiSuggestions);

        const editedSuggestions = await this.editAISuggestions(aiSuggestions);

        const { proceed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: 'Do you want to proceed with these changes?',
            default: true
          }
        ]);

        if (!proceed) {
          console.log(chalk.red('Process aborted by user.'));
          return;
        }

        await this.implementChanges(editedSuggestions);

        console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.bold.cyan('🎉 Custom push process completed successfully!'));
        console.log(chalk.cyan('Summary of Changes:'));        
        console.log(chalk.cyan(`• Files Analyzed: ${chalk.green(changedFiles.length)}`));
        console.log(chalk.cyan(`• Branches Created: ${chalk.green(editedSuggestions.branches.length)}`));
        editedSuggestions.branches.forEach((branch, index) => {
          console.log(chalk.cyan(`  ${index + 1}. Branch Name: ${chalk.green(branch.name)}`));
          console.log(chalk.cyan(`     Link: ${chalk.yellow(`https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome/tree/${branch.name}`)}`));
          branch.commits.forEach((commit, commitIndex) => {
            console.log(chalk.cyan(`     ${commitIndex + 1}. Commit Message: ${chalk.green(commit.message)}`));
          });
        });
      } catch (error) {
        console.error(chalk.red.bold('❌ Error in custom push process:'));
        console.error(chalk.red(error));
      }
    }
  }

  return new CustomPushProcess();
}

/**
 * The main function that initializes and runs the custom push process.
 * It ensures that the 'ora' module is loaded before starting the process.
 * 
 * @returns {Promise<void>}
 * @example
 * main().catch(console.error);
 */
async function main() {
  try {
    await import('ora');
    await import('inquirer');
    
    const customPushProcess = createCustomPushProcess();
    await customPushProcess.main();
  } catch (error) {
    console.error(chalk.red.bold('❌ Unhandled error in main process:'));
    console.error(chalk.red(error));
  }
}

main().catch(console.error);
