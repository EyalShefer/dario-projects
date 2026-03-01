# Heartbeat Checklist

**⚠️⚠️⚠️ CRITICAL RULES (Non-Negotiable):**

**READ THESE FIRST (every heartbeat):**
1. **EXTERNAL-ACTIONS-PROTOCOL.md** — NO external actions without explicit Eyal approval (Telegram, email, GitHub push, etc.)
2. **DASHBOARD-PROTOCOL.md** — Dashboard ALWAYS updated to production (GitHub main)
3. **CREDENTIALS.md** — Load GitHub token before any git/API operations
4. **MEMORY.md** — Review recent context (if available in main session)

**Golden Rule:**
- If dashboard changed → MUST push to GitHub main immediately
- NO local-only updates
- Production is source of truth

## Initial Setup (Every Heartbeat)
- [ ] **Read CREDENTIALS.md** — Load GitHub token and any active credentials
- [ ] **Check MEMORY.md** — Review recent context (if available in main session)

---

## Routine Checks (every 2-3 hours)
- [ ] **Emails** — Any urgent unread (Outlook via Maton)?
- [ ] **Calendar** — Events in next 24h?
- [ ] **Project Status** — Any blockers in active tasks?

## Daily Checks (once per day)
- [ ] **Update Daily Notes** — Log progress, decisions, learnings
- [ ] **Review Active Tasks** — Any tasks needing attention?
- [ ] **Git Operations** — Push commits using token from CREDENTIALS.md

## Dashboard Protocol (CRITICAL)
**EVERY dashboard update:**
1. Edit files in `/captain-count/projects/`
2. Push to GitHub: `git push origin master:main`
3. Verify live: https://EyalShefer.github.io/dario-projects/
4. **NEVER** update local only — Production is the source of truth

## Weekly Checks (Sundays)
- [ ] **Review Weekly Progress** — Against project goals
- [ ] **Update MEMORY.md** — Extract lessons from daily notes
- [ ] **Check Integrations** — Maton, Jira, Calendar still working?
- [ ] **Rotate Credentials** — Check if tokens need renewal

---

## Credentials Management
- Store sensitive tokens in `CREDENTIALS.md` (not MEMORY.md)
- Read `CREDENTIALS.md` at start of heartbeat/session before any auth operations
- Never log tokens in commits or messages
- When Eyal updates `CREDENTIALS.md`, read immediately in next heartbeat

---
*Track state in heartbeat-state.json to avoid duplicate checks*
