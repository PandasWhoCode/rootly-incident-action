# Contributing to Rootly Incident Action

Thank you for your interest in contributing to the Rootly Incident Action! This
document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct.
Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm (comes with Node.js)
- Git

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rootly-incident-action.git
   cd rootly-incident-action
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Making Changes

1. **Write your code** following our coding standards
2. **Add tests** for new functionality
3. **Run the test suite** to ensure everything passes:
   ```bash
   npm run all
   ```
4. **Update documentation** if needed

### Testing

We maintain 100% test coverage. Please ensure your changes include appropriate
tests:

- **Unit tests**: Located in `__tests__/` directory
- **Test fixtures**: Located in `__fixtures__/` directory
- **Run tests**: `npm test`
- **Check coverage**: `npm run test:coverage`

### Code Quality

We use several tools to maintain code quality:

- **ESLint**: `npm run lint` - Linting and code style
- **Prettier**: `npm run format` - Code formatting
- **TypeScript**: `npm run type-check` - Type checking
- **Jest**: `npm test` - Unit testing

Run all checks with: `npm run all`

### Building

The action is built using `@vercel/ncc` to create a single bundled file:

```bash
npm run bundle
```

This creates the `dist/index.js` file that GitHub Actions uses.

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**: `npm run all`
2. **Update documentation** if your changes affect usage
3. **Add entries to CHANGELOG.md** if applicable
4. **Rebase your branch** on the latest main branch

### Submitting Your PR

1. **Push your branch** to your fork
2. **Create a Pull Request** from your fork to the main repository
3. **Fill out the PR template** completely
4. **Link any related issues** using keywords like "Fixes #123"

### PR Requirements

- [ ] All CI checks pass
- [ ] Code coverage remains at 100%
- [ ] No ESLint errors or warnings
- [ ] Documentation updated if needed
- [ ] Tests added for new functionality
- [ ] Commit messages follow conventional format

## Coding Standards

### TypeScript

- Use strict TypeScript settings
- Avoid `any` types - use proper typing
- Export types and interfaces when needed
- Use meaningful variable and function names

### Testing

- Follow the existing test patterns in `__tests__/`
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies appropriately
- Use Jest's built-in matchers when possible

### Git Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(alert): add support for custom alert templates
fix(incident): handle empty service arrays correctly
docs(readme): update usage examples
test(main): add tests for error handling
```

## Project Structure

```
├── src/                 # Source TypeScript files
│   ├── main.ts         # Main action entry point
│   ├── alert.ts        # Alert creation logic
│   ├── incident.ts     # Incident creation logic
│   └── ...             # Other modules
├── __tests__/          # Jest unit tests
├── __fixtures__/       # Test fixtures and mocks
├── dist/               # Compiled JavaScript (auto-generated)
├── action.yml          # GitHub Action metadata
└── package.json        # Node.js dependencies
```

## API Guidelines

### Rootly API Integration

- Always handle API errors gracefully
- Use proper error logging with `console.error`
- Return empty strings on failures (following existing pattern)
- Implement proper URL encoding for query parameters
- Use consistent request headers and authentication

### Input Validation

- Validate all inputs in the main entry point
- Handle empty or undefined inputs appropriately
- Split comma-separated values correctly
- Provide meaningful error messages

## Documentation

### Code Documentation

- Use JSDoc comments for functions and classes
- Document complex logic with inline comments
- Keep comments up-to-date with code changes

### README Updates

When making changes that affect usage:

- Update code examples
- Add new input/output parameters
- Update feature descriptions
- Keep the changelog current

## Getting Help

- **Issues**: Check existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Refer to the README.md for usage examples

## Release Process

Releases are managed by maintainers:

1. Version bumping follows semantic versioning
2. Releases are tagged and published automatically
3. The `dist/` directory is updated with each release
4. Major version tags (v1, v2) are maintained for stability

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- Special mentions for major features or fixes

Thank you for contributing to make this action better for everyone! 🚀
