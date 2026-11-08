output "database_url" {
  description = "Pooled connection string for the production branch (what the backend uses as DATABASE_URL)."
  value       = neon_project.this.connection_uri_pooler
  sensitive   = true
}
