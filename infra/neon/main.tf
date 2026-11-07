# The project also owns its default branch, compute, role and database
# (`production`, `neondb_owner`, `neondb`), so they are configured here
# instead of as separate neon_branch / neon_endpoint / neon_role / neon_database
# resources. Per-branch policy (e.g. preview branch TTL) lives in neon.ts.
resource "neon_project" "this" {
  name       = "PJS"
  org_id     = var.org_id
  region_id  = "aws-us-east-2"
  pg_version = 18

  # Free plan maximum (6 hours).
  history_retention_seconds = 21600

  branch {
    name          = "production"
    database_name = "neondb"
    role_name     = "neondb_owner"
  }

  # Pinned so a provider upgrade can't change them through new defaults.
  store_password           = "yes"
  default_branch_protected = false

  # Default compute for every branch.
  autoscaling_limit_min_cu = 0.25
  autoscaling_limit_max_cu = 2
  suspend_timeout_seconds  = 0 # 0 = Neon's default idle timeout before scale-to-zero

  # Saturday 07:00 to 08:00 UTC.
  maintenance_window {
    weekdays   = [6]
    start_time = "07:00"
    end_time   = "08:00"
  }

  # Changing region, Postgres version or org recreates the project and wipes the data.
  lifecycle {
    prevent_destroy = true
  }
}
