# Dashboard Update Protocol

⚠️ **CRITICAL:** Dashboard MUST always be updated in production (GitHub main) automatically. No exceptions.

See: `/data/.openclaw/workspace/DASHBOARD-PROTOCOL.md`

---

**Workflow:**
1. Edit JSON files in `projects/`
2. `git add projects/`
3. `git commit -m "..."`
4. `git push origin master:main` ← **MANDATORY**
5. Verify: `curl https://raw.githubusercontent.com/EyalShefer/dario-projects/main/projects/index.json`

**PRODUCTION IS SOURCE OF TRUTH**
