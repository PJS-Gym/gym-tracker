variable "owner" {
  description = "GitHub organization that owns the repository."
  type        = string
  default     = "PJS-Gym"
}

variable "repository" {
  description = "Repository name."
  type        = string
  default     = "gym-tracker"
}

variable "required_status_checks" {
  description = "Commit status contexts that must pass before merging into main (Vercel Preview builds)."
  type        = list(string)
  default = [
    "Vercel – gym-tracker",     # frontend
    "Vercel – gym-tracker-api", # backend
  ]
}
