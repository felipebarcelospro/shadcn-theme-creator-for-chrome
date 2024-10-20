# Template TODO List

This document outlines the templates needed for various workflows and actions in our repository.

## Naming Convention
Format: `<workflow>_<action>_<purpose>.md`

## Templates

1. pull-request_create_template.md
   - Used in: Branch Management Workflow
   - Scope: Pull Request Creation
   - Content:
     - Title placeholder
     - Description structure
     - Checklist for PR requirements
     - Links to relevant documentation
     - Space for additional context

2. code-review_guidelines_checklist.md
   - Used in: Code Review Workflow
   - Scope: Code Review Process
   - Content:
     - Code style and best practices checklist
     - Security considerations
     - Performance review points
     - Accessibility checks
     - Testing requirements

3. code-quality_report_summary.md
   - Used in: CI/CD Workflow, Code Review Workflow
   - Scope: Code Quality Reporting
   - Content:
     - Summary of linting results
     - Code coverage statistics
     - Complexity metrics
     - Performance indicators
     - Security scan results

4. dependency_update_pr_description.md
   - Used in: Dependency Management Workflow
   - Scope: Dependency Update Pull Requests
   - Content:
     - List of updated dependencies
     - Version changes (current vs. new)
     - Changelog summaries
     - Potential breaking changes
     - Security implications

5. security_vulnerability_report_template.md
   - Used in: Security Checks, Dependency Management Workflow
   - Scope: Security Vulnerability Reporting
   - Content:
     - Vulnerability description
     - Severity rating
     - Affected components
     - Recommended actions
     - Links to relevant CVEs

6. deployment_summary_report.md
   - Used in: CI/CD Workflow
   - Scope: Deployment Reporting
   - Content:
     - Deployment status
     - Affected components
     - Version information
     - Rollback instructions
     - Performance metrics post-deployment

7. test_results_summary_report.md
   - Used in: CI/CD Workflow, Dependency Management Workflow
   - Scope: Test Result Reporting
   - Content:
     - Overall pass/fail status
     - Test coverage percentage
     - Failed test details
     - Performance test results
     - Links to full test logs

8. release_notes_changelog.md
   - Used in: CI/CD Workflow
   - Scope: Release Documentation
   - Content:
     - Version number
     - Release date
     - New features
     - Bug fixes
     - Breaking changes
     - Upgrade instructions

9. incident_report_template.md
   - Used in: Disaster Recovery Workflow
   - Scope: Incident Documentation
   - Content:
     - Incident summary
     - Timeline of events
     - Root cause analysis
     - Resolution steps
     - Preventive measures

10. code-review_checklist_template.md
    - Used in: Code Review Workflow
    - Scope: Code Review Process
    - Content:
      - Functionality checks
      - Code readability and maintainability
      - Error handling and edge cases
      - Documentation requirements
      - Testing coverage

11. performance_metrics_report_template.md
    - Used in: CI/CD Workflow, Post-Deployment Tests
    - Scope: Performance Reporting
    - Content:
      - Load time metrics
      - Resource usage statistics
      - API response times
      - Database query performance
      - Comparison with previous deployment

12. documentation_update_changelog.md
    - Used in: CI/CD Workflow
    - Scope: Documentation Maintenance
    - Content:
      - API changes
      - New feature documentation
      - Updated configuration options
      - Deprecated features
      - Links to full documentation

13. notification_deployment_status.md
    - Used in: CI/CD Workflow
    - Scope: Deployment Notifications
    - Content:
      - Deployment status (success/failure)
      - Environment information
      - Key changes in this deployment
      - Links to logs and dashboards
      - Next steps or actions required

14. issue_auto_generated_template.md
    - Used in: Error Handling across workflows
    - Scope: Automated Issue Creation
    - Content:
      - Issue title structure
      - Problem description
      - Steps to reproduce
      - Expected vs. actual behavior
      - Relevant logs or error messages

15. branch_naming_convention_guide.md
    - Used in: Branch Management Workflow
    - Scope: Branch Creation and Validation
    - Content:
      - Accepted branch name prefixes
      - Naming structure rules
      - Examples of valid branch names
      - Common pitfalls to avoid
      - Link to full branching strategy document

## Notes
- All templates should be in Markdown format for consistency and easy rendering on GitHub.
- Templates should be reviewed and updated regularly to ensure they remain relevant and effective.
- Consider using variables (e.g., `${VERSION_NUMBER}`) in templates where dynamic content will be inserted by actions.
- Ensure all templates are accessible and follow any company-specific style guides or branding requirements.