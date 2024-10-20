# Code Review Guidelines Checklist

## Code Style and Best Practices
- [ ] Code adheres to the project's style guide
- [ ] Naming conventions are followed (variables, functions, classes, etc.)
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Functions are small and focused on a single task
- [ ] Comments are present and meaningful

## Security Considerations
- [ ] Input validation is implemented where necessary
- [ ] Sensitive data is not exposed (e.g., no hardcoded secrets)
- [ ] Proper authentication and authorization checks are in place
- [ ] SQL queries are parameterized to prevent injection attacks
- [ ] CSRF protection is implemented for forms

## Performance Review
- [ ] Efficient algorithms and data structures are used
- [ ] Database queries are optimized
- [ ] Unnecessary computations are avoided
- [ ] Proper caching strategies are implemented where applicable
- [ ] Assets (images, scripts, styles) are optimized

## Accessibility Checks
- [ ] Proper semantic HTML is used
- [ ] ARIA attributes are correctly implemented where necessary
- [ ] Color contrast ratios meet WCAG standards
- [ ] Keyboard navigation is supported
- [ ] Alternative text is provided for images

## Testing Requirements
- [ ] Unit tests are written for new functionality
- [ ] Existing tests are updated to reflect changes
- [ ] Edge cases are covered in tests
- [ ] Integration tests are added/updated if necessary
- [ ] Test coverage meets project standards

## Documentation
- [ ] Code changes are reflected in the documentation
- [ ] README is updated if necessary
- [ ] API documentation is updated for any changed endpoints
- [ ] Inline comments explain complex logic

## Error Handling
- [ ] Proper error handling and logging is implemented
- [ ] User-facing error messages are clear and helpful
- [ ] Edge cases are considered and handled appropriately

## Compatibility
- [ ] Changes are cross-browser compatible
- [ ] Mobile responsiveness is maintained/improved
- [ ] Backwards compatibility is maintained (if applicable)

## Code Efficiency
- [ ] No unnecessary code or commented-out code is present
- [ ] Imports/dependencies are optimized
- [ ] Proper use of language features (e.g., async/await, destructuring)

## Version Control
- [ ] Commit messages are clear and follow project conventions
- [ ] PR is rebased on the latest version of the target branch
- [ ] No merge conflicts are present
