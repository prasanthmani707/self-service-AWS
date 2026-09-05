# Fieldline

Fieldline is a monolithic Next.js App Router platform for self-service Splunk environments on AWS.

## Setup

1. Copy `.env.example` to `.env.local` and set the platform AMI and optional Ansible values.
2. Run `npm install` from Command Prompt.
3. Run `npm run dev` and open `http://localhost:3000`.

AWS operations are server-only. Users provide an IAM role ARN; the server uses STS AssumeRole for temporary credentials. Permanent secret access keys are never requested, stored, logged, or exposed to the browser.

## Lifecycle

`POST /api/deployments/create` validates input, creates a deployment ID, reads `config/data.ts`, and returns a plan. The provisioning layer applies `ManagedBy`, `DeploymentId`, `Environment`, `Role`, and `Name` tags to every EC2 instance. It does not run Ansible.

`POST /api/configure` requires explicit automatic-configuration confirmation and is the only path that queues Ansible. Manual configuration remains a separate action.

## Production notes

The initial implementation uses AWS as the infrastructure source of truth and does not require a database. Add authenticated session storage and a durable background job runner before exposing provisioning in production. Keep temporary role credentials server-side or in a secrets manager, never in `NEXT_PUBLIC_*` variables.

## Verification

`npm run build`
