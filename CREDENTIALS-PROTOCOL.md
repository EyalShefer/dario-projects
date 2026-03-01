# Credentials Protocol — Never Forget Again

## The Rule
**EVERY heartbeat, EVERY session, EVERY git operation:**
1. **READ** `/data/.openclaw/workspace/CREDENTIALS.md` (first thing)
2. **EXTRACT** token/credentials
3. **USE** in operation
4. **NEVER** rely on memory or assumptions

---

## Flow Diagram

```
START HEARTBEAT/SESSION
    ↓
READ CREDENTIALS.md
    ↓
TOKEN FOUND? → YES → USE IN GIT/API OPERATION
    ↓ NO
CHECK IF OPERATION NEEDS CREDENTIALS
    ↓ YES
FAIL WITH ERROR (Tell Eyal to update CREDENTIALS.md)
    ↓ NO
PROCEED WITHOUT CREDENTIALS
```

---

## Implementation Checklist

Every heartbeat function should:

```javascript
// Start of heartbeat
async function heartbeat() {
  // Step 1: Read credentials
  const creds = readFile('/data/.openclaw/workspace/CREDENTIALS.md');
  const token = extractToken(creds);
  
  // Step 2: Check for git operations
  if (needsGitPush) {
    if (!token) throw new Error('CREDENTIALS.md missing GitHub token');
    configureGitAuth(token);
  }
  
  // Step 3: Proceed with operations
  // ... rest of heartbeat
}
```

---

## Credentials Currently Stored

| Credential | File | Status | Last Updated |
|------------|------|--------|--------------|
| GitHub PAT | CREDENTIALS.md | ✅ Active | 2026-02-27 |
| SSH Key (public) | CREDENTIALS.md | Reference only | 2026-02-27 |

---

## If Token Expires

1. Eyal updates CREDENTIALS.md with new token
2. Next heartbeat reads new token automatically
3. No code changes needed

---

## If Operation Fails

1. Dario logs: "Failed: CREDENTIALS.md missing TOKEN"
2. Tells Eyal: "Please update CREDENTIALS.md"
3. Fails gracefully (doesn't try fallbacks)

**This is not a bug — this is working as designed.**
