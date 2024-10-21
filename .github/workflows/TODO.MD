# CI/CD Workflow (ci-cd.yml)

## Trigger:
- On push to main and develop branches
- On pull request to main and develop branches

## Steps:
1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input:
     github-token: ${{ github.token }}
   - Output: 
     repository-context: JSON object containing repository context
     config-data: Parsed configuration data
     environment-variables: Set environment variables

2. Validate Configuration
   - Use: ./.github/actions/validate-config
   - Input: 
     github-token: ${{ github.token }}
   - Output:
     config-validation-status: Boolean indicating if the configuration is valid

3. Cache Dependencies
   - Use: actions/cache@v3
   - Cache node_modules based on package-lock.json
   - Restore cached dependencies if available

4. Install Dependencies
   - Use: ./.github/actions/install-dependencies
   - Input:
     package-manager: ${{ fromJson(env.CONFIG).packageManager }}
     cache-key: ${{ hashFiles('**/package-lock.json') }}
     working-directory: '.'
   - Output:
     installation-status: Status of dependency installation (success/failure)
     installed-packages: List of installed packages (JSON array)
     cache-hit: Whether there was a cache hit

5. Run Linting
   - Use: ./.github/actions/run-linting
   - Input:
     working-directory: '.'
   - Output:
     linting-status: Overall linting status (pass/fail)
     linting-report: Detailed linting report (JSON object)
     pr-comment: Formatted output for PR comments

6. Run Tests (Parallel)
   - Use: ./.github/actions/run-tests
   - Input:
     test-command: ${{ fromJson(env.CONFIG).testCommand }}
     coverage-report-path: './coverage'
   - Output:
     test-results: JSON object with test results
     coverage-report: Path to generated coverage report
   - Run unit tests, integration tests, and e2e tests in parallel
   - Use test command from config.json for each app
   - Fail fast on test failures
   - Generate code coverage report

7. Upload Code Coverage
   - Use: actions/upload-artifact@v3
   - Input:
     name: code-coverage
     path: ${{ steps.run-tests.outputs.coverage-report }}

8. Analyze Code
   - Use: ./.github/actions/analyze-code
   - Input:
     github-token: ${{ github.token }}
     working-directory: '.'
   - Output:
     analysis-results: JSON object with analysis results
     quality-gate-status: Pass/fail status of quality gate

9. Build Application
   - Use: ./.github/actions/build-app
   - Input:
     build-command: ${{ fromJson(env.CONFIG).buildCommand }}
     working-directory: '.'
   - Output:
     build-artifacts: Path to generated build artifacts
     build-status: Success/failure status of the build

10. Run Security Checks
    - Use: ./.github/actions/run-security-checks
    - Input:
      security-command: ${{ fromJson(env.CONFIG).securityCommand }}
    - Output:
      security-report: JSON object with security scan results
      vulnerabilities-found: Number of vulnerabilities detected

11. Deploy Application
    - Use: ./.github/actions/deploy-app
    - Input:
      build-artifacts: ${{ steps.build-application.outputs.build-artifacts }}
      environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      deployment-config: ${{ fromJson(env.CONFIG).deploymentConfig }}
    - Output:
      deployment-url: URL of the deployed application
      deployment-status: Success/failure status of deployment

12. Run Post-Deployment Tests
    - Use: ./.github/actions/run-post-deployment-tests
    - Input:
      deployment-url: ${{ steps.deploy-application.outputs.deployment-url }}
      test-command: ${{ fromJson(env.CONFIG).postDeploymentTestCommand }}
    - Output:
      post-deployment-test-results: JSON object with test results

13. Update Documentation
    - Use: ./.github/actions/update-documentation
    - Input:
      github-token: ${{ github.token }}
      api-changes: ${{ steps.analyze-code.outputs.api-changes }}
    - Output:
      documentation-update-status: Status of documentation update (updated/no-update-needed)

14. Send Notifications
    - Use: ./.github/actions/send-notification
    - Input:
      notification-channels: ${{ fromJson(env.CONFIG).notificationChannels }}
      deployment-status: ${{ steps.deploy-application.outputs.deployment-status }}
      test-results: ${{ steps.run-tests.outputs.test-results }}
      coverage-report: ${{ steps.run-tests.outputs.coverage-report }}
    - Output:
      notification-status: Status of sent notifications

## Error Handling:
- If any step fails, stop the workflow and send a failure notification
- Create issue for consistent failures using ./.github/actions/create-issue
- Implement retry logic for transient failures in deployment and API calls
- Log detailed error information for debugging purposes

## Configuration:
- Use config.json for:
  - Package manager
  - Security check commands
  - Build, test, and lint commands for each app
  - Deployment settings for each app
  - Notification channels

## Environment Variables:
- CONFIG: Content of config.json
- GITHUB_TOKEN: ${{ github.token }}

## Templates Used:
- .github/templates/ci-cd_workflow_template.md

## Notes:
- This workflow integrates closely with repository configuration
- It covers the full CI/CD pipeline from linting to deployment
- Security checks are included in the pipeline
- Dependencies are cached to speed up builds
- Tests are run in parallel for faster execution
- Code coverage reporting is implemented
- The workflow is designed to be flexible and configurable through config.json
- Error handling and notifications are implemented throughout the pipeline
- Post-deployment tests ensure the deployed application is functioning correctly
- Documentation is automatically updated when API changes are detected

================================================================================

# Branch Management Workflow (branch-management.yml)

## Trigger:
- On push to any branch
- On pull request creation, update, or close
- Scheduled: Daily at 00:00 UTC (for stale branch cleanup)

## Steps:
1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input:
     github-token: ${{ github.token }}
   - Output: 
     repository-context: JSON object containing repository context
     config-data: Parsed configuration data
     environment-variables: Set environment variables

2. Validate Branch Name
   - Use: ./.github/actions/validate-branch-name
   - Input: 
     branch-name: ${{ github.ref }}
     branch-naming-rules: ${{ fromJson(env.CONFIG).branchNamingRules }}
   - Output:
     validation-result: Boolean indicating if the branch name is valid
     error-message: Explanation if the branch name is invalid

3. Create or Update Branch
   - Use: ./.github/actions/create-or-update-branch
   - Input: 
     branch-name: ${{ github.ref }}
     base-branch: ${{ github.base_ref }}
     github-token: ${{ github.token }}
   - Output:
     branch-operation: Created/Updated/No-change
     branch-sha: SHA of the latest commit on the branch

4. Apply Branch Protection
   - Use: ./.github/actions/apply-branch-protection
   - Input: 
     branch-name: ${{ github.ref }}
     protection-rules: ${{ fromJson(env.CONFIG).branchProtectionRules }}
     github-token: ${{ github.token }}
   - Output:
     protection-status: Applied/Failed/Already-protected

5. Wait for Manual PR Creation
   - Use: ./.github/actions/wait-for-pr
   - Input: 
     branch-name: ${{ github.ref }}
     wait-time: ${{ fromJson(env.CONFIG).prCreationWaitTime }}
   - Output:
     pr-created: Boolean indicating if a PR was created manually
     pr-number: Number of the created PR (if applicable)

6. Generate PR Description
   - Use: ./.github/actions/ai-generate-content
   - Input: 
     branch-changes: ${{ steps.create-or-update-branch.outputs.branch-changes }}
     commit-messages: ${{ steps.create-or-update-branch.outputs.commit-messages }}
     pr-template: .github/templates/pull-request_create_template.md
   - Output:
     generated-description: AI-generated PR description

7. Create or Update PR
   - Use: ./.github/actions/create-or-update-pr
   - Input: 
     branch-name: ${{ github.ref }}
     pr-title: ${{ github.event.head_commit.message }}
     pr-description: ${{ steps.generate-pr-description.outputs.generated-description }}
     github-token: ${{ github.token }}
   - Output:
     pr-number: Number of the created/updated PR
     pr-url: URL of the PR

8. Merge Branch (if applicable)
   - Use: ./.github/actions/merge-branch
   - Input: 
     source-branch: ${{ github.ref }}
     target-branch: ${{ github.base_ref }}
     merge-strategy: ${{ fromJson(env.CONFIG).mergeStrategy }}
     github-token: ${{ github.token }}
   - Output:
     merge-status: Success/Conflict/Failed
     merge-commit-sha: SHA of the merge commit (if successful)

9. Clean Up
   - Use: ./.github/actions/clean-up-branch
   - Input: 
     branch-name: ${{ github.ref }}
     auto-delete: ${{ fromJson(env.CONFIG).autoDeleteMergedBranches }}
     github-token: ${{ github.token }}
   - Output:
     cleanup-status: Deleted/Kept/Failed

10. Send Notification
    - Use: ./.github/actions/send-notification
    - Input:
      notification-channels: ${{ fromJson(env.CONFIG).notificationChannels }}
      branch-operation: ${{ steps.create-or-update-branch.outputs.branch-operation }}
      pr-url: ${{ steps.create-or-update-pr.outputs.pr-url }}
    - Output:
      notification-status: Sent/Failed

11. Stale Branch Cleanup (Daily)
    - Use: ./.github/actions/cleanup-stale-branches
    - Input: 
      stale-threshold: ${{ fromJson(env.CONFIG).staleBranchThreshold }}
      protected-branches: ${{ fromJson(env.CONFIG).protectedBranches }}
      github-token: ${{ github.token }}
    - Output:
      cleaned-branches: List of branches that were deleted
      remaining-stale-branches: List of stale branches that couldn't be deleted

## Error Handling:
- If branch creation/update fails, retry once before failing
- If PR creation fails, create an issue with the failure details
- Log detailed error information for debugging purposes
- Use error handling configuration from config.json

## Configuration:
- Use config.json for:
  - Branch naming conventions
  - Branch protection rules
  - PR creation delay time
  - Merge strategies
  - Auto-delete settings
  - Notification channels
  - Stale branch threshold (e.g., 30 days)

## Environment Variables:
- CONFIG: Content of config.json
- GITHUB_TOKEN: ${{ github.token }}

## Required Configuration Properties:
- From config.json:
  - version_control.branch_prefixes
  - version_control.branch_naming_pattern
  - version_control.branch_protection
  - version_control.merge_strategy
  - version_control.auto_delete_merged_branches
  - version_control.stale_branch_threshold
  - notifications.channels

## Templates Used:
- .github/templates/pull-request_create_template.md
- .github/templates/branch_creation_validation_template.md

## Notes:
- This workflow integrates closely with repository configuration
- It respects branch protection rules and merge strategies
- Automatic PR creation is delayed to allow for manual creation
- Branch naming conventions are strictly enforced
- Stale branches are automatically cleaned up daily
- AI-generated PR descriptions improve consistency and save time
- The workflow is designed to be flexible and configurable through config.json
- Error handling and notifications are implemented throughout the pipeline
- The workflow supports both automated and manual processes, allowing for human intervention when necessary

================================================================================

# Issue Management Workflow (issue-management.yml)

## Trigger:
- On issue opened, edited, or labeled
- Scheduled: Daily at 01:00 UTC (for issue review and SLA tracking)

## Steps:
1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input:
     github-token: ${{ github.token }}
   - Output: 
     repository-context: JSON object containing repository context
     config-data: Parsed configuration data
     environment-variables: Set environment variables

2. Auto Label
   - Use: ./.github/actions/auto-label
   - Input: 
     issue-title: ${{ github.event.issue.title }}
     issue-body: ${{ github.event.issue.body }}
     labeling-rules: ${{ fromJson(env.CONFIG).issueLabelingRules }}
   - Output:
     applied-labels: List of labels applied to the issue

3. Auto Assign
   - Use: ./.github/actions/auto-assign
   - Input: 
     issue-labels: ${{ steps.auto-label.outputs.applied-labels }}
     assignment-rules: ${{ fromJson(env.CONFIG).issueAssignmentRules }}
   - Output:
     assigned-users: List of users assigned to the issue

4. Generate Auto Response
   - Use: ./.github/actions/ai-generate-content
   - Input: 
     issue-content: ${{ github.event.issue.body }}
     response-template: .github/templates/issue_response_template.md
   - Output:
     generated-response: AI-generated initial response for the issue

5. Update Issue
   - Use: ./.github/actions/update-issue
   - Input:
     issue-number: ${{ github.event.issue.number }}
     comment-body: ${{ steps.generate-auto-response.outputs.generated-response }}
     update-body: true
     body-update: "## Steps to Reproduce\n\n[Please provide steps here]"
     github-token: ${{ github.token }}
   - Output:
     update-status: Success/Failed

6. Create Related Project Card
   - Use: ./.github/actions/create-project-card
   - Input:
     issue-number: ${{ github.event.issue.number }}
     project-board: ${{ fromJson(env.CONFIG).defaultProjectBoard }}
     github-token: ${{ github.token }}
   - Output:
     card-id: ID of the created project card

7. Link Related Issues/PRs
   - Use: ./.github/actions/link-related-items
   - Input:
     issue-number: ${{ github.event.issue.number }}
     similarity-threshold: ${{ fromJson(env.CONFIG).issueSimilarityThreshold }}
     github-token: ${{ github.token }}
   - Output:
     linked-items: List of linked issues and PRs

8. Prioritize Issue
   - Use: ./.github/actions/prioritize-issue
   - Input:
     issue-number: ${{ github.event.issue.number }}
     labels: ${{ steps.auto-label.outputs.applied-labels }}
     assignees: ${{ steps.auto-assign.outputs.assigned-users }}
     prioritization-rules: ${{ fromJson(env.CONFIG).issuePrioritizationRules }}
   - Output:
     priority: Assigned priority level

9. Set Milestone
   - Use: ./.github/actions/set-milestone
   - Input:
     issue-number: ${{ github.event.issue.number }}
     priority: ${{ steps.prioritize-issue.outputs.priority }}
     issue-type: ${{ contains(steps.auto-label.outputs.applied-labels, 'bug') && 'bug' || 'feature' }}
     milestone-rules: ${{ fromJson(env.CONFIG).milestoneMappingRules }}
   - Output:
     assigned-milestone: Name of the assigned milestone

10. Send Notifications
    - Use: ./.github/actions/send-notification
    - Input:
      notification-channels: ${{ fromJson(env.CONFIG).notificationChannels }}
      issue-url: ${{ github.event.issue.html_url }}
      assigned-users: ${{ steps.auto-assign.outputs.assigned-users }}
      priority: ${{ steps.prioritize-issue.outputs.priority }}
      notification-template: .github/templates/issue_notification_template.md
    - Output:
      notification-status: Sent/Failed

11. Track SLA
    - Use: ./.github/actions/track-sla
    - Input: 
      issue-number: ${{ github.event.issue.number }}
      priority: ${{ steps.prioritize-issue.outputs.priority }}
      sla-rules: ${{ fromJson(env.CONFIG).slaMappingRules }}
    - Output:
      sla-status: Within-SLA/At-Risk/Breached
      sla-expiry: Timestamp of SLA expiration

12. Close Stale Issues
    - Use: ./.github/actions/close-stale-issues
    - Input: 
      stale-threshold: ${{ fromJson(env.CONFIG).staleIssueThreshold }}
      exempt-labels: ${{ fromJson(env.CONFIG).staleExemptLabels }}
      github-token: ${{ github.token }}
    - Output:
      closed-issues: List of issues closed due to staleness

## Scheduled Tasks:
- Review stale issues
- Update issue status based on linked PR status
- Generate weekly issue report
- Update SLA status for all open issues

## Error Handling:
- If auto-labeling or auto-assignment fails, add a "needs-triage" label
- Create a high-priority issue if workflow fails consistently
- Log detailed error information for debugging purposes

## Configuration:
- Use config.json for:
  - issue_management.auto_labeling
  - issue_management.auto_assignment.rules
  - issue_management.stale_issue_management
  - pr_management.size_labels (for SLA calculation)
  - notifications.channels
  - notifications.priority_levels

## Environment Variables:
- CONFIG: Content of config.json
- GITHUB_TOKEN: ${{ github.token }}

## Templates Used:
- .github/templates/issue_create_template.md
- .github/templates/issue_response_template.md
- .github/templates/issue_notification_template.md

## Notes:
- This workflow integrates with project boards and milestones
- AI-generated responses are clearly marked as such
- Scheduled runs help manage overall issue health
- SLA tracking ensures timely issue resolution
- Automatic closure of stale issues helps maintain a clean issue tracker
- The workflow is designed to be flexible and configurable through config.json
- Error handling and notifications are implemented throughout the pipeline
- The workflow supports both automated and manual processes, allowing for human intervention when necessary
- Integration with project boards helps in visualizing and managing the overall project progress

================================================================================

# PR Management Workflow (pr-management.yml)

## Trigger:
- On pull request opened, synchronized, or reopened
- On push to branches with open PRs
- Scheduled: Daily at 00:00 UTC

## Steps:

1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input:
     github-token: ${{ github.token }}
   - Output: 
     repository-context: JSON object containing repository context
     config-data: Parsed configuration data
     environment-variables: Set environment variables

2. Check Existing PR
   - Use: ./.github/actions/check-existing-pr
   - Input:
     branch-name: ${{ github.head_ref }}
     github-token: ${{ github.token }}
   - Output:
     pr-exists: Boolean indicating if PR already exists
     existing-pr-number: Number of existing PR (if any)

3. Auto Label
   - Use: ./.github/actions/auto-label
   - Input: 
     pr-title: ${{ github.event.pull_request.title }}
     pr-body: ${{ github.event.pull_request.body }}
     changed-files: ${{ steps.setup-context.outputs.changed-files }}
     labeling-rules: ${{ fromJson(env.CONFIG).prLabelingRules }}
   - Output:
     applied-labels: List of labels applied to the PR

4. Auto Assign
   - Use: ./.github/actions/auto-assign
   - Input: 
     pr-labels: ${{ steps.auto-label.outputs.applied-labels }}
     changed-files: ${{ steps.setup-context.outputs.changed-files }}
     assignment-rules: ${{ fromJson(env.CONFIG).prAssignmentRules }}
   - Output:
     assigned-reviewers: List of users assigned as reviewers

5. Analyze Code
   - Use: ./.github/actions/analyze-code
   - Input:
     github-token: ${{ github.token }}
     pr-number: ${{ github.event.pull_request.number }}
   - Output:
     analysis-results: JSON object with analysis results
     quality-gate-status: Pass/fail status of quality gate

6. Run Tests
   - Use: ./.github/actions/run-tests
   - Input:
     test-command: ${{ fromJson(env.CONFIG).testCommand }}
     coverage-report-path: './coverage'
   - Output:
     test-results: JSON object with test results
     coverage-report: Path to generated coverage report

7. Generate Review Comments
   - Use: ./.github/actions/ai-generate-content
   - Input: 
     pr-diff: ${{ steps.setup-context.outputs.pr-diff }}
     analysis-results: ${{ steps.analyze-code.outputs.analysis-results }}
     test-results: ${{ steps.run-tests.outputs.test-results }}
     review-template: .github/templates/code-review_guidelines_checklist.md
   - Output:
     generated-comments: AI-generated review comments

8. Update PR
   - Use: ./.github/actions/update-pr
   - Input:
     pr-number: ${{ github.event.pull_request.number }}
     pr-body: ${{ steps.generate-review-comments.outputs.generated-comments }}
     labels: ${{ steps.auto-label.outputs.applied-labels }}
     reviewers: ${{ steps.auto-assign.outputs.assigned-reviewers }}
     github-token: ${{ github.token }}
   - Output:
     update-status: Success/Failed

9. Check PR Status
   - Use: ./.github/actions/check-pr-status
   - Input:
     pr-number: ${{ github.event.pull_request.number }}
     stale-threshold: ${{ fromJson(env.CONFIG).prStaleThreshold }}
     github-token: ${{ github.token }}
   - Output:
     pr-status: Active/Stale/Needs-Attention

10. Send Notifications
    - Use: ./.github/actions/send-notification
    - Input:
      notification-channels: ${{ fromJson(env.CONFIG).notificationChannels }}
      pr-url: ${{ github.event.pull_request.html_url }}
      assigned-reviewers: ${{ steps.auto-assign.outputs.assigned-reviewers }}
      pr-status: ${{ steps.check-pr-status.outputs.pr-status }}
      notification-template: .github/templates/notification_deployment_status.md
    - Output:
      notification-status: Sent/Failed

## Error Handling:
- If tests or analysis fail, add a "needs-work" label to the PR
- Create issue for PRs with persistent failures
- Log detailed error information for debugging purposes

## Scheduled Tasks:
- Review all open PRs
- Update stale PR statuses
- Generate report on PR health and bottlenecks

## Configuration:
- Use config.json for:
  - PR labeling rules
  - Reviewer assignment logic
  - Stale PR criteria
  - Notification channels
  - Test and analysis commands

## Environment Variables:
- CONFIG: Content of config.json
- GITHUB_TOKEN: ${{ github.token }}

## Templates Used:
- .github/templates/pull-request_create_template.md
- .github/templates/code-review_guidelines_checklist.md
- .github/templates/notification_deployment_status.md

## Notes:
- This workflow supports both new and existing PRs
- AI-generated comments are clearly marked as such
- Scheduled runs help manage overall PR health
- The workflow is designed to be flexible and configurable through config.json
- Error handling and notifications are implemented throughout the pipeline
- Code analysis and test results are integrated into the PR review process
- The workflow supports both automated and manual processes, allowing for human intervention when necessary
- Integration with other workflows (like CI/CD) ensures comprehensive quality checks before merging

================================================================================

# Release Management Workflow (release-management.yml)

## Trigger:
- On push to release/* branches
- Manual trigger for hotfix releases

## Steps:

1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input: 
     - GITHUB_TOKEN: ${{ github.token }}
     - CONFIG: ${{ env.CONFIG }}
   - Output: 
     - repository_context: JSON object with repository details
     - apps_configuration: JSON object with app-specific configurations

2. Determine Affected Apps
   - Use: ./.github/actions/determine-affected-apps
   - Input: 
     - changed_files: ${{ steps.setup-context.outputs.changed_files }}
     - apps_configuration: ${{ steps.setup-context.outputs.apps_configuration }}
   - Output: 
     - affected_apps: JSON array of app names that need to be released

3. For each affected app:

   3.1. Get Version
   - Use: ./.github/actions/get-version
   - Input:
     - app_name: Current app name from affected_apps
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
   - Output:
     - new_version: Next version number for the app

   3.2. Bump Version
   - Use: ./.github/actions/bump-version
   - Input:
     - app_name: Current app name
     - new_version: ${{ steps.get-version.outputs.new_version }}
   - Output:
     - version_bumped: Boolean indicating success

   3.3. Generate Changelog
   - Use: ./.github/actions/generate-changelog
   - Input:
     - app_name: Current app name
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
     - new_version: ${{ steps.get-version.outputs.new_version }}
   - Output:
     - changelog: Generated changelog content

   3.4. Build App
   - Use: ./.github/actions/build-app
   - Input:
     - app_name: Current app name
     - build_command: ${{ fromJson(env.CONFIG).apps[app_name].build_command }}
   - Output:
     - build_success: Boolean indicating build success

   3.5. Run Tests
   - Use: ./.github/actions/run-tests
   - Input:
     - app_name: Current app name
     - test_command: ${{ fromJson(env.CONFIG).apps[app_name].test_command }}
   - Output:
     - tests_passed: Boolean indicating test success

   3.6. Create Release
   - Use: ./.github/actions/create-release
   - Input:
     - app_name: Current app name
     - new_version: ${{ steps.get-version.outputs.new_version }}
     - changelog: ${{ steps.generate-changelog.outputs.changelog }}
   - Output:
     - release_url: URL of the created GitHub release

   3.7. Generate Release Notes
   - Use: ./.github/actions/ai-generate-content
   - Input:
     - content_type: "release_notes"
     - changelog: ${{ steps.generate-changelog.outputs.changelog }}
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
     - app_info: ${{ fromJson(env.CONFIG).apps[app_name] }}
   - Output:
     - release_notes: AI-generated release notes content

   3.8. Deploy App
   - Use: ./.github/actions/deploy-app
   - Input:
     - app_name: Current app name
     - deployment_config: ${{ fromJson(env.CONFIG).apps[app_name].deployment }}
     - build_artifacts: Path to build artifacts
   - Output:
     - deployment_url: URL of the deployed app

4. Update Project Documentation
   - Use: ./.github/actions/update-documentation
   - Input:
     - affected_apps: ${{ steps.determine-affected-apps.outputs.affected_apps }}
     - new_versions: JSON object mapping app names to new versions
   - Output:
     - docs_updated: Boolean indicating documentation update success

5. Create Release PR
   - Use: ./.github/actions/create-or-update-pr
   - Input:
     - branch_name: "release-${{ steps.get-version.outputs.new_version }}"
     - pr_title: "Release ${{ steps.get-version.outputs.new_version }}"
     - pr_body: Generated from release_notes_changelog.md
     - base_branch: "main"
   - Output:
     - pr_url: URL of the created or updated PR

6. Send Notifications
   - Use: ./.github/actions/send-notification
   - Input:
     - notification_type: "release"
     - affected_apps: ${{ steps.determine-affected-apps.outputs.affected_apps }}
     - release_urls: JSON object mapping app names to release URLs
     - deployment_urls: JSON object mapping app names to deployment URLs
   - Output:
     - notification_sent: Boolean indicating notification success

## Error Handling:
- If any step fails for an app:
  - Use: ./.github/actions/revert-version-bump
    - Input: 
      - app_name: Name of the failed app
      - original_version: Version before the bump
  - Use: ./.github/actions/create-issue
    - Input:
      - issue_title: "Release failed for ${{ app_name }}"
      - issue_body: Details of the failure and steps taken
      - labels: ['release-failed', 'high-priority']
- If all apps fail:
  - Use: ./.github/actions/revert-all-changes
    - Input:
      - affected_apps: ${{ steps.determine-affected-apps.outputs.affected_apps }}
  - Use: ./.github/actions/create-issue
    - Input:
      - issue_title: "Release process failed for all apps"
      - issue_body: Comprehensive error report
      - labels: ['release-failed', 'critical']

## Post-Release:
- Use: ./.github/actions/update-release-branch
  - Input:
    - release_branch: Name of the release branch
    - main_branch: "main"

## Configuration:
- Use config.json (accessed via ${{ env.CONFIG }}) to determine:
  - Build and test commands for each app
  - Deployment platforms and configurations
  - Release branch naming conventions
  - Version bump rules
  - Changelog generation settings

## Environment Variables:
- CONFIG: Content of config.json
- GITHUB_TOKEN: ${{ github.token }}

## Templates Used:
- .github/templates/release_notes_changelog.md
- .github/templates/release_notes_changelog.md
- .github/templates/pull-request_create_template.md
- .github/templates/notification_deployment_status.md

================================================================================

# Security and Dependency Management Workflow (security-dependency-management.yml)

This workflow performs security checks and dependency updates.

## Trigger:
- Scheduled (weekly on Monday at 2 AM UTC)
- On security advisory published
- Manual trigger (workflow_dispatch)

## Steps:
1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input: None
   - Output: 
     - repository_context: JSON object containing repository details
     - affected_apps: List of affected applications

2. Run Security Check
   - Use: ./.github/actions/run-security-check
   - Input: 
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
   - Output: 
     - vulnerability_count: Total number of vulnerabilities found
     - highest_severity: Highest severity level of found vulnerabilities
     - critical_vulnerabilities: Number of critical vulnerabilities
   - Rule: Perform vulnerability scan on codebase and dependencies

3. AI Analysis of Security Report
   - Use: ./.github/actions/ai-generate-content
   - Input: 
     - content_type: "security_analysis"
     - security_report: ${{ steps.run-security-check.outputs.security_report }}
   - Output: 
     - ai_security_analysis: AI-generated insights on security vulnerabilities
   - Rule: Generate actionable insights based on the security report

4. Update Dependencies
   - Use: ./.github/actions/update-dependencies
   - Input:
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
   - Output: 
     - update_count: Number of dependencies to be updated
     - updates_list: JSON object containing list of updates
   - Rule: Check for outdated dependencies and create update plan

5. AI Generate Update Summary
   - Use: ./.github/actions/ai-generate-content
   - Input:
     - content_type: "dependency_update_summary"
     - dependency_updates: ${{ steps.update-dependencies.outputs.updates_list }}
   - Output:
     - ai_update_summary: AI-generated summary of updates and their potential impact
   - Rule: Summarize dependency updates and assess their impact

6. Create PR for Updates
   - Use: ./.github/actions/create-or-update-pr
   - Input:
     - pr_title: "Security and Dependency Updates"
     - pr_body: ${{ steps.ai-generate-update-summary.outputs.ai_update_summary }}
     - branch_name: "security-dependency-update"
     - base_branch: "main"
   - Output:
     - pr_url: URL of the created or updated PR
   - Rule: Create or update PR with dependency updates and security fixes

7. Send Notification
   - Use: ./.github/actions/send-notification
   - Input:
     - notification_type: "security_dependency_update"
     - vulnerability_count: ${{ steps.run-security-check.outputs.vulnerability_count }}
     - highest_severity: ${{ steps.run-security-check.outputs.highest_severity }}
     - pr_url: ${{ steps.create-pr-for-updates.outputs.pr_url }}
   - Output:
     - notification_sent: Boolean indicating if notification was sent successfully
   - Rule: Notify security team of scan results, vulnerability count, and update PR

8. Update Security Policy
   - Use: ./.github/actions/update-security-policy
   - Input:
     - security_report: ${{ steps.run-security-check.outputs.security_report }}
     - ai_analysis: ${{ steps.ai-analysis-of-security-report.outputs.ai_security_analysis }}
   - Output:
     - policy_updated: Boolean indicating if policy was updated
   - Rule: Update security policy based on latest findings

## Error Handling:
- If critical vulnerabilities found:
  - Use: ./.github/actions/create-issue
    - Input:
      - issue_title: "Critical Security Vulnerabilities Detected"
      - issue_body: ${{ steps.ai-analysis-of-security-report.outputs.ai_security_analysis }}
      - labels: ['security', 'critical']
- If workflow fails:
  - Use: ./.github/actions/send-notification
    - Input:
      - notification_type: "workflow_failure"
      - workflow_name: "Security and Dependency Management"
      - error_message: ${{ job.status }}

## Configuration:
- Use ${{ env.CONFIG }} (from config.json) for:
  - security_check.thresholds
  - dependency_update.policies
  - notification.settings

## Environment Variables:
- GITHUB_TOKEN: ${{ github.token }}
- CONFIG: ${{ env.CONFIG }}

## Templates Used:
- .github/templates/security_vulnerability_report_template.md
- .github/templates/dependency_update_pr_description.md
- .github/templates/issue_auto_generated_template.md

## Notes:
- This workflow combines security checks with dependency updates for efficiency
- AI-powered analysis helps in quick assessment of vulnerabilities and updates
- The workflow creates a single PR for both security fixes and dependency updates
- Notifications are sent based on the severity of findings
- The security policy is automatically updated to reflect the latest security stance

================================================================================

# Documentation Update Workflow (documentation-update.yml)

This workflow updates project documentation.

## Trigger:
- On push to main branch (changes to .md, .ts, .js files)
- Scheduled (monthly on the 1st at 2 AM UTC)
- Manual trigger (workflow_dispatch)

## Steps:
1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input: None
   - Output: 
     - repository_context: JSON object containing repository details
   - Rule: Set up the necessary context for the workflow

2. Generate API Documentation
   - Use: ./.github/actions/generate-api-docs
   - Input: 
     - source_directory: './src'
   - Output: 
     - api_docs_path: Path to generated API documentation
   - Rule: Generate API documentation from source code

3. Update Wiki
   - Use: ./.github/actions/update-github-wiki
   - Input: 
     - wiki_directory: './wiki'
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
   - Output:
     - wiki_updated: Boolean indicating if wiki was updated
   - Rule: Update GitHub wiki with latest documentation

4. AI Review Documentation
   - Use: ./.github/actions/ai-review-docs
   - Input:
     - docs_directory: './docs'
     - wiki_directory: './wiki'
   - Output:
     - ai_review_results: AI-generated review of documentation
   - Rule: Perform AI-powered review of documentation for improvements

5. Update README and CONTRIBUTING
   - Use: ./.github/actions/update-repo-docs
   - Input:
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
   - Output:
     - readme_updated: Boolean indicating if README was updated
     - contributing_updated: Boolean indicating if CONTRIBUTING was updated
   - Rule: Update README.md and CONTRIBUTING.md with latest information

6. Update Changelog
   - Use: ./.github/actions/update-changelog
   - Input:
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
   - Output:
     - changelog_updated: Boolean indicating if changelog was updated
   - Rule: Update CHANGELOG.md with latest changes (only on push events)

7. Commit Changes
   - Use: ./.github/actions/commit-changes
   - Input:
     - commit_message: 'Update documentation'
     - file_pattern: 'docs/** wiki/** README.md CONTRIBUTING.md CHANGELOG.md'
   - Output:
     - changes_committed: Boolean indicating if changes were committed
   - Rule: Commit documentation changes to the repository

8. Create or Update PR
   - Use: ./.github/actions/create-or-update-pr
   - Input:
     - pr_title: 'Documentation Update'
     - pr_body: 'This PR updates the project documentation.'
     - branch_name: 'docs-update'
     - base_branch: 'main'
   - Output:
     - pr_url: URL of the created or updated PR
   - Rule: Create or update PR for documentation changes

9. Send Notification
   - Use: ./.github/actions/send-notification
   - Input:
     - notification_type: "documentation_update"
     - pr_url: ${{ steps.create-or-update-pr.outputs.pr_url }}
   - Output:
     - notification_sent: Boolean indicating if notification was sent successfully
   - Rule: Notify docs team of updates

## Error Handling:
- If docs update fails:
  - Use: ./.github/actions/create-issue
    - Input:
      - issue_title: 'Documentation Update Failed'
      - issue_body: 'The documentation update process encountered an error. Please review the workflow logs and resolve the issue manually.'
      - labels: ['documentation', 'bug']

## Configuration:
- Use ${{ env.CONFIG }} (from config.json) for:
  - documentation.generation_settings
  - wiki.update_rules
  - notification.preferences

## Environment Variables:
- GITHUB_TOKEN: ${{ github.token }}
- CONFIG: ${{ env.CONFIG }}

## Templates Used:
- .github/templates/documentation_update_changelog.md
- .github/templates/pull-request_create_template.md
- .github/templates/issue_auto_generated_template.md

## Notes:
- This workflow automates the process of keeping project documentation up-to-date
- It includes API documentation generation, wiki updates, and README/CONTRIBUTING updates
- AI-powered review helps improve documentation quality
- The changelog is automatically updated on push events
- All changes are consolidated into a single PR for easy review

================================================================================

# Metrics Generation Workflow (metrics-generation.yml)

This workflow generates project metrics periodically and provides insights.

## Trigger:
- Scheduled (weekly on Monday at midnight)
- On release creation
- Manual trigger (workflow_dispatch)

## Steps:
1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input: None
   - Output: 
     - repository_context: JSON object containing repository details
   - Rule: Set up the necessary context for the workflow

2. Generate Metrics
   - Use: ./.github/actions/generate-metrics
   - Input: 
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
   - Output: 
     - metrics_data: JSON object containing generated metrics
     - top_contributors: List of top contributors
     - improvement_needs: List of areas needing improvement
   - Rule: Generate comprehensive project metrics

3. Generate Metrics Report
   - Use: ./.github/actions/ai-generate-content
   - Input:
     - content_type: "metrics_analysis"
     - metrics_data: ${{ steps.generate-metrics.outputs.metrics_data }}
   - Output:
     - metrics_report: AI-generated detailed metrics analysis report
   - Rule: Generate AI-powered detailed metrics analysis report

4. Create Discussion Post
   - Use: ./.github/actions/create-discussion-post
   - Input:
     - discussion_category: "Announcements"
     - discussion_title: "Weekly Metrics Report"
     - discussion_body: ${{ steps.generate-metrics-report.outputs.metrics_report }}
   - Output:
     - discussion_url: URL of the created discussion post
   - Rule: Create weekly metrics report in Announcements category

5. Generate Contributor Engagement Content
   - Use: ./.github/actions/ai-generate-content
   - Input:
     - content_type: "contributor_engagement"
     - top_contributors: ${{ steps.generate-metrics.outputs.top_contributors }}
   - Output:
     - engagement_messages: JSON object containing personalized messages for top contributors
   - Rule: Generate personalized messages for top contributors

6. Send Contributor Engagement Messages
   - Use: ./.github/actions/send-notification
   - Input:
     - notification_type: "contributor_engagement"
     - engagement_messages: ${{ steps.generate-contributor-engagement-content.outputs.engagement_messages }}
   - Output:
     - messages_sent: Number of messages sent successfully
   - Rule: Send personalized messages to top contributors via email

7. Send Notification
   - Use: ./.github/actions/send-notification
   - Input:
     - notification_type: "metrics_report"
     - metrics_report_url: ${{ steps.create-discussion-post.outputs.discussion_url }}
   - Output:
     - notification_sent: Boolean indicating if notification was sent successfully
   - Rule: Notify stakeholders about new metrics report via Slack and email

8. Send Webhook
   - Use: ./.github/actions/send-webhook
   - Input:
     - webhook_type: "metrics_data"
     - metrics_data: ${{ steps.generate-metrics.outputs.metrics_data }}
     - metrics_report: ${{ steps.generate-metrics-report.outputs.metrics_report }}
   - Output:
     - webhook_sent: Boolean indicating if webhook was sent successfully
   - Rule: Send metrics data and report to external systems

9. Generate Improvement Suggestions
   - Use: ./.github/actions/ai-generate-content
   - Input:
     - content_type: "improvement_suggestions"
     - improvement_needs: ${{ steps.generate-metrics.outputs.improvement_needs }}
   - Output:
     - improvement_suggestions: List of AI-generated improvement suggestions
   - Rule: Generate AI-powered suggestions for improvements if needed

10. Create Improvement Issues
    - Use: ./.github/actions/create-issues
    - Input:
      - issues_data: ${{ steps.generate-improvement-suggestions.outputs.improvement_suggestions }}
    - Output:
      - created_issues: List of URLs for created issues
    - Rule: Create issues for suggested improvements with AI-generated content

## Error Handling:
- If any step fails:
  - Use: ./.github/actions/send-notification
    - Input:
      - notification_type: "workflow_failure"
      - workflow_name: "Metrics Generation"
      - error_message: ${{ job.status }}
    - Output:
      - notification_sent: Boolean indicating if notification was sent successfully

## Configuration:
- Use ${{ env.CONFIG }} (from config.json) for:
  - metrics.generation_settings
  - contributor_engagement.rules
  - notification.preferences
  - webhook.endpoints

## Environment Variables:
- GITHUB_TOKEN: ${{ github.token }}
- CONFIG: ${{ env.CONFIG }}
- WEBHOOK_SECRET: ${{ secrets.WEBHOOK_SECRET }}

## Templates Used:
- .github/templates/performance_metrics_report_template.md
- .github/templates/issue_auto_generated_template.md

## Notes:
- This workflow provides comprehensive project metrics and insights
- It leverages AI for generating reports and improvement suggestions
- Contributor engagement is automated to recognize top contributors
- Metrics are shared via discussion posts, notifications, and webhooks
- Improvement suggestions are automatically converted into actionable issues

================================================================================

# Repository Setup Workflow (repository-setup.yml)

This workflow handles initial repository setup and maintenance for Git Flow implementation.

## Trigger:
- On repository creation (create event for main branch)
- Manual trigger (workflow_dispatch)

## Steps:
1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input: None
   - Output: 
     - repository_context: JSON object containing repository details
   - Rule: Set up the necessary context for the workflow

2. Create Git Flow Branches
   - Use: ./.github/actions/create-or-update-branch
   - Input:
     - branch_names: ['main', 'develop', 'release', 'hotfix']
   - Output:
     - branches_created: List of successfully created branches
   - Rule: Create 'main', 'develop', 'release', 'hotfix' branches

3. Generate Content
   - Use: ./.github/actions/ai-generate-content
   - Input:
     - content_type: "repository_docs"
     - repository_context: ${{ steps.setup-context.outputs.repository_context }}
   - Output:
     - generated_content: JSON object containing generated content for each file
   - Rule: Generate personalized CONTRIBUTING.md, CODE_OF_CONDUCT.md, README.md, CHANGELOG.md

4. Setup Branch Protection Rules
   - Use: ./.github/actions/setup-branch-protection
   - Input:
     - branches: ['main', 'develop']
     - protection_rules: ${{ env.CONFIG.branch_protection_rules }}
   - Output:
     - rules_applied: List of branches with successfully applied protection rules
   - Rule: Configure protection rules for 'main' and 'develop' branches

5. Create Wiki Pages
   - Use: ./.github/actions/create-wiki-pages
   - Input:
     - pages: ['Git Flow Process', 'Branching Strategy', 'Release Process']
     - content: ${{ steps.generate-content.outputs.generated_content.wiki_pages }}
   - Output:
     - created_pages: List of successfully created wiki pages
   - Rule: Create 'Git Flow Process', 'Branching Strategy', 'Release Process' pages

6. Create Discussion Posts
   - Use: ./.github/actions/create-discussion-posts
   - Input:
     - posts: ['Welcome', 'Git Flow Introduction']
     - content: ${{ steps.generate-content.outputs.generated_content.discussion_posts }}
   - Output:
     - created_posts: List of URLs for created discussion posts
   - Rule: Create 'Welcome' and 'Git Flow Introduction' posts

7. Configure GitHub Actions
   - Use: ./.github/actions/setup-github-actions
   - Input:
     - workflows: ['ci-cd', 'branch-management', 'issue-management', 'pr-management']
   - Output:
     - configured_workflows: List of successfully configured workflows
   - Rule: Set up 'ci-cd', 'branch-management', 'issue-management', 'pr-management' workflows

8. Setup Issue Labels
   - Use: ./.github/actions/setup-issue-labels
   - Input:
     - labels: ${{ env.CONFIG.issue_labels }}
   - Output:
     - created_labels: List of successfully created labels
   - Rule: Create 'bug', 'enhancement', 'documentation', 'good first issue', 'help wanted' labels

9. Setup Project Board
   - Use: ./.github/actions/setup-project-board
   - Input:
     - columns: ['To Do', 'In Progress', 'Review', 'Done']
   - Output:
     - board_url: URL of the created project board
   - Rule: Create 'To Do', 'In Progress', 'Review', 'Done' columns

10. Setup Repository Settings
    - Use: ./.github/actions/setup-repository-settings
    - Input:
      - settings: ${{ env.CONFIG.repository_settings }}
    - Output:
      - applied_settings: List of successfully applied settings
    - Rule: Enable 'issues', 'projects', 'wiki', 'discussions' features

11. Setup Dependabot
    - Use: ./.github/actions/setup-dependabot
    - Input:
      - ecosystems: ['npm', 'github-actions']
      - config: ${{ env.CONFIG.dependabot_settings }}
    - Output:
      - dependabot_file: Path to created dependabot.yml file
    - Rule: Configure for 'npm' and 'github-actions' ecosystems

12. Setup CODEOWNERS
    - Use: ./.github/actions/setup-codeowners
    - Input:
      - repository_admins: ${{ steps.setup-context.outputs.repository_context.admins }}
    - Output:
      - codeowners_file: Path to created CODEOWNERS file
    - Rule: Set owners based on repository admins

13. Commit Changes
    - Use: ./.github/actions/commit-changes
    - Input:
      - commit_message: "Initial repository setup"
      - files: ['CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'README.md', 'CHANGELOG.md', 'dependabot.yml', 'CODEOWNERS']
    - Output:
      - commit_sha: SHA of the created commit
    - Rule: Commit with message "Initial repository setup"

14. Create Pull Request
    - Use: ./.github/actions/create-or-update-pr
    - Input:
      - pr_title: "Initial Repository Setup"
      - pr_body: "This PR sets up the initial repository structure and configurations."
      - branch_name: "initial-setup"
      - base_branch: "main"
    - Output:
      - pr_url: URL of the created PR
    - Rule: Create PR for repository setup changes

15. Send Notification
    - Use: ./.github/actions/send-notification
    - Input:
      - notification_type: "setup_completion"
      - setup_details: JSON object containing setup summary
    - Output:
      - notification_sent: Boolean indicating if notification was sent successfully
    - Rule: Notify of setup completion with high severity

## Error Handling:
- If setup fails:
  - Use: ./.github/actions/create-issue
    - Input:
      - issue_title: "Repository Setup Failed"
      - issue_body: ${{ job.status }}
      - labels: ['high-priority', 'setup-error']
    - Output:
      - issue_url: URL of the created issue

## Configuration:
- Use ${{ env.CONFIG }} (from config.json) for:
  - git_flow.branch_configurations
  - branch_protection.rules
  - issue_labels.definitions
  - project_board.settings
  - repository.feature_toggles
  - dependabot.settings
  - notification.preferences

## Environment Variables:
- GITHUB_TOKEN: ${{ github.token }}
- CONFIG: ${{ env.CONFIG }}

## Templates Used:
- .github/templates/performance_metrics_report_template.md
- .github/templates/issue_auto_generated_template.md

## Notes:
- This workflow automates the entire process of setting up a new repository
- It implements Git Flow, sets up necessary documentation, and configures repository settings
- AI-generated content ensures personalized and relevant documentation
- Branch protection rules are applied to maintain code quality
- The setup process is summarized in a PR for review before finalizing

================================================================================

# Performance and Availability Monitoring Workflow (performance-availability-monitoring.yml)

## Trigger:
- Scheduled (every 15 minutes)
- Manual trigger (workflow_dispatch)

## Steps:

1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input: None
   - Output: 
     - repository_context: JSON object containing repository details
     - github_pages_urls: List of GitHub Pages URLs to monitor
   - Rule: Set up the necessary context for the workflow

2. Check Availability
   - Use: ./.github/actions/check-site-availability
   - Input: 
     - urls: ${{ steps.setup-context.outputs.github_pages_urls }}
   - Output: 
     - availability_status: JSON object with availability status for each URL
   - Rule: Check the availability of each GitHub Pages URL

3. Measure Performance
   - Use: ./.github/actions/measure-site-performance
   - Input: 
     - urls: ${{ steps.setup-context.outputs.github_pages_urls }}
   - Output: 
     - performance_metrics: JSON object with performance metrics (load time, TTFB, LCP) for each URL
   - Rule: Measure performance metrics for each GitHub Pages URL

4. Analyze Results
   - Use: ./.github/actions/analyze-performance-results
   - Input: 
     - availability_status: ${{ steps.check-availability.outputs.availability_status }}
     - performance_metrics: ${{ steps.measure-performance.outputs.performance_metrics }}
   - Output: 
     - analysis_report: Detailed analysis of availability and performance
     - performance_score: Overall performance score
   - Rule: Analyze availability status and performance metrics

5. Create Issues (if needed)
   - Use: ./.github/actions/create-issue
   - Input:
     - issue_type: ${{ steps.analyze-results.outputs.issue_type }}
     - issue_details: ${{ steps.analyze-results.outputs.issue_details }}
     - issue_template: .github/templates/issue_auto_generated_template.md
   - Output:
     - issue_url: URL of the created issue (if any)
   - Rule: Create issue for downtime or poor performance if thresholds are exceeded

6. Send Notifications
   - Use: ./.github/actions/send-notification
   - Input:
     - notification_type: "performance_availability"
     - analysis_report: ${{ steps.analyze-results.outputs.analysis_report }}
     - issue_url: ${{ steps.create-issues.outputs.issue_url }}
   - Output:
     - notification_sent: Boolean indicating if notification was sent successfully
   - Rule: Notify team of downtime or performance issues, including link to created issue (if any)

7. Send Webhook
   - Use: ./.github/actions/send-webhook
   - Input:
     - webhook_type: "performance_availability_data"
     - performance_data: ${{ steps.measure-performance.outputs.performance_metrics }}
     - availability_data: ${{ steps.check-availability.outputs.availability_status }}
   - Output:
     - webhook_sent: Boolean indicating if webhook was sent successfully
   - Rule: Send performance and availability data to external systems

## Error Handling:
- If monitoring fails:
  - Use: ./.github/actions/create-issue
    - Input:
      - issue_title: "Performance Monitoring Failed"
      - issue_body: "The performance and availability monitoring workflow encountered an error. Manual check required."
      - labels: ['high-priority', 'monitoring-error']
    - Output:
      - issue_url: URL of the created issue

## Configuration:
- Use ${{ env.CONFIG }} (from config.json) for:
  - performance.thresholds
  - availability.criteria
  - notification.settings
  - webhook.endpoints

## Environment Variables:
- GITHUB_TOKEN: ${{ github.token }}
- CONFIG: ${{ env.CONFIG }}
- WEBHOOK_SECRET: ${{ secrets.WEBHOOK_SECRET }}

## Templates Used:
- .github/templates/performance_metrics_report_template.md
- .github/templates/issue_auto_generated_template.md

## Notes:
- This workflow runs frequently to ensure timely detection of issues
- It combines availability checks with performance measurements
- Automated analysis helps quickly identify potential problems
- Issues are automatically created for significant problems
- Notifications and webhooks ensure rapid response to detected issues

================================================================================

# Disaster Recovery Workflow (disaster-recovery.yml)

## Trigger:
- On workflow_run event from performance-availability-monitoring.yml (when it fails or detects issues)
- Manual trigger (workflow_dispatch)

## Steps:

1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input: None
   - Output: 
     - repository_context: JSON object containing repository details
     - affected_components: List of components affected by the issue
   - Rule: Set up the necessary context for the workflow

2. Attempt Basic Recovery
   - Use: ./.github/actions/basic-recovery
   - Input:
     - affected_components: ${{ steps.setup-context.outputs.affected_components }}
     - recovery_commands: ${{ env.CONFIG.recovery_commands }}
   - Output:
     - recovery_status: JSON object with recovery status for each component
   - Rule: Attempt to rebuild and redeploy affected components, clear GitHub Actions caches if applicable

3. Verify Deployment
   - Use: ./.github/actions/verify-deployment
   - Input: 
     - affected_components: ${{ steps.setup-context.outputs.affected_components }}
   - Output: 
     - deployment_status: JSON object with deployment status (success/failure) for each component
   - Rule: Verify the deployment status of affected components after recovery attempt

4. Rollback to Last Known Good State (if needed)
   - Use: ./.github/actions/rollback-deployment
   - Input:
     - components_to_rollback: ${{ steps.verify-deployment.outputs.failed_components }}
     - last_good_commit: ${{ env.CONFIG.last_known_good_commit }}
   - Output:
     - rollback_status: JSON object with rollback status for each component
   - Rule: Revert to previous stable state if recovery fails

5. Create Issue
   - Use: ./.github/actions/create-issue
   - Input:
     - issue_title: "Disaster Recovery Incident Report"
     - issue_body: ${{ steps.attempt-basic-recovery.outputs.recovery_status }}
     - labels: ['incident', 'high-priority']
   - Output:
     - issue_url: URL of the created issue
   - Rule: Create issue for incident tracking

6. Send Notifications
   - Use: ./.github/actions/send-notification
   - Input:
     - notification_type: "disaster_recovery"
     - incident_details: JSON object containing incident and recovery details
     - issue_url: ${{ steps.create-issue.outputs.issue_url }}
   - Output:
     - notification_sent: Boolean indicating if notification was sent successfully
   - Rule: Notify team of incident status and recovery attempts, include link to created issue

## Error Handling:
- If automated recovery fails:
  - Use: ./.github/actions/create-issue
    - Input:
      - issue_title: "Automated Recovery Failed - Manual Intervention Required"
      - issue_body: "The automated disaster recovery process has failed. Immediate manual intervention is required."
      - labels: ['critical', 'manual-intervention-required']
    - Output:
      - issue_url: URL of the created issue

## Configuration:
- Use ${{ env.CONFIG }} (from config.json) for:
  - recovery_commands: Object mapping components to their rebuild and redeploy commands
  - rollback.thresholds
  - notification.settings
  - last_known_good_commit: SHA of the last known good deployment

## Environment Variables:
- GITHUB_TOKEN: ${{ github.token }}
- CONFIG: ${{ env.CONFIG }}

## Templates Used:
- .github/templates/performance_metrics_report_template.md
- .github/templates/issue_auto_generated_template.md

## Notes:
- This workflow provides automated disaster recovery steps
- It attempts basic recovery before considering rollback
- The process is designed to minimize downtime and data loss
- Detailed logging and issue creation ensure proper incident documentation
- Manual intervention is triggered for complex issues that automated recovery can't resolve

================================================================================

# Code Review Workflow (code-review.yml)

## Trigger:
- On pull request opened, synchronized, or reopened
- On pull request review submitted

## Steps:

1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Input: None
   - Output: 
     - repository_context: JSON object containing repository details
     - pr_details: JSON object with pull request details
   - Rule: Set up the necessary context for the workflow

2. Assign Reviewers
   - Use: ./.github/actions/assign-reviewers
   - Input: 
     - pr_changes: ${{ github.event.pull_request.changed_files }}
     - codeowners_file: .github/CODEOWNERS
   - Output: 
     - assigned_reviewers: List of assigned reviewers
   - Rule: Automatically assign reviewers based on modified files and code ownership

3. Run Code Quality Checks
   - Use: ./.github/actions/run-code-quality
   - Input: 
     - pr_changes: ${{ github.event.pull_request.changed_files }}
     - quality_config: ${{ env.CONFIG.code_quality }}
   - Output: 
     - quality_report: Detailed code quality report
   - Rule: Run linters, static code analysis, and style checks

4. Post Code Quality Results
   - Use: ./.github/actions/post-pr-comment
   - Input: 
     - pr_number: ${{ github.event.pull_request.number }}
     - comment_body: ${{ steps.run-code-quality.outputs.quality_report }}
   - Output:
     - comment_url: URL of the posted comment
   - Rule: Post code quality results as a comment on the PR

5. Check Review Guidelines
   - Use: ./.github/actions/check-review-guidelines
   - Input: 
     - pr_description: ${{ github.event.pull_request.body }}
     - review_comments: ${{ github.event.pull_request.review_comments }}
     - guideline_config: ${{ env.CONFIG.review_guidelines }}
   - Output:
     - guidelines_met: Boolean indicating if guidelines are met
   - Rule: Ensure PR description follows template and review comments meet minimum length requirement

6. Enforce Review Approval
   - Use: ./.github/actions/enforce-review-approval
   - Input: 
     - pr_reviews: ${{ github.event.pull_request.reviews }}
     - required_approvals: ${{ env.CONFIG.required_approvals }}
   - Output:
     - approval_status: Boolean indicating if required approvals are met
   - Rule: Block PR merge if required approvals are not met

7. Update PR Status
   - Use: ./.github/actions/update-pr-status
   - Input: 
   - Input: Review status, code quality results
   - Update PR status (approved, changes requested, pending)

8. Notify Reviewers
   - Use: ./.github/actions/send-notification
   - Notify assigned reviewers of pending review
   - Send reminders for reviews not completed within SLA

## Error Handling:
- If reviewer assignment fails, add 'needs-reviewer' label
- If code quality checks fail, add 'failed-quality-check' label

## Configuration:
- Use config.json for:
  - code_review.required_approvals
  - code_review.review_reminder_sla
  - code_quality.linters
  - code_quality.style_checks

## Templates Used:
- .github/templates/performance_metrics_report_template.md
- .github/templates/issue_auto_generated_template.md

## Notes:
- This workflow automates the code review process
- It integrates code quality checks into the review workflow
- Review guidelines are enforced to maintain consistency
- Automatic reviewer assignment reduces manual effort
- Notifications keep the review process moving efficiently

================================================================================

# Dependency Management Workflow (dependency-management.yml)

## Trigger:
- Scheduled: Weekly on Monday at 00:00 UTC
- On push to main branch (for immediate checks)
- Manual trigger (workflow_dispatch)

## Steps:

1. Setup Context
   - Use: ./.github/actions/setup-context-and-prerequisites
   - Output: Repository context, dependency information

2. Check for Updates
   - Use: ./.github/actions/check-dependency-updates
   - Input: Package manager type (npm, yarn, etc.) from repository.config.json
   - Check for available updates to dependencies
   - Generate update report

3. Run Security Vulnerability Scan
   - Use: ./.github/actions/security-vulnerability-scan
   - Input: Current dependencies
   - Scan for known security vulnerabilities
   - Generate vulnerability report

4. Create Update PRs
   - Use: ./.github/actions/create-dependency-update-prs
   - Input: Update report, vulnerability report
   - Create separate PRs for:
     - Major version updates
     - Minor/patch updates
     - Security-related updates (high priority)
   - Apply labels: 'dependency-update', 'security-update' (if applicable)

5. Run Tests on Update PRs
   - Use: ./.github/actions/run-tests
   - Input: PR changes
   - Run full test suite to ensure updates don't break existing functionality

6. Update PR Descriptions
   - Use: ./.github/actions/update-pr-description
   - Input: Test results, update details
   - Add test results and update details to PR descriptions

7. Auto-merge Minor/Patch Updates
   - Use: ./.github/actions/auto-merge-updates
   - Input: PR details, repository settings
   - Auto-merge minor/patch updates if tests pass and no conflicts

8. Notify Team
   - Use: ./.github/actions/send-notification
   - Notify team of created update PRs, especially for major updates and security patches

## Error Handling:
- If update check fails, retry once before failing
- If PR creation fails, create an issue with the update details

## Configuration:
- Use ${{ env.REPOSITORY_CONFIG }} for:
  - dependency_management.package_manager
  - dependency_management.auto_merge_policy
- Use ${{ env.PLUGINS_CONFIG }} for:
  - security_scan.threshold_level

## Templates Used:
- .github/templates/performance_metrics_report_template.md
- .github/templates/issue_auto_generated_template.md

## Notes:
- This workflow automates the process of keeping dependencies up-to-date
- It separates updates by type (major, minor/patch, security) for easier management
- Automatic merging of minor/patch updates reduces manual work
- Regular security scans help maintain project security
- The workflow can be triggered manually for immediate checks when needed

================================================================================