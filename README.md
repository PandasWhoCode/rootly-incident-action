# Rootly Incident Action

[![GitHub Super-Linter](https://github.com/pandaswhocode/rootly-incident-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/pandaswhocode/rootly-incident-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/pandaswhocode/rootly-incident-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/pandaswhocode/rootly-incident-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/pandaswhocode/rootly-incident-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/pandaswhocode/rootly-incident-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

A GitHub Action for creating comprehensive incidents in Rootly using the full
Rootly REST API. This action integrates seamlessly with your CI/CD workflows to
automatically create detailed incidents with complete metadata when issues are
detected.

## Features

- **Comprehensive Incident Creation**: Create detailed incidents using the
  complete Rootly REST API
- **Full Metadata Support**: Configure services, teams, environments,
  functionalities, causes, and incident types
- **Advanced Incident Options**: Support for incident kinds, parent/child
  relationships, and duplicate marking
- **Integration Ready**: Built-in support for Slack channels, Google Drive, and
  email notifications
- **Flexible Labeling**: Custom key-value labels for enhanced incident
  categorization
- **Robust Error Handling**: Comprehensive error handling with detailed logging
- **100% Test Coverage**: Complete test suite with perfect coverage across all
  metrics
- **TypeScript Excellence**: Built with TypeScript for type safety and
  reliability

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

This GitHub Action creates comprehensive incidents in Rootly using the complete
Rootly REST API. The action supports all incident creation parameters available
in the Rootly platform, enabling you to create detailed incidents with full
metadata integration.

**Required parameters:**

- `api_key` - Rootly API authentication token
- `title` - The incident title
- `severity` - The incident severity level

**Key optional parameters:**

- `kind` - Incident type (test, test_sub, example, example_sub, normal,
  normal_sub, backfilled, scheduled, etc.)
- `URL` - The URL to the incident
- `summary` - Detailed incident description
- `services` - Comma-separated service names
- `teams` - Comma-separated team names
- `environments` - Comma-separated environment names
- `functionalities` - Comma-separated functionality names
- `causes` - Comma-separated cause names
- `incident_types` - Comma-separated incident type names
- `labels` - Key-value pairs for custom labeling
- `user_email` - Email of the user to attach to the incident
- `alert_ids` - Existing alert IDs to link to the incident
- `slack_channel_name/id/url` - Slack integration parameters
- `google_drive_parent_id` - Google Drive integration
- `google_drive_url` - Google Drive integration URL
- `notify_emails` - Email addresses to notify
- `parent_incident_id` - For creating child incidents
- `duplicate_incident_id` - For marking incidents as duplicates
- `create_public_incident` - Whether to create a public incident (defaults to
  false)

**Output:**

- `incident-id` - ID of the created incident for API usage

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
        default: 'Sev0'
        type: choice
        options:
          - Sev0
          - Sev1
          - Sev2
          - Sev3
          - Sev4

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
          summary:
            'Critical service experiencing downtime in production environment'
          severity: ${{ inputs.severity }}
          kind: 'normal'
          services: 'web-api,database'
          teams: 'engineering,sre'
          environments: 'production'
          functionalities: 'user-authentication,data-processing'
          incident_types: 'service-outage'
          causes: 'infrastructure-failure'
          labels: 'priority:high,impact:customer-facing'
          user_email: 'incident-commander@company.com'
          slack_channel_name: 'incidents'
          notify_emails: 'oncall@company.com,management@company.com'
          create_public_incident: 'false'
          url: 'https://rootly.com/incidents'
          api_key: ${{ secrets.ROOTLY_API_KEY }}

      - name: Output Incident Details
        run: |
          echo "Incident ID: ${{ steps.rootly-incident.outputs.incident-id }}"
```

### Advanced Usage with Full Metadata

```yaml
jobs:
  create-comprehensive-incident:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

      - name: Create Comprehensive Rootly Incident
        id: rootly-incident
        uses: pandaswhocode/rootly-incident-action@v1
        with:
          title: 'Database Performance Degradation'
          summary:
            'Database queries are experiencing significant latency increases
            affecting user experience'
          severity: 'Sev2'
          kind: 'normal'
          services: 'database,api-gateway,user-service'
          teams: 'database-team,sre,platform'
          environments: 'production,staging'
          functionalities: 'data-access,user-queries,reporting'
          incident_types: 'performance-issue'
          causes: 'resource-exhaustion,configuration-drift'
          labels: 'component:database,impact:performance,priority:high'
          user_email: 'dba-oncall@company.com'
          slack_channel_name: 'database-incidents'
          slack_channel_id: 'C1234567890'
          google_drive_parent_id: 'folder-id-for-incidents'
          notify_emails: 'dba-team@company.com,sre-oncall@company.com'
          create_public_incident: 'true'
          url: 'https://rootly.com/incidents'
          api_key: ${{ secrets.ROOTLY_API_KEY }}

      - name: Output Incident Details
        run: |
          echo "Incident ID: ${{ steps.rootly-incident.outputs.incident-id }}"
```

### Conditional Incident Creation

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
            'Automated test suite failed on ${{ github.ref_name }} branch -
            immediate investigation required'
          severity: 'Sev2'
          kind: 'normal'
          services: 'ci-cd,build-system'
          teams: 'engineering,qa'
          environments: 'staging'
          functionalities: 'automated-testing,continuous-integration'
          incident_types: 'build-failure'
          causes: 'code-change,test-environment'
          labels:
            'source:github-actions,branch:${{ github.ref_name }},run:${{
            github.run_id }}'
          user_email: 'ci-cd@company.com'
          slack_channel_name: 'build-failures'
          notify_emails: 'engineering-oncall@company.com'
          create_public_incident: 'false'
          url: 'https://rootly.com/incidents'
          api_key: ${{ secrets.ROOTLY_API_KEY }}
```

### Integration with External Monitoring

```yaml
name: External Monitor Integration
on:
  repository_dispatch:
    types: [monitoring-alert]

jobs:
  handle-monitoring-alert:
    runs-on: ubuntu-latest
    steps:
      - name: Create Rootly Incident from External Monitor
        uses: pandaswhocode/rootly-incident-action@v1
        with:
          title: ${{ github.event.client_payload.title }}
          summary: ${{ github.event.client_payload.description }}
          severity: ${{ github.event.client_payload.severity }}
          kind: ${{ github.event.client_payload.kind || 'normal' }}
          services: ${{ github.event.client_payload.services }}
          teams: ${{ github.event.client_payload.teams }}
          environments: ${{ github.event.client_payload.environments }}
          functionalities: ${{ github.event.client_payload.functionalities }}
          incident_types: ${{ github.event.client_payload.incident_types }}
          causes: ${{ github.event.client_payload.causes }}
          labels: ${{ github.event.client_payload.labels }}
          user_email: ${{ github.event.client_payload.user_email }}
          alert_ids: ${{ github.event.client_payload.alert_ids }}
          slack_channel_name: ${{ github.event.client_payload.slack_channel }}
          notify_emails: ${{ github.event.client_payload.notify_emails }}
          create_public_incident:
            ${{ github.event.client_payload.create_public_incident || 'false' }}
          url: ${{ github.event.client_payload.url }}
          api_key: ${{ secrets.ROOTLY_API_KEY }}
```

## Configuration

### Input Parameters

| Parameter                | Required | Default               | Description                                                    |
| ------------------------ | -------- | --------------------- | -------------------------------------------------------------- |
| `api_key`                | x        | -                     | Rootly API authentication token                                |
| `title`                  | x        | `My Incident Title`   | The title of the incident                                      |
| `severity`               | x        | -                     | The severity of the incident                                   |
| `url`                    |          | -                     | The URL of the incident                                        |
| `kind`                   |          | `normal`              | The kind of incident (test, example, normal, backfilled, etc.) |
| `parent_incident_id`     |          | -                     | The ID of the parent incident, if any                          |
| `duplicate_incident_id`  |          | -                     | The ID of the incident to mark as duplicate, if any            |
| `create_public_incident` |          | `false`               | Set to true to create a public incident                        |
| `summary`                |          | `My Incident Summary` | The summary of the incident                                    |
| `user_email`             |          | -                     | The email of the user to attach to the incident                |
| `alert_ids`              |          | -                     | Comma-separated list of alert IDs to link to the incident      |
| `environments`           |          | -                     | Comma-separated names of environments                          |
| `incident_types`         |          | -                     | Comma-separated names of incident types                        |
| `services`               |          | -                     | Comma-separated names of services                              |
| `functionalities`        |          | -                     | Comma-separated names of functionalities                       |
| `teams`                  |          | -                     | Comma-separated names of teams                                 |
| `causes`                 |          | -                     | Comma-separated names of causes                                |
| `labels`                 |          | -                     | Comma-separated list of key:value pairs                        |
| `slack_channel_name`     |          | -                     | The name of the Slack channel to post updates to               |
| `slack_channel_id`       |          | -                     | The ID of the Slack channel to post updates to                 |
| `slack_channel_url`      |          | -                     | The URL of the Slack channel to post updates to                |
| `google_drive_parent_id` |          | -                     | The Google Drive parent ID to create the incident document in  |
| `google_drive_url`       |          | -                     | The URL of the Google Drive document for the incident          |
| `notify_emails`          |          | -                     | Comma-separated list of email addresses to notify              |

### Output Parameters

| Parameter     | Description                                  |
| ------------- | -------------------------------------------- |
| `incident-id` | The ID of the created incident for API usage |

## API Integration

This action integrates comprehensively with the Rootly REST API to:

- **Resolve service IDs** from service names
- **Resolve team IDs** from team names
- **Resolve environment IDs** from environment names
- **Resolve severity IDs** from severity levels
- **Resolve incident type IDs** from incident type names
- **Resolve functionality IDs** from functionality names
- **Resolve cause IDs** from cause names
- **Resolve user IDs** from user email addresses
- **Process custom labels** from key:value pair strings
- **Create comprehensive incidents** with all resolved metadata
- **Link existing alerts** to incidents via alert IDs
- **Configure integrations** for Slack channels and Google Drive
- **Set up notifications** for specified email addresses

The action uses the complete Rootly incident creation API endpoint
(`POST /v1/incidents`) with full support for all available incident attributes
including advanced features like parent/child relationships, duplicate marking,
and public/private visibility.

All API calls include comprehensive error handling with detailed logging for
debugging purposes.

## Development

### Project Structure

```text
├── src/                 # Source TypeScript files
│   ├── main.ts         # Main action entry point
│   ├── incident.ts     # Comprehensive incident creation logic
│   ├── service.ts      # Service ID resolution
│   ├── team.ts         # Team ID resolution
│   ├── environment.ts  # Environment ID resolution
│   ├── severity.ts     # Severity ID resolution
│   ├── incidentType.ts # Incident type ID resolution
│   ├── functionality.ts # Functionality ID resolution
│   ├── cause.ts        # Cause ID resolution
│   ├── user.ts         # User ID resolution
│   ├── label.ts        # Label parsing utilities
│   ├── arrayOps.ts     # Array operation utilities
│   └── apiResponse.ts  # API response type definitions
├── __tests__/          # Comprehensive Jest unit tests (100% coverage)
├── __fixtures__/       # Test fixtures and API mocks
├── dist/               # Compiled JavaScript bundle (auto-generated)
├── action.yml          # GitHub Action metadata with full input definitions
└── package.json        # Node.js dependencies and scripts
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

The project maintains **100% test coverage** across all metrics with
comprehensive unit tests covering:

- **Complete API Integration**: All service, team, environment, severity,
  incident type, functionality, cause, and user resolution functions
- **Incident Creation**: Full incident creation workflow with all parameter
  combinations
- **Error Scenarios**: HTTP errors, network failures, JSON parsing errors, and
  API response validation
- **Input Validation**: Edge cases, empty inputs, malformed data, and boundary
  conditions
- **Main Workflow**: Complete orchestration from input parsing to incident
  creation
- **Utility Functions**: Array operations, label parsing, and data
  transformation
- **Mock Isolation**: Proper Jest ESM module mocking with isolated test
  environments
- **Branch Coverage**: All conditional paths and error handling branches

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
