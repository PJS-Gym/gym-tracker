terraform {
  required_version = ">= 1.6"

  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.6"
    }
  }
}

# Token comes from GITHUB_TOKEN (e.g. `export GITHUB_TOKEN=$(gh auth token)`).
provider "github" {
  owner = var.owner
}
