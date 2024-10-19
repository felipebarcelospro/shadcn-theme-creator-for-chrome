# GitFlow for Shadcn/UI Theme Creator Chrome Extension

This document outlines the GitFlow process for developing and maintaining the Shadcn/UI Theme Creator Chrome Extension, incorporating our custom automation tools and CI/CD pipeline.

## Branches

- `main`: The production-ready state of the extension
- `develop`: The main development branch
- `feature/*`: For developing new features
- `release/*`: For preparing new production releases
- `hotfix/*`: For critical bug fixes on the production version
- `ci/*`: For CI/CD pipeline updates
- `chore/*`: For maintenance tasks and dependency updates

## Workflow

### Feature Development

1. Make changes to your local files.

2. Our custom pre-push hook (defined in `lefthook.yml`) will automatically:
   - Generate an AI-powered branch name using the Groq API based on your changes
   - Create a new branch with the appropriate prefix (e.g., `feature/chrome-extension/`, `feature/web/`, `ci/`, `feature/packages/`, `chore/dependencies/`, `chore/root/`)
   - Commit your changes
   - Push to the remote repository

3. The GitHub Actions workflow (`main.yml`) will be triggered, which will:
   - Check for project changes and run security checks
   - Build and test your changes based on the affected areas (web, extension, packages)
   - Create a pull request to `develop` with AI-generated title, description, and commits using the Groq API
   - Link related issues to the pull request and comment on them

### Preparing a Release

1. Create a release branch from `develop`:
   ```
   git checkout develop
   git pull origin develop
   git checkout -b release/x.y.0
   ```

2. The `main.yml` workflow will automatically:
   - Build the web application and Chrome extension
   - Update version numbers (minor version bump for releases)
   - Generate release notes using the Groq API
   - Create a GitHub release with the changelog
   - Deploy the web application to GitHub Pages
   - Publish the Chrome extension to the Chrome Web Store

3. After approval, merge the release branch into `main` and `develop`.

### Hotfixes

1. Create a hotfix branch from `main`:
   ```
   git checkout main
   git checkout -b hotfix/x.y.z
   ```

2. Fix the bug and commit changes.

3. The `main.yml` workflow will automatically handle version bumping (patch version for hotfixes), release creation, and deployment.

4. Merge the hotfix into both `main` and `develop`.

## CI/CD Pipeline (`main.yml`)

Our GitHub Actions workflow automates the following processes:

1. Checks for project changes and runs security checks using Snyk
2. Builds the web application, Chrome extension, and packages
3. Deploys the web application to GitHub Pages
4. Packages the Chrome extension as a zip file
5. Publishes the extension to the Chrome Web Store (for `release/*` and `hotfix/*` branches)
6. Creates GitHub releases with AI-generated changelogs using the Groq API
7. Handles automatic version bumping based on branch type
8. Creates and updates pull requests with AI-generated content
9. Generates and deploys documentation

## Custom Push Script (`custom-push.js`)

This script, triggered by `lefthook.yml`, enhances our GitFlow process by:

1. Generating AI-powered branch names based on changed files using the Groq API
2. Automatically creating branches with appropriate prefixes based on the affected areas of the project
3. Preparing payload data for the GitHub Actions workflow

## Package Scripts (`package.json`)

Our `package.json` includes scripts for:

- Building and developing the project using Turbo
- Linting and formatting code
- Running tests
- Creating releases
- Packaging and publishing the Chrome extension

## Contributing

Please refer to the [Contributing section in README.md](https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome#-contributing) for guidelines on how to contribute to this project.

## Release Notes

Release notes are automatically generated using AI (Groq API) based on commit messages and changes. Ensure your commit messages are clear and descriptive to improve the quality of the generated changelogs.