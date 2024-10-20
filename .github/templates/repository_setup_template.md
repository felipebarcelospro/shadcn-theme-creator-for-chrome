# Repository Setup Guide

Welcome to the repository setup guide. This document outlines the initial configuration and structure of our project. Please follow these guidelines to ensure consistency and efficiency in our development process.

## Table of Contents
1. [Git Flow Branches](#git-flow-branches)
2. [Branch Protection Rules](#branch-protection-rules)
3. [Wiki Pages](#wiki-pages)
4. [Discussion Categories](#discussion-categories)
5. [Issue Labels](#issue-labels)
6. [Project Board](#project-board)
7. [Repository Settings](#repository-settings)
8. [Dependabot Configuration](#dependabot-configuration)
9. [CODEOWNERS](#codeowners)

## Git Flow Branches
Our repository follows the Git Flow branching model. The main branches are:
{{ fromJson(steps.setup-context.outputs.config-data).version_control.main_branches | join(', ') }}

## Branch Protection Rules
We have set up branch protection rules for the following branches:
{{ fromJson(steps.setup-context.outputs.config-data).version_control.protected_branches | join(', ') }}

The protection rules include:
{{ fromJson(steps.setup-context.outputs.config-data).version_control.branch_protection_rules | to_json }}

## Wiki Pages
We have created a Wiki page for "Git Flow Process" to document our version control workflow.

## Discussion Categories
Our primary discussion category is:
{{ fromJson(steps.setup-context.outputs.config-data).community.discussion_categories[0] }}

## Issue Labels
We have set up the following issue labels:
{{ fromJson(steps.setup-context.outputs.config-data).issue_management.labels | to_json }}

## Project Board
Our project board has the following columns:
{{ fromJson(steps.setup-context.outputs.config-data).project_management.board_columns | join(', ') }}

## Repository Settings
- Wiki: {{ fromJson(steps.setup-context.outputs.config-data).repository.features.wiki }}
- Issues: {{ fromJson(steps.setup-context.outputs.config-data).repository.features.issues }}
- Projects: {{ fromJson(steps.setup-context.outputs.config-data).repository.features.projects }}

Merge strategies:
- Squash merge: {{ fromJson(steps.setup-context.outputs.config-data).repository.merge_strategies.allow_squash_merge }}
- Merge commit: {{ fromJson(steps.setup-context.outputs.config-data).repository.merge_strategies.allow_merge_commit }}
- Rebase merge: {{ fromJson(steps.setup-context.outputs.config-data).repository.merge_strategies.allow_rebase_merge }}

Branch management:
- Delete head branches on merge: {{ fromJson(steps.setup-context.outputs.config-data).repository.branch_management.delete_head_branches }}

## Dependabot Configuration
Ecosystems monitored:
{{ fromJson(steps.setup-context.outputs.config-data).security.dependency_ecosystems | join(', ') }}

Configuration:
{{ fromJson(steps.setup-context.outputs.config-data).security.dependabot_config | to_json }}

## CODEOWNERS
Repository admins:
{{ fromJson(steps.setup-context.outputs.config-data).repository.admins | join(', ') }}

Please refer to the CODEOWNERS file for specific file ownership details.

This setup provides a solid foundation for our project. As we progress, we may update these configurations to better suit our evolving needs.
