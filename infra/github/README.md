# GitHub repository config (Terraform)

Manages `PJS-Gym/gym-tracker` settings and the `main` branch ruleset.

## Usage

```bash
cd infra/github
export GITHUB_TOKEN=$(gh auth token)   # needs repo admin rights
terraform init
terraform plan
terraform apply
```

## What it enforces

- No direct pushes to `main`: changes go through pull requests only
- Squash and Merge is the only merge method
- Head branches are deleted after merge
- "Update branch" is enabled (merge and rebase variants)
- Merge is blocked until Vercel Preview builds pass: `Vercel – gym-tracker` (frontend) and `Vercel – gym-tracker-api` (backend)

## State

State is local (`terraform.tfstate`, gitignored). Whoever runs `apply` keeps it.
Change settings here, not in GitHub Settings, or the next `plan` will revert them.
