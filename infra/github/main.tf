resource "github_repository" "this" {
  name        = var.repository
  description = "Projekt zaliczeniowy WFAiS UJ - Pracownia języków skryptowych"
  visibility  = "public"

  has_issues   = true
  has_projects = true
  has_wiki     = true

  # Squash and Merge is the only allowed merge method.
  allow_merge_commit          = false
  allow_rebase_merge          = false
  allow_squash_merge          = true
  squash_merge_commit_title   = "PR_TITLE"
  squash_merge_commit_message = "COMMIT_MESSAGES"

  # "Update branch" button on PRs (both merge and rebase variants).
  allow_update_branch = true

  delete_branch_on_merge = true

  # Never delete the real repo by accident.
  archive_on_destroy = true

  lifecycle {
    prevent_destroy = true
  }
}

resource "github_repository_ruleset" "main" {
  name        = "Main config"
  repository  = github_repository.this.name
  target      = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = ["refs/heads/main"]
      exclude = []
    }
  }

  rules {
    deletion         = true
    non_fast_forward = true

    # Changes reach main only through pull requests.
    pull_request {
      required_approving_review_count = 0
      allowed_merge_methods           = ["squash"]
    }

    # Vercel Preview builds must succeed before merge.
    required_status_checks {
      strict_required_status_checks_policy = false

      dynamic "required_check" {
        for_each = var.required_status_checks
        content {
          context = required_check.value
        }
      }
    }
  }
}
