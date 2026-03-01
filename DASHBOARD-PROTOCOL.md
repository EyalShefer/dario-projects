# Dashboard Protocol — MANDATORY

⚠️ **CRITICAL RULE:** Every dashboard update MUST be in production immediately. Never update local-only.

---

## Workflow (Non-Negotiable)

**EVERY TIME dashboard data changes:**

1. **Edit JSON files** in `/data/.openclaw/workspace/captain-count/projects/`
   - `index.json` (master index)
   - `{project-id}/project.json` (project data)
   - `{project-id}/task-*-logs.json` (task logs)

2. **Commit to Git:**
   ```bash
   cd /data/.openclaw/workspace/captain-count
   git add projects/
   git commit -m "update: [what changed]"
   ```

3. **PUSH TO GITHUB IMMEDIATELY:**
   ```bash
   git push origin master:main
   ```
   ⚠️ **DO NOT SKIP THIS STEP**

4. **Verify live (required, not optional):**
   ```bash
   curl https://raw.githubusercontent.com/EyalShefer/dario-projects/main/projects/index.json
   # Check that changes appear
   ```

5. **Copy to local server** (for local testing):
   ```bash
   cp -r /data/.openclaw/workspace/captain-count/projects/* /data/.openclaw/workspace/public/projects/
   ```

---

## When to Update Dashboard

Dashboard MUST be updated when:

- ✅ Task status changes (pending → in_progress → completed)
- ✅ Task progress percentage changes
- ✅ Subtask status changes
- ✅ New logs added
- ✅ Timestamps updated
- ✅ Assigned_to changes
- ✅ Any project metadata changes

---

## Golden Rule

**PRODUCTION IS SOURCE OF TRUTH**

- Local server is for testing
- GitHub main branch is what matters
- Eyal checks: https://EyalShefer.github.io/dario-projects/

If it's not in GitHub main, **it doesn't exist**.

---

## If You Forget

This protocol is:
- Read by HEARTBEAT.md (automatic reminder)
- Read by CREDENTIALS-PROTOCOL.md (every session)
- Hardcoded in MEMORY.md (visible on startup)

**No excuses. No exceptions.**
