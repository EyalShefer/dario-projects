# Bug Fix Governance Protocol

**Date:** 2026-03-01  
**Status:** Approved by Eyal  
**Applies to:** Wizdi AI Studio (Tasks 1-4, all QA feedback)

---

## Overview

This protocol defines how bugs reported by QA testers will be analyzed, fixed, tested, and deployed. It prevents scope creep, cascading failures, and unauthorized structural changes.

---

## Priority Hierarchy

When multiple bugs exist, fix in this order:

1. **Critical Crashes** — App crashes, unrecoverable errors, data corruption
2. **Data Loss** — Lost user data, corrupted state, failed saves
3. **UX Issues** — Labels, timeouts, usability problems

---

## Scope Rules (Strict)

**ALLOWED:**
- ✅ Fix reported bugs
- ✅ Investigate and fix root causes (may span multiple files/services)
- ✅ Fix related issues in the same feature area
- ✅ Update existing code to correct behavior

**NOT ALLOWED:**
- ❌ Add new features (even if tester suggests)
- ❌ Change home page or internal page structures/layouts
- ❌ Refactor services unrelated to bug root cause
- ❌ Change data models unless necessary to fix the bug

New features and structural changes require **explicit approval from Eyal** before proceeding.

---

## Risk Analysis Protocol

**If a fix could impact unrelated code:**

1. **Identify the impact:**
   - What service/utility changes
   - What other features depend on it
   - Probability and severity if broken

2. **Send full analysis to Telegram** before implementing:
   - Problem statement
   - Proposed fix
   - Impact analysis
   - Mitigation/testing approach

3. **Wait for explicit approval** from Eyal

4. **Only then** implement and test

---

## Testing Before Merge

All fixes must pass these checks before pushing to GitHub:

1. **Manual Testing** — Confirm original bug is fixed
2. **Regression Testing** — Manually verify related features still work correctly
3. **Unit Tests** — Write or update tests for the fix (if test suite exists)
4. **Tester Verification** — QA tester reproduces fix and confirms it works

Only after tester approval: `git push origin master:main`

---

## Communication Pattern

**To QA Tester (Firestore / Telegram):**

```
1. Bug reported → Acknowledge receipt
   "Received: [bug description]. Investigating..."

2. Starting fix → Update status
   "Working on [bug]. Expected: [time]"

3. Fix ready → Request verification
   "Fix ready for testing. Please verify:
    [steps to reproduce]
    Expected result: [description]"

4. Tester confirms → Deploy
   "Confirmed working. Pushing to production."
```

---

## Implementation Checklist

- [ ] Bug identified and priority assigned
- [ ] Scope verified (within allowed rules)
- [ ] Risk analysis done
- [ ] If risky: approval from Eyal obtained
- [ ] Code fix implemented
- [ ] Manual testing passed
- [ ] Regression testing passed
- [ ] Unit tests written/updated
- [ ] QA tester verification obtained
- [ ] GitHub push completed

---

## Exception Handling

**If a fix violates scope rules:**
- Stop immediately
- Flag to Eyal in Telegram
- Propose alternative approach or get explicit permission

**If risk analysis shows high danger:**
- Present options to Eyal
- Propose workaround or architectural change
- Get approval before proceeding

---

## Rationale

This protocol exists to:
- Prevent cascading failures from unrelated side effects
- Keep fixes focused and minimal
- Maintain code quality and test coverage
- Give Eyal control over scope and risk
- Ensure QA testers verify fixes before deployment
