# Code Review Checklist

## Functionality
- [ ] The code works as described in the requirements
- [ ] The code handles edge cases and error scenarios
- [ ] All new features are tested
- [ ] The code is free of runtime errors and warnings

## Code Quality
- [ ] The code follows the project's style guide
- [ ] Variable and function names are clear and descriptive
- [ ] There's no redundant or duplicate code
- [ ] The code is as modular as possible
- [ ] Complex algorithms are well-commented and explained
- [ ] There are no hardcoded values; constants are used where appropriate

## Security
- [ ] All user inputs are validated and sanitized
- [ ] Sensitive data (e.g., passwords, keys) are not exposed
- [ ] Proper authentication and authorization checks are in place
- [ ] SQL queries are parameterized to prevent injection attacks
- [ ] The code is free from common security vulnerabilities (e.g., XSS, CSRF)

## Performance
- [ ] The code is optimized for performance where necessary
- [ ] Expensive operations are not in loops
- [ ] Appropriate data structures are used
- [ ] Database queries are optimized
- [ ] Large datasets are paginated

## Error Handling and Logging
- [ ] Errors are handled gracefully and logged appropriately
- [ ] Error messages are clear and helpful
- [ ] Logging is implemented for important events and errors

## Testing
- [ ] Unit tests are written and passing
- [ ] Integration tests are written and passing
- [ ] Edge cases are covered in tests
- [ ] Test coverage meets project standards

## Documentation
- [ ] Code changes are reflected in the documentation
- [ ] New functions/classes have appropriate comments
- [ ] Complex parts of the code are well-commented
- [ ] README is updated if necessary
- [ ] API documentation is updated for any changed endpoints

## Compatibility
- [ ] The code works across all required browsers/devices
- [ ] The code is backwards compatible (or breaking changes are documented)

## Accessibility
- [ ] The code follows accessibility best practices
- [ ] ARIA attributes are used where necessary
- [ ] Color contrast ratios meet WCAG standards

## Code Efficiency
- [ ] The code uses appropriate design patterns
- [ ] There's no unnecessary code or commented-out code
- [ ] The code follows DRY (Don't Repeat Yourself) principles

## Version Control
- [ ] Commit messages are clear and follow project conventions
- [ ] The PR is rebased on the latest version of the target branch
- [ ] No unnecessary files are included in the PR

## Specific Project Requirements
- [ ] [Add any project-specific requirements here]
- [ ] [Add any project-specific requirements here]

## Reviewer Notes
[Add any additional notes, questions, or concerns here]
