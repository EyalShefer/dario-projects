---
summary: "Workspace template for TOOLS.md"
read_when:
  - Bootstrapping a workspace manually
---

# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Project Viewer Dashboard

**Purpose:** View all deliverables (landing pages, documents, strategies) in one place

**Access:** http://localhost:8080

**How It Works:**
- Server runs on port 8080 (auto-started)
- All projects stored in `/public/projects/`
- Dashboard auto-discovers new projects
- Click → View/Download deliverables

**To Restart Server (if needed):**
```bash
cd /data/.openclaw/workspace/public
python3 -m http.server 8080
```

Then open: http://localhost:8080

---

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.