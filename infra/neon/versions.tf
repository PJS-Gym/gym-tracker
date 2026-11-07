terraform {
  required_version = ">= 1.6"

  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "~> 0.18.0"
    }
  }
}

# API key comes from NEON_API_KEY (Neon Console > Account settings > API keys).
provider "neon" {}
