# Neon project config (Terraform)

Manages the `PJS` Neon project (`muddy-wave-76386845`) together with its default `production` branch, compute, `neondb_owner` role and `neondb` database.

Per-branch policy (for example, the 7-day TTL on preview branches) stays in `neon.ts` at the repo root. Terraform does not touch it.

## Usage

From the repo root:

```bash
export NEON_API_KEY=...   # Neon Console > Account settings > API keys
bun tf:neon init
bun tf:neon plan
bun tf:neon apply
```

`bun tf:neon <args>` runs `terraform -chdir=infra/neon <args>`, so any Terraform subcommand works.

The first `plan` imports the existing project (`imports.tf`). It should end with no changes to the project. If it wants to replace the project, stop: that deletes the database.

For local development use `neon env pull` (see the root README). As a fallback, Terraform can print the pooled connection string the backend uses:

```bash
bun tf:neon output -raw database_url
```

## What it pins

- Region `aws-us-east-2`, Postgres 18, org `org-rough-cake-25119073`
- 6 hours of history retention (free plan maximum)
- Default compute: 0.25 to 2 CU autoscaling
- Maintenance window: Saturday 07:00 to 08:00 UTC
- `prevent_destroy`, so `terraform destroy` and replacements fail instead of wiping the data

## Provider

[`kislerdm/neon`](https://registry.terraform.io/providers/kislerdm/neon/latest/docs) is community-maintained, not by Neon. The version is pinned to `~> 0.18.0` and locked in `.terraform.lock.hcl`.
Run `init -upgrade` only by hand, after reading the provider changelog, and check the `plan` before applying: schema changes between versions can force a project replacement.

## State

State is local (`terraform.tfstate`, gitignored). Whoever runs `apply` keeps it.
Change these settings here, not in the Neon Console, or the next `plan` will revert them.
