# Detailed Action Planning

Based on the implemented actions and remaining tasks, here's a comprehensive plan with a checklist:

## Implemented Actions
- [x] analyze-code
- [x] apply-branch-protection
- [x] auto-assign
- [x] auto-label
- [x] build-app
- [x] check-existing-pr
- [x] clean-up-branch
- [x] cleanup-stale-branches
- [x] close-stale-issues
- [x] create-discussion-post
- [x] create-or-update-branch
- [x] create-or-update-pr
- [x] create-project-card
- [x] deploy-app
- [x] generate-metrics
- [x] install-dependencies
- [x] link-related-items
- [x] merge-branch
- [x] prioritize-issue
- [x] run-linting
- [x] run-post-deployment-tests
- [x] run-security-checks
- [x] run-tests
- [x] send-webhook
- [x] validate-config
- [x] setup-context-and-prerequisites
- [x] check-dependency-updates
- [x] create-dependency-update-prs
- [x] auto-merge-updates
- [x] security-vulnerability-scan
- [x] update-documentation
- [x] validate-branch-name
- [x] wait-for-pr
- [x] ai-generate-content
- [x] check-review-guidelines
- [x] enforce-review-approval
- [x] update-pr-status
- [x] verify-deployment
- [x] rollback-deployment
- [x] assign-reviewers
- [x] run-code-quality
- [x] post-pr-comment

## Action Implementation Details

================================================================================

# setup-context-and-prerequisites

## Description
This action sets up the necessary context and prerequisites for the workflow, ensuring all subsequent actions have the required information and environment to execute properly.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)
- Branch Management Workflow (branch-management.yml)
- Issue Management Workflow (issue-management.yml)
- PR Management Workflow (pr-management.yml)
- Release Management Workflow (release-management.yml)
- Documentation Update Workflow (documentation-update.yml)
- Metrics Generation Workflow (metrics-generation.yml)
- Repository Setup Workflow (repository-setup.yml)
- Performance and Availability Monitoring Workflow (performance-availability-monitoring.yml)
- Disaster Recovery Workflow (disaster-recovery.yml)
- Code Review Workflow (code-review.yml)
- Dependency Management Workflow (dependency-management.yml)

## Input:
- github-token:
    description: 'GitHub token for API access'
    required: true

## Output:
- repository-context:
    description: 'JSON object containing repository context'
- config-data:
    description: 'Parsed configuration data'
- environment-variables:
    description: 'Set environment variables'

## Implementation Details:
1. Checkout repository
2. Setup Node.js
3. Install dependencies (@actions/github, @actions/core, @octokit/rest)
4. Fetch repository metadata using GitHub API
5. Load and parse config.yml
6. Set up environment variables
7. Validate repository settings
8. Determine current branch and commit information
9. Create repository context
10. Output results

## Error Handling:
- Handle missing or invalid config.yml
- Handle inability to fetch repo details
- Log all steps for debugging
- Use core.setFailed() to report errors

================================================================================

# validate-config

## Description
This action validates the existence and structure of the config.yml file in the repository.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)
- Other workflows that require configuration validation

## Input:
- github-token:
    description: 'GitHub token for API access'
    required: true

## Output:
- config-validation-status: Boolean indicating if the configuration is valid

## Implementation Details:
1. Check for the existence of .github/config.yml file
2. Validate the YAML structure of the config file
3. Install yaml-lint for YAML validation

## Error Handling:
- If config.yml is not found, set validation status to false and output an error message
- If config.yml has invalid YAML structure, set validation status to false and output an error message
- Exit with error code 1 for any validation failures

================================================================================

# install-dependencies

## Description
This action installs project dependencies with efficient caching.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)

## Input:
- package-manager:
    description: 'Package manager type (npm, yarn, pnpm)'
    required: true
- cache-key:
    description: 'Cache key based on lock file'
    required: true
- working-directory:
    description: 'Working directory for installation'
    required: false
    default: '.'

## Output:
- installation-status: Status of dependency installation (success/failure)
- installed-packages: List of installed packages (JSON array)
- cache-hit: Whether there was a cache hit

## Implementation Details:
1. Setup Node.js environment
2. Cache dependencies using actions/cache@v3
3. Install dependencies based on the specified package manager
4. Get list of installed packages
5. Set outputs (installation status, installed packages, cache hit)

## Error Handling:
- Handle unsupported package managers
- Provide detailed logs for installation process
- Exit with error for unsupported package managers

================================================================================

# run-linting

## Description
This action runs linting checks on the codebase to ensure code quality and consistency.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)

## Input:
- working-directory:
    description: 'Directory to run linting in (for monorepos)'
    required: false
    default: '.'

## Output:
- linting-status: Overall linting status (pass/fail)
- linting-report: Detailed linting report (JSON object)
- pr-comment: Formatted output for PR comments

## Implementation Details:
1. Setup Node.js environment
2. Detect package manager and install dependencies
3. Detect and run appropriate linter (ESLint, TSLint, or Prettier)
4. Parse linting results
5. Output results

## Error Handling:
- Handle different package managers (npm, yarn, pnpm)
- Detect and use project-specific linter configurations
- Provide detailed error messages for linting failures
- Generate appropriate outputs for both successful and failed linting runs

================================================================================

# run-tests

## Description
This action runs comprehensive tests on the codebase to ensure functionality and catch regressions.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)

## Input:
- Working directory (optional, for monorepos)
- Test command
- Coverage command (optional)
- Coverage threshold (optional, default: 80%)

## Output:
- Test status (pass/fail)
- Coverage report (JSON object)
- Performance metrics
- JUnit XML report path

## Implementation Details:
1. Setup Node.js environment
2. Install dependencies using custom action
3. Detect test framework (Jest or Vitest)
4. Execute test command
5. Run coverage command (if specified)
6. Check coverage threshold (if specified)
7. Parse and collect test results
8. Output comprehensive test information

## Error Handling:
- Handle test failures with detailed error reporting
- Manage missing coverage files or commands
- Catch and report test execution crashes
- Provide clear output for debugging purposes

================================================================================

# analyze-code

## Description
This action performs static code analysis to identify potential issues and maintain code quality.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)

## Input:
- source-dir:
    description: 'Directory containing source code to analyze'
    required: true
    default: '.'
- previous-results:
    description: 'Path to previous analysis results for comparison'
    required: false

## Output:
- quality-report: JSON object containing the code quality report
- issues: List of potential issues and recommendations
- diff: Diff from previous analysis
- visualizations: Graphs of code metrics

## Implementation Details:
1. Prepare analysis environment
   - Install ESLint, TypeScript, and related plugins
   - Install JSCPD for code duplication detection
   - Install CLOC for code metrics
2. Fetch previous results (if available)
3. Run static code analysis
   - Execute ESLint
   - Run TypeScript compiler for type checking
   - Use JSCPD for code duplication analysis
   - Run CLOC for code metrics
4. Generate comprehensive report
5. Create issues list
6. Compare with previous results
7. Prepare visualizations
8. Set outputs (quality report, issues, diff, visualizations)
9. Save results for next run

## Error Handling:
- Continue analysis if a tool fails, reporting available results
- Provide fallback error reporting if analysis completely fails
- Output error messages for debugging purposes

================================================================================

# build-app

## Description
This action builds the application for production, ensuring all assets are properly compiled and optimized.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)

## Inputs:
  working-directory:
    description: 'Directory to run build in (for monorepos)'
    required: false
    default: '.'
  build-command:
    description: 'Custom build command (overrides default)'
    required: false
  environment:
    description: 'Build environment (e.g., production, staging)'
    required: false
    default: 'production'

## Outputs:
  build-status:
    description: 'Overall build status (success/failure)'
  build-artifacts:
    description: 'Path to build artifacts'
  build-logs:
    description: 'Path to build logs'
  performance-metrics:
    description: 'Build performance metrics (JSON object)'

## Implementation Details:
1. Setup Node.js environment
2. Detect package manager and install dependencies
3. Load build configuration
4. Execute build command
5. Collect and compress build artifacts
6. Generate build report and performance metrics
7. Cache build artifacts if successful
8. Set outputs (build status, artifacts path, logs, metrics)

## Error Handling:
- Continue with available results if a build step fails
- Provide detailed error logs for debugging
- Implement retry mechanism for transient failures

================================================================================

# run-security-checks

## Description
This action performs comprehensive security checks on the codebase and dependencies.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)

## Inputs:
  working-directory:
    description: 'Directory to run security checks in'
    required: false
    default: '.'

## Outputs:
  security-status:
    description: 'Overall security check status (pass/fail)'
  vulnerability-report:
    description: 'Detailed vulnerability report (JSON object)'
  sarif-output:
    description: 'Path to SARIF output file'

## Implementation Details:
1. Setup security tools
   - Install npm-audit-html, bandit, and safety
2. Run dependency vulnerability check
   - Use npm audit to generate JSON and HTML reports
3. Perform SAST
   - Run bandit for Python code analysis
4. Execute secret scanning
   - Use gitleaks action for secret detection
5. Analyze Docker containers (if applicable)
   - Utilize Trivy for container image scanning
6. Generate comprehensive security report
   - Combine results from various tools into a single report
7. Create SARIF output
   - Convert vulnerability report to SARIF format
8. Set outputs (security status, vulnerability report, SARIF path)

## Error Handling:
- Continue with available results if a security check step fails
- Provide detailed error logs for debugging
- Set security status to 'fail' if any checks fail or errors occur
- Handle potential issues with external tool installations or executions

================================================================================

# deploy-app

## Description
This action deploys the application based on the package configuration.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)

## Inputs:
  package-name:
    description: 'Name of the package to deploy'
    required: true
  artifacts-path:
    description: 'Path to build artifacts'
    required: true
  deployment-type:
    description: 'Type of deployment (e.g., vercel, railway, npm)'
    required: true
  deployment-config:
    description: 'JSON string containing deployment configuration'
    required: true

## Outputs:
  deployment-status:
    description: 'Overall deployment status (success/failure)'
  deployed-url:
    description: 'URL of the deployed application'
  deployment-logs:
    description: 'Path to deployment logs'

## Implementation Details:
1. Parse deployment configuration
2. Deploy based on deployment type:
   - Vercel: Use Vercel CLI for deployment
   - Railway: Use Railway CLI for deployment
   - NPM: Publish package to NPM registry
   - GitHub Pages: Deploy to gh-pages branch
   - Docker: Build and push Docker image
   - Easypanel: Deploy using Easypanel API
   - Chrome Web Store: Upload and publish extension
3. Set outputs (deployment status, URL if applicable, logs)

## Error Handling:
- Provide detailed error logs for debugging
- Implement retry mechanism for transient failures

================================================================================

# run-post-deployment-tests

## Description
This action runs comprehensive post-deployment tests to ensure the application is functioning correctly in the production environment.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)

## Inputs:
  app-url:
    description: 'URL of the deployed application'
    required: true
  test-suite:
    description: 'Path to post-deployment test suite'
    required: false
    default: 'tests/post-deploy'
  performance-threshold:
    description: 'Minimum acceptable performance score'
    required: false
    default: '80'

## Outputs:
  test-status:
    description: 'Overall test status (pass/fail)'
  test-report:
    description: 'Detailed test report (JSON object)'
  performance-metrics:
    description: 'Application performance metrics'

## Implementation Details:
1. Setup test environment
2. Run smoke tests
3. Execute integration tests
4. Perform performance and load testing
5. Check for regression issues
6. Validate third-party integrations
7. Collect user experience metrics
8. Generate comprehensive test report
9. Set outputs (test status, report, performance metrics)

## Error Handling:
- Continue testing if non-critical tests fail
- Implement retries for transient issues
- Provide option for manual override of failed checks

================================================================================

# update-documentation

## Description
This action automatically updates project documentation when code changes, ensuring that documentation stays in sync with the codebase.

## Usage in Workflows
- CI/CD Workflow (ci-cd.yml)

## Inputs:
  docs-directory:
    description: 'Directory containing documentation files'
    required: false
    default: 'docs'
  api-changes:
    description: 'Path to API changes file'
    required: false
  version:
    description: 'New version number for documentation'
    required: false

## Outputs:
  update-status:
    description: 'Documentation update status (updated/no-changes)'
  changelog:
    description: 'Path to updated changelog file'

## Implementation Details:
1. Analyze code changes
2. Update API documentation
3. Revise feature documentation
4. Update changelog
5. Verify documentation links
6. Generate documentation artifacts
7. Commit documentation changes
8. Set outputs (update status, changelog path)

## Error Handling:
- Handle conflicts in documentation files
- Provide warnings for potentially outdated sections
- Continue with partial updates if full update fails

================================================================================

# validate-branch-name

## Description
This action validates branch names against predefined naming conventions to maintain consistency and clarity in the repository.

## Usage in Workflows
- Pre-commit Workflow (pre-commit.yml)
- Pull Request Workflow (pull-request.yml)

## Inputs:
  branch-name:
    description: 'Name of the branch to validate'
    required: true
  feature-prefix:
    description: 'Prefix for feature branches'
    required: true
    default: 'feature/'
  release-prefix:
    description: 'Prefix for release branches'
    required: true
    default: 'release/'
  hotfix-prefix:
    description: 'Prefix for hotfix branches'
    required: true
    default: 'hotfix/'
  main-branches:
    description: 'List of main branches'
    required: true
    default: '["main", "develop"]'
  config-path:
    description: 'Path to the branch naming configuration file'
    required: false
    default: '.github/branch-naming-config.json'

## Outputs:
  is-valid:
    description: 'Boolean indicating if the branch name is valid'
  validation-message:
    description: 'Detailed validation message or error explanation'

## Implementation Details:
1. Load branch naming configuration
2. Parse branch name components
3. Validate branch prefix
4. Validate branch type
5. Validate branch description
6. Check branch name length
7. Apply custom validation rules
8. Compile validation results
9. Set outputs (validation status and message)

## Error Handling:
- Provide specific feedback for each validation failure
- Handle missing or invalid configuration gracefully
- Continue execution with warnings for non-critical issues

================================================================================

# create-or-update-branch

## Description
This action automates the process of creating new branches or updating existing ones to streamline the Git workflow.

## Usage in Workflows
- Feature Branch Creation Workflow (create-feature-branch.yml)
- Hotfix Workflow (hotfix.yml)

## Inputs:
  branch-name:
    description: 'Name of the branch to create or update'
    required: true
  base-branch:
    description: 'Name of the base branch'
    required: true
  commit-changes:
    description: 'Changes to commit if updating the branch'
    required: false

## Outputs:
  branch-url:
    description: 'URL of the created or updated branch'
  operation-status:
    description: 'Status of the branch operation (created/updated/unchanged)'

## Implementation Details:
1. Check for existing branch
2. Create new branch if it doesn't exist
3. Update existing branch if it exists
4. Apply commit changes if provided
5. Push changes to remote repository
6. Verify branch status
7. Generate branch URL
8. Set outputs (branch URL and operation status)

## Error Handling:
- Handle merge conflicts during update
- Implement retry logic for network issues
- Provide option for force push with appropriate warnings

================================================================================

# apply-branch-protection

## Description
This action automatically applies and updates branch protection rules to ensure code quality and maintain security standards.

## Usage in Workflows
- Repository Setup Workflow (repo-setup.yml)
- Branch Protection Update Workflow (update-branch-protection.yml)

## Inputs:
  branch-name:
    description: 'Name of the branch to protect'
    required: true
  require-pull-request:
    description: 'Require pull request before merging'
    required: true
    type: boolean
  required-approvals:
    description: 'Number of required approvals before merging'
    required: true
    type: number
  enforce-admins:
    description: 'Enforce branch protection rules for administrators'
    required: true
    type: boolean
  dismiss-stale-reviews:
    description: 'Dismiss stale pull request approvals when new commits are pushed'
    required: false
    type: boolean
    default: false
  require-code-owner-reviews:
    description: 'Require review from code owners'
    required: false
    type: boolean
    default: false
  restrict-pushes:
    description: 'Restrict who can push to the protected branch'
    required: false
    type: boolean
    default: false
  allowed-push-teams:
    description: 'Comma-separated list of team slugs allowed to push'
    required: false
  allowed-push-users:
    description: 'Comma-separated list of usernames allowed to push'
    required: false
  require-status-checks:
    description: 'Require status checks to pass before merging'
    required: false
    type: boolean
    default: false
  required-status-checks:
    description: 'Comma-separated list of required status checks'
    required: false
  require-linear-history:
    description: 'Require linear history'
    required: false
    type: boolean
    default: false
  allow-force-pushes:
    description: 'Allow force pushes'
    required: false
    type: boolean
    default: false
  allow-deletions:
    description: 'Allow branch deletions'
    required: false
    type: boolean
    default: false

## Outputs:
  protection-status:
    description: 'Status of the protection rules application'
  applied-rules:
    description: 'Summary of applied protection rules'

## Implementation Details:
1. Authenticate with GitHub API
2. Fetch current branch protection settings
3. Parse protection rules from configuration
4. Compare current and desired protection rules
5. Prepare update payload for GitHub API
6. Apply new protection rules
7. Verify applied settings
8. Generate rules summary
9. Log protection changes
10. Set outputs (protection status and applied rules summary)

## Error Handling:
- Handle API rate limiting with appropriate retries
- Provide clear error messages for failed rule applications
- Implement rollback for partial rule application failures

================================================================================

# wait-for-pr

## Description
This action implements a waiting period before automatically creating a PR, allowing time for manual PR creation while ensuring the process continues if no manual action is taken.

## Usage in Workflows
- Automated PR Creation Workflow (auto-pr-creation.yml)

## Inputs:
  branch-name:
    description: 'Name of the branch to check for PRs'
    required: true
  wait-time:
    description: 'Time to wait in minutes before proceeding'
    required: false
    default: '15'

## Outputs:
  pr-status:
    description: 'Status of PR creation (manual/automatic/not-created)'
  wait-duration:
    description: 'Actual duration waited in minutes'

## Implementation Details:
1. Initialize wait timer
2. Periodically check for existing PRs
3. Handle early PR creation
4. Manage wait time expiration
5. Calculate actual wait duration
6. Prepare status report
7. Set outputs (PR status and wait duration)

## Error Handling:
- Handle intermittent network issues during PR checks
- Provide option to extend wait time if needed
- Log clear error messages if unable to check for PRs

================================================================================

# ai-generate-content

## Description
This action leverages AI to automatically generate high-quality content for PRs, issues, and documentation, ensuring consistency and saving time.

## Usage in Workflows
- PR Description Generation Workflow (pr-description-gen.yml)
- Issue Response Workflow (issue-response.yml)

## Inputs:
  content-type:
    description: 'Type of content to generate (PR description, issue response, etc.)'
    required: true
  context-data:
    description: 'JSON string containing relevant context data'
    required: true
  template-path:
    description: 'Path to content template file'
    required: false

## Outputs:
  generated-content:
    description: 'The AI-generated content'
  generation-metadata:
    description: 'Metadata about the generation process (model used, confidence score, etc.)'

## Implementation Details:
1. Prepare input data and context
2. Select appropriate AI model
3. Construct detailed prompt
4. Call AI service API
5. Process and format AI response
6. Apply safety filters and checks
7. Generate confidence score
8. Prepare generation metadata
9. Set outputs (generated content and metadata)

## Error Handling:
- Implement retry logic for API call failures
- Provide fallback options if AI generation fails
- Filter out potentially harmful or irrelevant content

================================================================================

# create-or-update-pr

## Description
This action automates the process of creating or updating pull requests to streamline the code review process and ensure all changes are properly tracked.

## Usage in Workflows
- Automated PR Workflow (auto-pr.yml)
- PR Update Workflow (update-pr.yml)

## Inputs:
  branch-name:
    description: 'Name of the branch for the PR'
    required: true
  pr-title:
    description: 'Title of the pull request'
    required: true
  pr-body:
    description: 'Body content of the pull request'
    required: true
  base-branch:
    description: 'Name of the base branch for the PR'
    required: true

## Outputs:
  pr-url:
    description: 'URL of the created or updated pull request'
  pr-status:
    description: 'Status of the PR operation (created/updated)'

## Implementation Details:
1. Check for existing PR
2. Prepare PR creation/update payload
3. Create new PR or update existing PR
4. Apply labels and request reviewers
5. Verify PR status
6. Generate PR URL
7. Set outputs (PR URL and status)

## Error Handling:
- Handle API rate limiting with appropriate retries
- Provide clear error messages for PR creation/update failures
- Implement retry logic for transient issues

================================================================================

# merge-branch

## Description
This action automates the process of merging branches while following the project's merge strategy to maintain a clean and consistent Git history.

## Usage in Workflows
- Auto-merge Workflow (auto-merge.yml)
- Release Branch Merge Workflow (release-merge.yml)

## Inputs:
  source-branch:
    description: 'Name of the source branch to merge'
    required: true
  target-branch:
    description: 'Name of the target branch to merge into'
    required: true
  merge-strategy:
    description: 'Merge strategy to use (merge/squash/rebase)'
    required: false
    default: 'merge'

## Outputs:
  merge-status:
    description: 'Status of the merge operation'
  merge-commit-sha:
    description: 'SHA of the merge commit (if successful)'

## Implementation Details:
1. Validate branch names and permissions
2. Fetch latest changes
3. Determine and apply merge method
4. Handle merge conflicts
5. Create merge commit if required
6. Push merged changes
7. Verify merge success
8. Generate merge report
9. Set outputs (merge status and commit SHA)

## Error Handling:
- Provide detailed logs for merge conflicts
- Implement rollback procedure for failed merges
- Handle force push scenarios with appropriate caution and warnings

================================================================================

# clean-up-branch

## Description
This action automatically cleans up branches that are no longer needed to keep the repository organized and reduce clutter.

## Usage in Workflows
- Post-merge Cleanup Workflow (post-merge-cleanup.yml)
- Periodic Branch Cleanup Workflow (periodic-cleanup.yml)

## Inputs:
  branch-name:
    description: 'Name of the branch to clean up'
    required: true
  force-delete:
    description: 'Whether to force delete unmerged branches'
    required: false
    default: 'false'

## Outputs:
  cleanup-status:
    description: 'Status of the branch cleanup operation'
  deleted-branch:
    description: 'Name of the deleted branch (if applicable)'

## Implementation Details:
1. Check branch status and deletion criteria
2. Verify no open PRs are associated
3. Confirm branch is merged (unless force delete)
4. Check branch protection status
5. Perform branch deletion (local and remote)
6. Update related PRs if necessary
7. Log deletion action
8. Notify relevant parties
9. Set outputs (cleanup status and deleted branch name)

## Error Handling:
- Provide option to force delete unmerged branches with appropriate warnings
- Handle scenarios where remote branch deletion fails
- Log any issues encountered during the cleanup process

================================================================================

# cleanup-stale-branches

## Description
This action automatically identifies and removes stale branches to keep the repository clean and manageable.

## Usage in Workflows
- Weekly Cleanup Workflow (weekly-cleanup.yml)
- Pre-release Cleanup Workflow (pre-release-cleanup.yml)

## Inputs:
  stale-threshold:
    description: 'Number of days of inactivity to consider a branch stale'
    required: false
    default: '30'
  exclude-branches:
    description: 'Comma-separated list of branches to exclude from cleanup'
    required: false

## Outputs:
  cleaned-branches:
    description: 'List of branches that were deleted'
  cleanup-summary:
    description: 'Summary of the cleanup operation'

## Implementation Details:
1. Fetch all remote branches
2. Determine last commit date for each branch
3. Identify stale branches based on threshold
4. Filter out protected and excluded branches
5. Check for open PRs on stale branches
6. Compile list of branches to delete
7. Perform batch deletion
8. Update related issues and PRs
9. Generate comprehensive cleanup report
10. Notify team of deletions
11. Set outputs (list of cleaned branches and summary)

## Error Handling:
- Implement dry-run option for reviewing before actual deletion
- Provide manual override for branches flagged as stale
- Log any branches that couldn't be deleted and the reasons why

================================================================================

# auto-label

## Description
This action automatically applies relevant labels to issues and PRs based on their content, improving organization and streamlining workflow.

## Usage in Workflows
- Issue Triage Workflow (issue-triage.yml)
- PR Labeling Workflow (pr-labeling.yml)

## Inputs:
  item-type:
    description: 'Type of item to label (issue/pr)'
    required: true
  item-number:
    description: 'Number of the issue or PR'
    required: true

## Outputs:
  applied-labels:
    description: 'List of labels applied to the item'
  labeling-summary:
    description: 'Summary of the labeling operation'

## Implementation Details:
1. Debug input values
2. Parse labeling rules
3. Fetch item content
4. Match content against labeling rules
5. Apply labels via GitHub API
6. Set outputs (applied labels and labeling summary)

## Error Handling:
- Handle API rate limiting for label operations
- Provide clear error messages for rule parsing issues
- Log any labels that couldn't be applied and the reasons why

================================================================================

# auto-assign

## Description
This action automatically assigns team members to issues and PRs based on their expertise and contributions.

## Usage in Workflows
- Issue Assignment Workflow (issue-assignment.yml)
- PR Review Assignment Workflow (pr-review-assignment.yml)

## Inputs:
  item-type:
    description: 'Type of item to assign (issue/pr)'
    required: true
  item-number:
    description: 'Number of the issue or PR'
    required: true

## Outputs:
  assigned-members:
    description: 'List of team members assigned to the item'
  assignment-summary:
    description: 'Summary of the assignment operation'

## Implementation Details:
1. Debug input values
2. Fetch repository contributors and their expertise
3. Generate assignment rules
4. Fetch item content and labels
5. Determine assignees based on rules and content
6. Perform assignment via GitHub API
7. Set outputs (assigned members and assignment summary)

## Error Handling:
- Handle cases where no suitable assignee is found
- Provide fallback assignment strategy (e.g., default assignee)
- Log any assignment failures and the reasons why

================================================================================

# create-project-card

## Description
This action automatically creates project cards for new issues and PRs, ensuring project boards accurately reflect ongoing work.

## Usage in Workflows
- New Issue Workflow (new-issue.yml)
- New PR Workflow (new-pr.yml)

## Inputs:
  item-type:
    description: 'Type of item to create a card for (issue/pr)'
    required: true
  item-number:
    description: 'Number of the issue or PR'
    required: true
  project-board-id:
    description: 'ID of the project board to add the card to'
    required: true
  column-id:
    description: 'ID of the column to add the card to'
    required: false

## Outputs:
  card-url:
    description: 'URL of the created project card'
  creation-status:
    description: 'Status of the card creation operation'

## Implementation Details:
1. Fetch item details (issue/PR)
2. Determine appropriate project board and column
3. Prepare card content
4. Create project card via GitHub API
5. Set card position within column
6. Add any additional metadata to card
7. Verify card creation
8. Generate creation report
9. Set outputs (card URL and creation status)

## Error Handling:
- Handle cases where project board or column doesn't exist
- Provide clear error messages for API failures
- Implement retry logic for transient errors

================================================================================

# link-related-items

## Description
This action automatically links related issues and PRs to improve traceability and context in project management.

## Usage in Workflows
- Issue Linking Workflow (issue-linking.yml)
- PR Relationship Workflow (pr-relationship.yml)

## Inputs:
  item-type:
    description: 'Type of item to analyze for links (issue/pr)'
    required: true
  item-number:
    description: 'Number of the issue or PR'
    required: true

## Outputs:
  linked-items:
    description: 'List of items linked to the analyzed item'
  linking-summary:
    description: 'Summary of the linking operation'

## Implementation Details:
1. Fetch and analyze item content
2. Identify potential relations in repository context
3. Validate identified relations
4. Create links between items via GitHub API
5. Update item descriptions with link information
6. Generate comprehensive linking report
7. Notify relevant parties about new links
8. Update project boards to reflect new relationships
9. Set outputs (list of linked items and linking summary)

## Error Handling:
- Handle cases where mentioned items don't exist
- Provide warnings for ambiguous references
- Log any linking failures and the reasons why

================================================================================

# prioritize-issue

## Description
This action automatically prioritizes new issues based on predefined rules to ensure the team focuses on the most important tasks.

## Usage in Workflows
- Issue Prioritization Workflow (issue-prioritization.yml)
- New Issue Triage Workflow (issue-triage.yml)

## Inputs:
  issue-number:
    description: 'Number of the issue to prioritize'
    required: true
  priority-high-label:
    description: 'Label to assign for high priority issues'
    required: true
  priority-medium-label:
    description: 'Label to assign for medium priority issues'
    required: true
  priority-low-label:
    description: 'Label to assign for low priority issues'
    required: true
  high-priority-keywords:
    description: 'Comma-separated list of keywords indicating high priority'
    required: true
  medium-priority-keywords:
    description: 'Comma-separated list of keywords indicating medium priority'
    required: true
  low-priority-keywords:
    description: 'Comma-separated list of keywords indicating low priority'
    required: true

## Outputs:
  assigned-priority:
    description: 'Priority level assigned to the issue'
  prioritization-reasoning:
    description: 'Explanation of why the priority was assigned'

## Implementation Details:
1. Fetch issue details
   - Use GitHub API to get issue title, body, and labels
2. Analyze issue content
   - Extract key information from issue details
3. Apply prioritization rules
   - Match issue details against priority criteria based on keywords
4. Determine issue priority
   - Assign priority level based on matched keywords
5. Add priority label
   - Apply appropriate priority label to the issue
6. Update issue description
   - Add prioritization reasoning to issue body
7. Adjust project board placement
   - Move issue to correct column based on priority
8. Notify relevant team members
   - Alert assigned users or teams about high-priority issues
9. Generate prioritization report
   - Compile details of prioritization process
10. Set outputs
    - Use core.setOutput() for priority and reasoning

## Error Handling:
- Handle conflicts between multiple matching priority rules
- Provide default priority for issues not matching any rules
- Log any prioritization failures and reasons

================================================================================

# set-milestone

## Description
This action automatically assigns issues and PRs to appropriate milestones to keep the project timeline organized and up-to-date.

## Usage in Workflows
- Issue Milestone Assignment Workflow (issue-milestone.yml)
- PR Milestone Assignment Workflow (pr-milestone.yml)

## Inputs:
  item-type:
    description: 'Type of item to assign milestone (issue/pr)'
    required: true
  item-number:
    description: 'Number of the issue or PR'
    required: true
  milestone-title:
    description: 'Title of the milestone to assign'
    required: true
  milestone-description:
    description: 'Description of the milestone'
    required: false
  milestone-due-date:
    description: 'Due date of the milestone (YYYY-MM-DD)'
    required: false

## Outputs:
  assigned-milestone:
    description: 'Name or number of the assigned milestone'
  assignment-status:
    description: 'Status of the milestone assignment operation'

## Implementation Details:
1. Fetch item details
   - Use GitHub API to get issue/PR information
2. Analyze item details
   - Extract relevant information (type, labels, priority)
3. Fetch current milestones
   - Get list of active milestones from repository
4. Select or create milestone
   - Choose existing milestone or create new if needed
5. Assign item to milestone
   - Use GitHub API to set milestone for issue/PR
6. Update milestone progress
   - Recalculate and update milestone completion percentage
7. Generate assignment report
   - Compile details of milestone assignment action
8. Set outputs
   - Use core.setOutput() for assignment status and details

## Error Handling:
- Handle cases where no suitable milestone is found
- Provide option to create new milestones automatically
- Log any assignment failures and reasons

================================================================================

# track-sla

## Description
This action automatically tracks and enforces Service Level Agreements (SLAs) for issues and PRs to ensure timely responses and resolutions.

## Usage in Workflows
- SLA Tracking Workflow (sla-tracking.yml)
- Issue Response Time Monitoring (issue-response-time.yml)

## Inputs:
  item-type:
    description: 'Type of item to track SLA (issue/pr)'
    required: true
  item-number:
    description: 'Number of the issue or PR'
    required: true
  sla-response-time:
    description: 'Time in hours for initial response'
    required: true
  sla-resolution-time:
    description: 'Time in hours for resolution'
    required: true
  sla-priority-high:
    description: 'Time in hours for high priority items'
    required: false
  sla-priority-medium:
    description: 'Time in hours for medium priority items'
    required: false
  sla-priority-low:
    description: 'Time in hours for low priority items'
    required: false

## Outputs:
  sla-status:
    description: 'Current SLA status (e.g., "within SLA", "at risk", "breached")'
  time-remaining:
    description: 'Time remaining before SLA breach (in minutes)'

## Implementation Details:
1. Load SLA configuration
   - Parse individual SLA input fields
2. Fetch item details
   - Use GitHub API to get issue/PR creation time and current status
3. Calculate SLA deadline
   - Apply SLA rules to set appropriate deadline based on priority and type
4. Check current status
   - Compare current time to SLA deadline
5. Update SLA status
   - Set status (e.g., "within SLA", "at risk", "breached")
6. Apply SLA labels
   - Add or update labels reflecting SLA status
7. Calculate time metrics
   - Determine time remaining or time overdue
8. Trigger notifications
   - Alert relevant parties for approaching or breached SLAs
9. Update item with SLA info
   - Add SLA status and time info to issue/PR body
10. Generate SLA report
    - Compile details of SLA tracking action
11. Set outputs
    - Use core.setOutput() for SLA status and time metrics

## Error Handling:
- Handle timezone differences in SLA calculations
- Provide clear messages for SLA status changes
- Log any SLA tracking failures and reasons

================================================================================

# close-stale-issues

## Description
This action automatically identifies and closes stale issues and PRs to keep the project board clean and focused on active work.

## Usage in Workflows
- Stale Issue Cleanup Workflow (stale-issue-cleanup.yml)
- Weekly Maintenance Workflow (weekly-maintenance.yml)

## Inputs:
  days-before-stale:
    description: 'Number of days of inactivity before an issue becomes stale'
    required: true
    default: '60'
  days-before-close:
    description: 'Number of days of inactivity before a stale issue is closed'
    required: true
    default: '7'
  stale-issue-label:
    description: 'Label to apply to stale issues'
    required: false
    default: 'stale'
  exempt-issue-labels:
    description: 'Comma-separated list of labels that exempt an issue from being marked stale'
    required: false
    default: 'pinned,security'
  stale-issue-message:
    description: 'Message to post on the issue when marking it as stale'
    required: false
    default: 'This issue has been automatically marked as stale due to inactivity.'
  close-issue-message:
    description: 'Message to post on the issue when closing it'
    required: false
    default: 'This issue has been automatically closed due to inactivity.'

## Outputs:
  closed-items:
    description: 'List of closed issues and PRs'
  closure-summary:
    description: 'Summary of the closure operation'

## Implementation Details:
1. Load stale issue configuration
   - Parse stale-criteria input JSON
2. Fetch open issues and PRs
   - Use GitHub API to get list of open items
3. Analyze each item
   - Check last update time and activity
4. Identify stale items
   - Apply stale criteria to flag inactive issues/PRs
5. Filter out exceptions
   - Remove items matching exception rules
6. Add warning labels
   - Label items approaching stale status
7. Close stale items
   - Use GitHub API to close identified stale issues/PRs
8. Add closure comments
   - Post explanatory comment on closed items
9. Update related project boards
   - Move closed items to appropriate columns
10. Generate closure report
    - Compile list and details of closed items
11. Notify team of closures
    - Send summary of closed items to specified channels
12. Set outputs
    - Use core.setOutput() for closure summary and list

## Error Handling:
- Implement dry-run option for reviewing before actual closure
- Provide manual override for items flagged as stale
- Log any closure failures and reasons

================================================================================

# check-existing-pr

## Description
This action automatically checks for existing pull requests when creating a new branch or committing changes to avoid duplicate work and streamline the development process.

## Usage in Workflows
- New Branch Creation Workflow (new-branch-check.yml)
- Pre-commit Check Workflow (pre-commit-check.yml)

## Inputs:
  branch-name:
    description: 'Name of the branch to check for existing PRs'
    required: true

## Outputs:
  pr-exists:
    description: 'Boolean indicating if a matching PR exists'
  existing-pr-url:
    description: 'URL of the existing PR if found'

## Implementation Details:
1. Parse branch name
   - Extract key information (e.g., issue number, feature name)
2. Construct search query
   - Create GitHub search query based on branch info
3. Fetch open pull requests
   - Use GitHub API to search for open PRs
4. Analyze search results
   - Check if any PRs match the current branch
5. Verify PR status
   - Ensure matching PR is still open and relevant
6. Collect PR details
   - Gather information about matching PR if found
7. Generate existence report
   - Compile details of PR check operation
8. Notify if duplicate detected
   - Alert user or team if matching PR exists
9. Update related issues
   - Add comments linking to existing PR if applicable
10. Set outputs
    - Use core.setOutput() for PR existence status and details

## Error Handling:
- Handle API rate limiting for PR searches
- Provide clear messages for ambiguous matches
- Log any search failures and reasons

================================================================================

# generate-metrics

## Description
This action automatically generates and reports key project metrics to gain insights into the development process and team performance.

## Usage in Workflows
- Weekly Metrics Report Workflow (weekly-metrics.yml)
- Project Health Check Workflow (project-health-check.yml)

## Inputs:
  time-range:
    description: 'Time range for metrics calculation (e.g., "7 days", "1 month")'
    required: true
  source-dir:
    description: 'Directory containing source code to analyze'
    required: true
    default: '.'

## Outputs:
  metrics-data:
    description: 'JSON object containing calculated metrics'
  top-contributors:
    description: 'List of top contributors during the specified time range'
  improvement-areas:
    description: 'Identified areas needing improvement'
  quality-report:
    description: 'JSON object containing the code quality report'
  issues:
    description: 'List of potential issues and recommendations'
  visualizations:
    description: 'Graphs of code metrics'

## Implementation Details:
1. Define metric categories
   - Identify key performance indicators to track
2. Fetch repository data
   - Use GitHub API to get PRs, issues, and commits
3. Calculate PR metrics
   - Compute merge rate, review time, size, etc.
4. Analyze issue data
   - Calculate resolution time, reopening rate, etc.
5. Assess code contributions
   - Measure lines of code, commit frequency, etc.
6. Identify top contributors
   - Rank team members based on various metrics
7. Detect bottlenecks
   - Identify areas with slowdowns or frequent issues
8. Generate performance trends
   - Compare current metrics to historical data
9. Run static code analysis
   - Use built-in GitHub Actions for code analysis
10. Generate code quality report
    - Compile results from various analysis steps
11. Create visualization data
    - Prepare data for charts and graphs
12. Compile comprehensive metrics report
    - Assemble all calculated metrics, code quality data, and insights
13. Set outputs
    - Use core.setOutput() for metrics data, quality report, and summaries

## Error Handling:
- Handle incomplete data for certain time ranges
- Provide explanations for unusual metric values
- Log any calculation errors or data inconsistencies
- Implement timeout for long-running analysis

================================================================================

# create-discussion-post

## Description
This action automatically creates discussion posts for important announcements or to gather feedback, fostering community engagement and communication.

## Inputs:
  discussion-title:
    description: 'Title of the discussion'
    required: true
  discussion-content:
    description: 'Content of the discussion'
    required: true
  category:
    description: 'Category for the discussion (e.g., Announcements)'
    required: true

## Outputs:
  created-discussion-url:
    description: 'URL of the created discussion'
  creation-status:
    description: 'Status of the discussion creation process'

## Implementation Details:
1. Validate input data
   - Ensure title, content, and category are provided
2. Format discussion content
   - Apply markdown formatting if necessary
3. Determine discussion category
   - Match provided category to available options
4. Prepare discussion payload
   - Construct JSON payload for GitHub API
5. Create discussion post
   - Use GitHub API to create the discussion
6. Apply initial labels
   - Add relevant labels to the new discussion
7. Pin discussion if needed
   - Pin important announcements for visibility
8. Notify team members
   - Alert relevant users or teams about new discussion
9. Update related issues/PRs
   - Add links to the discussion in related items
10. Generate creation report
    - Compile details of discussion creation action
11. Set outputs
    - Use core.setOutput() for discussion URL and status

## Error Handling:
- Handle cases where discussion category doesn't exist
- Provide clear error messages for API failures
- Implement retry logic for transient errors

================================================================================

# send-webhook

## Description
This action automatically sends webhook notifications for important events in the repository, keeping external systems and services updated.

## Inputs:
  webhook-url:
    description: 'URL of the webhook endpoint'
    required: true
  webhook-method:
    description: 'HTTP method to use for the webhook (e.g., POST, GET)'
    required: true
  webhook-headers:
    description: 'HTTP headers to include in the webhook request'
    required: false
  webhook-payload:
    description: 'JSON payload to send to the webhook endpoint'
    required: true

## Outputs:
  sending-status:
    description: 'Status of webhook sending for each endpoint'
  response-data:
    description: 'Response data from webhook endpoints'

## Implementation Details:
1. Validate input data
   - Ensure URL, method, and payload are provided
2. Prepare HTTP request
   - Configure request options (headers, method, etc.)
3. Send webhook to the endpoint
   - Use GitHub Actions HTTP client to send the request
4. Handle responses
   - Process and log responses from the endpoint
5. Retry failed requests
   - Implement retry logic with exponential backoff
6. Verify webhook delivery
   - Check for successful delivery to the endpoint
7. Log webhook activity
   - Record details of sent webhooks and responses
8. Generate sending report
   - Compile summary of webhook sending operation
9. Set outputs
   - Use core.setOutput() for sending status and responses

## Error Handling:
- Handle network errors and timeouts
- Provide detailed logs for failed webhook deliveries
- Implement circuit breaker for consistently failing endpoints

================================================================================

# verify-deployment

## Description
This action automatically verifies the health and functionality of deployed components after each deployment, ensuring system integrity and catching issues early.

## Inputs:
  deployed-components:
    description: 'List of components to verify'
    required: true
  repository-name:
    description: 'Name of the repository'
    required: true
  repository-type:
    description: 'Type of the repository (e.g., monorepo)'
    required: true
  main-branches:
    description: 'List of main branches'
    required: true
  branch-prefixes:
    description: 'Prefixes for different types of branches'
    required: true
  protection-rules:
    description: 'Rules for branch protection'
    required: true
  merge-strategy:
    description: 'Merge strategies for different scenarios'
    required: true
  auto-delete-merged-branches:
    description: 'Whether to automatically delete merged branches'
    required: true
  stale-branch-threshold:
    description: 'Number of days after which a branch is considered stale'
    required: true
  ci-cd-tools:
    description: 'List of CI/CD tools used'
    required: true
  deployment-config:
    description: 'Deployment configuration for different environments'
    required: true
  security-checks:
    description: 'Configuration for security checks'
    required: true
  post-deployment-tests:
    description: 'Configuration for post-deployment tests'
    required: true
  performance-monitoring:
    description: 'Configuration for performance monitoring'
    required: true
  dependency-management:
    description: 'Dependency management configuration'
    required: true
  code-review:
    description: 'Code review configuration'
    required: true
  documentation:
    description: 'Documentation configuration'
    required: true
  notifications:
    description: 'Notification configuration'
    required: true
  disaster-recovery:
    description: 'Disaster recovery configuration'
    required: true
  packages:
    description: 'Package configuration'
    required: true
  plugins:
    description: 'Plugin configuration'
    required: true
  cron-jobs:
    description: 'Cron job configuration'
    required: true
  issue-management:
    description: 'Issue management configuration'
    required: true
  metrics:
    description: 'Metrics configuration'
    required: true

## Outputs:
  verification-status:
    description: 'Status of verification for each component'
  verification-logs:
    description: 'Detailed logs of verification process'

## Implementation Details:
1. Load verification configuration
   - Parse config file for component-specific checks
2. Identify deployed components
   - Determine which parts of the system to verify
3. Prepare verification environment
   - Set up any necessary test data or configurations
4. Execute health checks
   - Run basic health check for each component
5. Perform functionality tests
   - Execute predefined test cases for each component
6. Check external dependencies
   - Verify connections to required external services
7. Monitor performance metrics
   - Collect and analyze key performance indicators
8. Validate data integrity
   - Ensure data consistency across components
9. Check security measures
   - Verify that security protocols are in place and functioning
10. Generate verification report
    - Compile results of all checks and tests
11. Notify team of verification results
    - Send summary of verification to specified channels
12. Set outputs
    - Use core.setOutput() for verification status and logs

## Error Handling:
- Implement timeout for hanging tests or checks
- Provide detailed error messages for failed verifications
- Log any verification failures and reasons

================================================================================

# rollback-deployment

## Description
This action automatically rolls back a deployment if verification fails or critical issues are detected, minimizing downtime and maintaining system stability.

## Inputs:
  current-deployment:
    description: 'Details of the current deployment'
    required: true
  last-stable-commit:
    description: 'Commit SHA of the last known good state'
    required: true

## Outputs:
  rollback-status:
    description: 'Status of the rollback operation'
  new-deployment-details:
    description: 'Details of the rolled back deployment'

## Implementation Details:
1. Validate rollback trigger
   - Confirm that rollback criteria are met
2. Identify last stable deployment
   - Use provided commit SHA of the last known good state
3. Prepare rollback environment
   - Set up necessary configurations for rollback
4. Stop current deployment
   - Gracefully stop services of the current deployment
5. Revert to previous state
   - Check out the codebase at the last stable commit
6. Rebuild components
   - Rebuild necessary components from the stable state
7. Redeploy stable version
   - Deploy the last known good version of the system
8. Reconfigure services
   - Update service configurations to match rolled back state
9. Verify rolled back deployment
   - Perform basic health and functionality checks
10. Update deployment records
    - Record the rollback action in deployment logs
11. Notify team of rollback
    - Send alert about the rollback to specified channels
12. Generate rollback report
    - Compile detailed log of rollback operation
13. Set outputs
    - Use core.setOutput() for rollback status and new deployment details

## Error Handling:
- Implement manual intervention option for complex rollbacks
- Provide fallback option if rollback itself fails
- Log any rollback failures and reasons

================================================================================

# assign-reviewers

## Description
This action automatically assigns appropriate reviewers to pull requests based on the changed files and team expertise, ensuring efficient and thorough code reviews.

## Inputs:
  pr-number:
    description: 'Number of the pull request'
    required: true
  codeowners-path:
    description: 'Path to the CODEOWNERS file'
    required: true
    default: '.github/CODEOWNERS'

## Outputs:
  assigned-reviewers:
    description: 'List of assigned reviewers'
  assignment-reasoning:
    description: 'Explanation of reviewer assignment decisions'

## Implementation Details:
1. Analyze PR changes
   - Identify files and directories modified in the PR
2. Parse CODEOWNERS file
   - Load and interpret CODEOWNERS rules
3. Match changes to CODEOWNERS
   - Determine potential reviewers based on changed files
4. Check reviewer availability
   - Verify if potential reviewers are available
5. Balance workload
   - Distribute reviews evenly among team members
6. Select final reviewers
   - Choose appropriate number of reviewers
7. Assign reviewers to PR
   - Use GitHub API to add selected reviewers
8. Notify assigned reviewers
   - Send notifications through configured channels
9. Update PR description
   - Add reviewer assignment reasoning to PR body
10. Generate assignment report
    - Compile details of reviewer assignment process
11. Set outputs
    - Use core.setOutput() for assigned reviewers and reasoning

## Error Handling:
- Handle cases where no suitable reviewers are found
- Provide fallback assignment strategy (e.g., team lead)
- Log any assignment failures and reasons

================================================================================

# run-code-quality

## Description
This action automatically runs code quality checks on pull requests to maintain high code standards and catch potential issues early in the development process.

## Inputs:
  pr-number:
    description: 'Number of the pull request'
    required: true
  linting-tools:
    description: 'List of linting tools to use (e.g., ESLint, Pylint)'
    required: true
  static-analysis-tools:
    description: 'List of static analysis tools to use (e.g., SonarQube, CodeClimate)'
    required: true
  style-guidelines:
    description: 'Path to the project style guidelines'
    required: true
  test-coverage-threshold:
    description: 'Minimum test coverage percentage required'
    required: true

## Outputs:
  quality-report:
    description: 'Detailed code quality report'
  issues-found:
    description: 'List of issues found during the quality checks'

## Implementation Details:
1. Prepare analysis environment
   - Set up necessary tools and configurations
2. Fetch PR changes
   - Get the diff of files changed in the PR
3. Run linting tools
   - Execute configured linters (e.g., ESLint, Pylint)
4. Perform static code analysis
   - Run static analysis tools (e.g., SonarQube, CodeClimate)
5. Check code style
   - Verify adherence to project style guidelines
6. Analyze code complexity
   - Measure cyclomatic complexity of changed code
7. Detect code smells
   - Identify potential design issues or anti-patterns
8. Check for duplications
   - Find and report code duplications
9. Verify test coverage
   - Ensure adequate test coverage for new code
10. Generate quality metrics
    - Compile various code quality metrics
11. Create detailed report
    - Assemble all analysis results into a comprehensive report
12. Post results to PR
    - Add code quality report as a PR comment
13. Update PR status
    - Set PR status based on quality check results
14. Set outputs
    - Use core.setOutput() for quality report and issues list

## Error Handling:
- Handle tool-specific errors and provide clear messages
- Implement timeout for long-running analysis
- Log any analysis failures and reasons

================================================================================

# post-pr-comment

## Description
This action automatically posts informative comments on pull requests to provide feedback, share analysis results, or give instructions to contributors.

## Inputs:
  pr-number:
    description: 'Number of the pull request'
    required: true
  comment-content:
    description: 'Content of the comment to post'
    required: true

## Outputs:
  comment-status:
    description: 'Status of the comment posting operation'
  comment-url:
    description: 'URL of the posted comment'

## Implementation Details:
1. Validate input data
   - Ensure PR number and comment content are provided
2. Format comment content
   - Apply markdown formatting if necessary
3. Check for existing comments
   - Avoid duplicate comments if similar content exists
4. Prepare comment payload
   - Construct JSON payload for GitHub API
5. Post comment to PR
   - Use GitHub API to add comment to the PR
6. Verify comment posting
   - Confirm comment appears correctly on PR
7. Handle comment threading
   - Reply to existing comments if specified
8. Update related tasks
   - Mark related items as commented if applicable
9. Notify mentioned users
   - Alert users mentioned in the comment
10. Generate posting report
    - Compile details of comment posting action
11. Set outputs
    - Use core.setOutput() for posting status and comment URL

## Error Handling:
- Handle API rate limiting for comment operations
- Provide retry mechanism for failed postings
- Log any posting failures and reasons

================================================================================

# check-review-guidelines

## Description
This action automatically checks if pull request descriptions and review comments adhere to the project's guidelines, ensuring consistent and helpful contributions.

## Inputs:
  pr-description:
    description: 'Description of the pull request'
    required: true
  review-comments:
    description: 'Comments on the pull request'
    required: true
  require_pull_request:
    description: 'Whether a pull request is required'
    required: true
  required_approvals:
    description: 'Number of required approvals'
    required: true
  enforce_admins:
    description: 'Whether to enforce admin rules'
    required: true
  develop_to_main:
    description: 'Merge strategy from develop to main'
    required: true
  feature_to_develop:
    description: 'Merge strategy from feature to develop'
    required: true
  auto_delete_merged_branches:
    description: 'Whether to automatically delete merged branches'
    required: true
  stale_branch_threshold:
    description: 'Number of days after which a branch is considered stale'
    required: true

## Outputs:
  compliance-status:
    description: 'Status of guideline compliance'
  violations-list:
    description: 'List of guideline violations (if any)'

## Implementation Details:
1. Load guideline configuration
   - Parse individual guideline input fields
2. Analyze PR description
   - Check if description follows required template
3. Validate PR content
   - Ensure all required sections are filled
4. Check review comments
   - Analyze comments for required elements
5. Verify comment length
   - Ensure comments meet minimum length requirements
6. Check for constructive feedback
   - Analyze comment tone and content
7. Validate review decisions
   - Ensure review decisions are properly justified
8. Identify guideline violations
   - Compile list of any detected violations
9. Generate compliance report
   - Create detailed report of guideline adherence
10. Notify of violations
    - Alert PR author and reviewers of any issues
11. Update PR status
    - Set PR status based on guideline compliance
12. Set outputs
    - Use core.setOutput() for compliance status and violations list

## Error Handling:
- Provide clear explanations for each guideline violation
- Handle cases where guidelines might conflict
- Log any checking failures and reasons

================================================================================

# enforce-review-approval

## Description
This action automatically enforces review approval requirements before allowing pull requests to be merged, maintaining code quality and team collaboration standards.

## Inputs:
  pr-reviews:
    description: 'Reviews on the pull request'
    required: true
  required-approvals:
    description: 'Number of required approvals'
    required: true
  enforce-admins:
    description: 'Whether to enforce approval from admins'
    required: true

## Outputs:
  approval-status:
    description: 'Status of the approval check'
  missing-approvals:
    description: 'List of missing approvals (if any)'

## Implementation Details:
1. Load approval configuration
   - Parse individual approval input fields
2. Fetch PR reviews
   - Use GitHub API to get all reviews for the PR
3. Analyze review statuses
   - Categorize reviews (approved, requested changes, commented)
4. Count valid approvals
   - Tally approvals meeting requirement criteria
5. Check against requirements
   - Compare approval count to required number
6. Verify reviewer roles
   - Ensure approvals come from authorized reviewers
7. Check for blocking reviews
   - Identify any reviews requesting changes
8. Determine overall approval status
   - Decide if PR meets all approval requirements
9. Identify missing approvals
   - List any additional approvals needed
10. Update PR status
    - Set PR status based on approval check results
11. Notify team of status
    - Alert relevant parties of approval status
12. Generate approval report
    - Compile details of approval check process
13. Set outputs
    - Use core.setOutput() for approval status and missing approvals

## Error Handling:
- Handle cases where reviewers are unavailable
- Provide clear messages for each approval requirement not met
- Log any approval checking failures and reasons

================================================================================

# update-pr-status

## Description
This action automatically updates the status of pull requests based on various checks and reviews, providing clear visibility into the PR's readiness for merging.

## Inputs:
  pr-number:
    description: 'Number of the pull request'
    required: true
  review-status:
    description: 'Status of the reviews on the pull request'
    required: true
  code-quality-results:
    description: 'Results of the code quality checks'
    required: true

## Outputs:
  updated-status:
    description: 'Updated status of the pull request'
  operation-result:
    description: 'Result of the status update operation'

## Implementation Details:
1. Fetch current PR status
   - Use GitHub API to get latest PR status
2. Analyze review status
   - Determine if all required reviews are complete
3. Evaluate code quality results
   - Check if code quality meets defined thresholds
4. Assess CI/CD pipeline status
   - Verify if all required checks have passed
5. Check merge conflicts
   - Determine if PR has any merge conflicts
6. Determine overall PR status
   - Combine all factors to decide PR readiness
7. Prepare status update payload
   - Construct JSON payload for GitHub API
8. Update PR status
   - Use GitHub API to set new PR status
9. Add status labels
   - Apply or update labels reflecting current status
10. Post status comment
    - Add comment to PR with status explanation
11. Notify relevant parties
    - Alert author and reviewers of status change
12. Generate status update report
    - Compile details of status update operation
13. Set outputs
    - Use core.setOutput() for updated status and operation result

## Error Handling:
- Handle API rate limiting for status update operations
- Provide retry mechanism for failed updates
- Log any status update failures and reasons

================================================================================

# check-dependency-updates

## Description
This action automatically checks for available updates to project dependencies, keeping the project secure and up-to-date with the latest features and bug fixes.

## Inputs:
  package-manager-type:
    description: 'Type of the package manager (e.g., npm, yarn, pip)'
    required: true
  current-dependencies:
    description: 'List of current project dependencies'
    required: true

## Outputs:
  available-updates:
    description: 'List of available updates'
  update-report:
    description: 'Report of updates categorized by major, minor, and patch changes'

## Implementation Details:
1. Identify package manager
   - Determine if project uses npm, yarn, pip, etc.
2. Parse dependency files
   - Read package.json, requirements.txt, etc.
3. Fetch current versions
   - Extract version info for each dependency
4. Check for updates
   - Query package registries for latest versions
5. Categorize updates
   - Separate updates into major, minor, and patch
6. Analyze update impact
   - Assess potential breaking changes for major updates
7. Check for security advisories
   - Verify if updates address known vulnerabilities
8. Generate update list
   - Compile list of all available updates
9. Create detailed report
   - Prepare report with update details and recommendations
10. Determine update priority
    - Assign priority levels to each update
11. Suggest update order
    - Recommend sequence for applying updates
12. Set outputs
    - Use core.setOutput() for update list and report

## Error Handling:
- Handle network errors when querying package registries
- Provide fallback to local caches if online checks fail
- Log any update checking failures and reasons

================================================================================

# security-vulnerability-scan

## Description
This action automatically scans project dependencies for known security vulnerabilities, identifying and addressing potential security risks in the codebase.

## Inputs:
  current-dependencies:
    description: 'List of current project dependencies'
    required: true
  vulnerability-databases:
    description: 'List of vulnerability databases to use for scanning'
    required: true

## Outputs:
  vulnerability-report:
    description: 'Detailed report of found vulnerabilities'
  affected-dependencies:
    description: 'List of dependencies affected by vulnerabilities'

## Implementation Details:
1. Prepare dependency list
   - Extract dependencies from package files
2. Set up vulnerability scanners
   - Configure tools like npm audit, Snyk, or OWASP Dependency-Check
3. Run vulnerability scan
   - Execute chosen scanner(s) against dependency list
4. Parse scan results
   - Extract vulnerability information from scanner output
5. Categorize vulnerabilities
   - Group vulnerabilities by severity (critical, high, medium, low)
6. Check for false positives
   - Implement logic to filter out known false positives
7. Generate vulnerability report
   - Create detailed report including affected packages, versions, and CVEs
8. Prioritize vulnerabilities
   - Rank vulnerabilities based on severity and potential impact
9. Suggest remediation steps
   - Provide recommendations for fixing or mitigating each vulnerability
10. Create list of affected dependencies
    - Compile a list of packages that need updating or replacing
11. Check for available patches
    - Identify if patches or updates are available for vulnerable dependencies
12. Set outputs
    - Use core.setOutput() for vulnerability report and affected dependencies list

## Error Handling:
- Handle timeouts or failures in vulnerability database queries
- Provide clear error messages for scan failures
- Implement retry logic for transient errors

================================================================================

# create-dependency-update-prs

## Description
This action automatically creates pull requests for dependency updates, including those addressing security vulnerabilities, streamlining the update process and improving project security and maintenance.

## Inputs:
  update-report:
    description: 'Report of available updates from check-dependency-updates'
    required: true
  vulnerability-report:
    description: 'Report of vulnerabilities from security-vulnerability-scan'
    required: true

## Outputs:
  created-prs:
    description: 'List of created pull requests'
  pr-creation-summary:
    description: 'Summary of the pull request creation operation'

## Implementation Details:
1. Parse update and vulnerability reports
   - Extract information about required updates
2. Group updates by type
   - Separate major, minor/patch, and security updates
3. Prepare update branches
   - Create new branches for each update group
4. Generate update commits
   - Create commits with dependency updates for each group
5. Compose PR descriptions
   - Include update details, changelog links, and security info
6. Create pull requests
   - Use GitHub API to create PRs for each update group
7. Apply labels to PRs
   - Add relevant labels (e.g., "dependencies", "security")
8. Assign reviewers
   - Automatically assign appropriate team members for review
9. Link related issues
   - Connect PRs to relevant issues or security advisories
10. Run CI checks
    - Trigger CI pipeline to validate updates
11. Update PR with CI results
    - Add comments with test results and potential impacts
12. Generate PR creation summary
    - Compile list of created PRs and their details
13. Set outputs
    - Use core.setOutput() for list of PRs and creation summary

## Error Handling:
- Handle conflicts in dependency updates
- Provide clear error messages for PR creation failures
- Implement logic to avoid duplicate PRs

================================================================================

# auto-merge-updates

## Description
This action automatically merges dependency update pull requests that meet predefined criteria, reducing manual intervention and keeping dependencies up-to-date more efficiently.

## Inputs:
  pr-details:
    description: 'Details of the pull request to be merged'
    required: true
  auto-merge-settings:
    description: 'Path to the auto-merge settings configuration file'
    required: true

## Outputs:
  merge-status:
    description: 'Status of the merge operation'
  merged-pr-details:
    description: 'Details of the merged pull request'

## Implementation Details:
1. Load auto-merge configuration
   - Parse auto-merge settings from config.json
2. Validate PR against auto-merge criteria
   - Check PR type (dependency update, security fix, etc.)
   - Verify CI status and required approvals
3. Check branch protection rules
   - Ensure PR complies with branch protection settings
4. Determine merge strategy
   - Choose between merge, squash, or rebase based on config
5. Attempt to merge PR
   - Use GitHub API to perform the merge operation
6. Handle merge conflicts
   - If conflicts occur, flag for manual intervention
7. Update related issues
   - Close or update any issues resolved by the merge
8. Clean up branches
   - Delete the source branch after successful merge
9. Generate merge report
   - Create a summary of the merge operation
10. Notify team of merge
    - Send notification to specified channels about the merge
11. Update dependency tracking
    - Update any internal dependency tracking systems
12. Set outputs
    - Use core.setOutput() for merge status and PR details

## Error Handling:
- Implement retry logic for transient GitHub API issues
- Provide clear error messages for merge failures
- Log detailed information for debugging failed merges

================================================================================
