# Rootly Incident Action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

A GitHub Action for creating incidents and alerts in Rootly, a platform for
incident management and response. This action integrates seamlessly with your
CI/CD workflows to automatically create incidents when issues are detected.

## Features

- **Automatic Incident Creation**: Create incidents in Rootly with customizable
  parameters
- **Alert Management**: Optionally create alerts associated with incidents
- **Flexible Configuration**: Support for services, groups, environments, and
  incident types
- **Error Handling**: Robust error handling with proper logging
- **100% Test Coverage**: Comprehensive test suite with full coverage
- **TypeScript**: Built with TypeScript for type safety and reliability

## Initial Setup

### Prerequisites

- Node.js 20.x or later (if developing locally)
- A Rootly account with API access
- Rootly API token stored as a GitHub secret

### Quick Start

1. **Add your Rootly API token** to your repository secrets as `ROOTLY_API_KEY`

1. **Create a workflow file** (e.g., `.github/workflows/incident.yml`)

1. **Configure the action** with your desired parameters

### Development Setup

If you want to contribute or modify this action:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/pandaswhocode/rootly-incident-action.git
   cd rootly-incident-action
   ```

1. **Install dependencies**:

   ```bash
   npm install
   ```

1. **Run the full test suite**:

   ```bash
   npm run all
   ```

This will run formatting, linting, testing, coverage reporting, and bundling.

## About the Rootly Incident Action

This GitHub Action allows you to create incidents and alerts in Rootly, a
platform for incident management and response. The action creates incidents with
the following parameters:

**Required parameters:**

- `title` - The incident title
- `severity` - The incident severity level
- `summary` - Description of the incident (defaults to "My Incident
  Description")
- `api_token` - Rootly API authentication token

**Optional parameters:**

1. `services` - Comma-separated service names
1. `teams` - Comma-separated team names
1. `alert_groups` - Comma-separated alert group names
1. `environments` - Comma-separated environment names
1. `incident_types` - Comma-separated incident type names
1. `create_alert` - Whether to create an associated alert (defaults to true)

**Outputs:**

- `incident-id` - ID of the created incident for API usage
- `alert-id` - ID of the created alert (if created) for API usage

## Usage

### Basic Usage

```yaml
name: Create Rootly Incident
on:
  workflow_dispatch:
    inputs:
      severity:
        description: 'Incident severity'
        required: true
        default: 'high'
        type: choice
        options:
          - low
          - medium
          - high
          - critical

jobs:
  create-incident:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

      - name: Create Rootly Incident
        id: rootly-incident
        uses: pandaswhocode/rootly-incident-action@v1
        with:
          title: 'Production Service Outage'
          summary: 'Critical service experiencing downtime'
          severity: ${{ inputs.severity }}
          services: 'web-api,database'
          teams: 'engineering,sre'
          alert_groups: 'sre,on-call'
          environments: 'production'
          incident_types: 'my-incident-type'
          create_alert: 'true'
          api_token: ${{ secrets.ROOTLY_API_KEY }}

      - name: Output Incident Details
        run: |
          echo "Incident ID: ${{ steps.rootly-incident.outputs.incident-id }}"
          echo "Alert ID: ${{ steps.rootly-incident.outputs.alert-id }}"
```

### Advanced Usage with Conditional Logic

```yaml
name: Monitor and Create Incidents
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run Tests
        id: tests
        run: npm test
        continue-on-error: true

      - name: Create Incident on Test Failure
        if: steps.tests.outcome == 'failure'
        uses: pandaswhocode/rootly-incident-action@v1
        with:
          title: 'Test Suite Failure in ${{ github.repository }}'
          summary:
            'Automated test suite failed on ${{ github.ref_name }} branch'
          severity: 'medium'
          services: 'ci-cd'
          teams: 'engineering'
          alert_groups: 'sre,on-call'
          environments: 'staging'
          incident_types: 'my-incident-type'
          api_token: ${{ secrets.ROOTLY_API_KEY }}
```

### Integration with Monitoring Tools

```yaml
name: External Monitor Alert
on:
  repository_dispatch:
    types: [monitoring-alert]

jobs:
  handle-alert:
    runs-on: ubuntu-latest
    steps:
      - name: Create Rootly Incident from Monitor
        uses: pandaswhocode/rootly-incident-action@v1
        with:
          title: ${{ github.event.client_payload.title }}
          summary: ${{ github.event.client_payload.description }}
          severity: ${{ github.event.client_payload.severity }}
          services: ${{ github.event.client_payload.services }}
          teams: ${{ github.event.client_payload.teams }}
          incident_types: ${{ github.event.client_payload.incident_types }}
          alert_groups: 'sre,on-call'
          create_alert: ${{ github.event.client_payload.create_alert || 'true' }}
          environments: ${{ github.event.client_payload.environment }}
          api_token: ${{ secrets.ROOTLY_API_KEY }}
```

## Configuration

### Input Parameters

| Parameter        | Required | Default                   | Description                                     |
| ---------------- | -------- | ------------------------- | ----------------------------------------------- |
| `api-token`      | x        | -                         | Rootly API authentication token                 |
| `create-alert`   |          | `true`                    | Whether to create an associated alert           |
| `environments`   |          | -                         | Comma-separated list of environment names       |
| `groups`         |          | -                         | Comma-separated list of group names             |
| `incident-types` |          | -                         | Comma-separated list of incident type names     |
| `services`       |          | -                         | Comma-separated list of service names           |
| `severity`       | x        | -                         | Incident severity (low, medium, high, critical) |
| `summary`        | x        | "My Incident Description" | Detailed incident description                   |
| `title`          | x        | -                         | The incident title                              |

### Output Parameters

| Parameter     | Description                                             |
| ------------- | ------------------------------------------------------- |
| `incident-id` | The ID of the created incident                          |
| `alert-id`    | The ID of the created alert (if `create-alert` is true) |

## API Integration

This action integrates with the Rootly REST API to:

- **Resolve service IDs** from service names
- **Resolve group IDs** from group names
- **Resolve environment IDs** from environment names
- **Resolve severity IDs** from severity levels
- **Resolve incident type IDs** from incident type names (if provided)
- **Create alerts** with the resolved parameters
- **Create incidents** linking to the created alert

All API calls include proper error handling and will return empty strings on
failure while logging errors for debugging.

## Development

### Project Structure

```text
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

### Available Scripts

- `npm run all` - Run the complete pipeline (format, lint, test, coverage,
  bundle)
- `npm test` - Run Jest unit tests
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier formatting
- `npm run bundle` - Build the action bundle
- `npm run coverage` - Generate coverage reports

### Testing

The project maintains **100% test coverage** with comprehensive unit tests
covering:

- All API integration functions
- Success and error scenarios
- Input validation and edge cases
- Main workflow orchestration
- Mock isolation and Jest ESM compatibility

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for
detailed guidelines on:

- Development setup and workflow
- Code quality standards
- Testing requirements
- Pull request process
- Coding standards and conventions

## Security

- **API tokens** are handled securely and never logged
- **Input validation** prevents injection attacks
- **Error handling** avoids exposing sensitive information
- **Dependencies** are regularly updated and scanned

## License

This project is licensed under the Apache-2.0 License - see the
[LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check this readme and [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Issues**: Report bugs via
  [GitHub Issues](https://github.com/pandaswhocode/rootly-incident-action/issues)
- **Discussions**: Ask questions in
  [GitHub Discussions](https://github.com/pandaswhocode/rootly-incident-action/discussions)

## Changelog

The release notes will be automatically generated when a new version is
released.
