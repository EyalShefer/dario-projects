# Dario Memory System

## Overview
3-layer memory architecture enabling Dario to retain context, automate monitoring, and operate autonomously.

### Layer 1: PARA (Structure)
- **Projects:** Active projects with defined outcomes (e.g., Wizdi AI Studio)
- **Areas:** Ongoing responsibilities (e.g., Integrations, Security)
- **Resources:** Reference materials, templates, skills
- **Archive:** Completed projects for historical reference

### Layer 2: Daily Notes (Raw Input)
- Location: `/data/.openclaw/workspace/memory/YYYY-MM-DD.md`
- Content: What happened, meetings, tasks, blockers, learnings
- Created automatically via `scripts/create-daily-note.sh`

### Layer 3: MEMORY.md (Curated Long-Term)
- Location: `/data/.openclaw/workspace/MEMORY.md`
- Content: Facts, preferences, patterns, security rules, relationships
- Updated nightly via cron sync at 2:00 AM (Israel time)

## Workflows

### Daily
1. Morning: Daily note auto-created
2. Throughout day: Log work, decisions, learnings
3. Evening: Review and capture insights

### Nightly (2:00 AM Israel)
1. Cron triggers nightly-memory-sync.sh
2. Reviews recent daily notes
3. Extracts patterns and learnings
4. Updates MEMORY.md

### Heartbeat (every 30 min)
- Rotates through: email, calendar, project status
- Tracks state in heartbeat-state.json
- Avoids duplicate checks

## File Structure
```
/data/.openclaw/workspace/
├── MEMORY.md                    # Long-term curated memory
├── HEARTBEAT.md                 # Heartbeat checklist
├── projects/                    # PARA: Active projects
├── areas/                       # PARA: Ongoing areas
├── resources/                   # PARA: Reference materials
│   └── templates/
│       └── daily-note.md        # Daily note template
├── archive/                     # PARA: Completed work
├── memory/                      # Daily notes
│   ├── YYYY-MM-DD.md
│   └── heartbeat-state.json
├── scripts/
│   ├── create-daily-note.sh     # Daily note generator
│   └── nightly-memory-sync.sh   # Nightly sync script
├── docs/
│   └── MEMORY-SYSTEM.md         # This file
└── logs/
    └── nightly-sync.log
```

## Based On
Felix Case Study — autonomous AI business model using OpenClaw with 3-layer memory, Telegram command channel, and nightly cron sync.
