# CREDENTIALS.md — Sensitive Access Keys

⚠️ **SECURITY:** This file contains sensitive tokens. Store locally, never commit to public repos.

---

## GitHub

**Account:** EyalShefer (GitHub auto-corrected from eyalshefer)  
**Email:** eyal.sheffer@gmail.com  
**Repository:** dario-projects (https://github.com/EyalShefer/dario-projects.git)

### Personal Access Token (PAT)
```
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
```

**Scopes:** repo (full control of private repositories)  
**Created:** 2026-02-27  
**Status:** ACTIVE

**Usage:**
```bash
git remote set-url origin https://TOKEN@github.com/eyalshefer/dario-projects.git
git push origin master
```

**Git Remote Configuration:**
```bash
git remote set-url origin https://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@github.com/eyalshefer/dario-projects.git
```

### SSH Key (Optional/Local)

**Public Key (ed25519):**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIXIbX0yVT9ST4Ucdj+sDcwKK0/snAYj6ssuPd4SFyjc eyal.sheffer@gmail.com
```

**Status:** Available on your local machine at `~/.ssh/id_ed25519`

---

## To Update Credentials

Eyal: Update this file with new tokens. Dario will read it on next heartbeat/session before any git operations.

---

## .gitignore

Never commit this file:
```
CREDENTIALS.md
.env
*.local
```
