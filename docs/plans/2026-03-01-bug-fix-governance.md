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
1. Bug reported → Acknowledge + Ask Questions
   "תודה על הדיווח. כמה שאלות להבהרה:
    - בדיוק מה עשית כשזה קרה?
    - מה היה צריך להיות?"
   
   (Wait for answer)
   
   "בהבנתי [restate problem]. זה נכון?"
   
   (Confirm understanding)

2. Understanding confirmed → Start investigating
   "ברור. עכשיו אתקן את זה."

3. Starting fix → Update status
   "עובד על התיקון. צפוי: [time]"

4. Fix ready → Request verification
   "התיקון מוכן. בדוק בבקשה:
    שלבים: [steps]
    צפוי: [expected result]"

5. Tester confirms → Deploy
   "אישור קיבלתי. דוחף לפרודוקשין."
```

**Language:** Use Hebrew (תלויה בעדיפות הבודק)

---

## Tester Communication Protocol (CRITICAL)

**When receiving a bug report from testers:**

1. **Read the report carefully**
   - What is the symptom?
   - When does it happen?
   - What should happen instead?

2. **Ask clarifying questions (iteratively)**
   - If unclear: "Can you describe exactly what you did?"
   - If ambiguous: "Is the problem in X or Y?"
   - If missing steps: "What did you do before this happened?"
   - Ask ONE question at a time
   - Wait for answer before next question

3. **Confirm understanding**
   - Restate the problem in your own words
   - "So the issue is: [your understanding]. Is that correct?"
   - Get tester confirmation

4. **Confirm expected behavior**
   - "What should happen instead?"
   - Get specific description of expected result
   - "When we fix this, it should [your description]. Yes?"

5. **Only when CERTAIN:**
   - Proceed to fix
   - You know exact problem
   - You know exact expected behavior
   - Zero ambiguity

**Why:** Prevents fixing wrong thing, wasting time, breaking other features.

---

## Implementation Checklist

- [ ] **Bug report received**
- [ ] **Questions asked & answered** (iterative until clear)
- [ ] **Understanding confirmed** (with tester)
- [ ] **Expected behavior confirmed** (with tester)
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

## Required Bug Report Information

**Every bug report must clarify (via iterative questioning):**

1. **What is the symptom?**
   - "The button doesn't work"
   - More specific: "When I click upload, it shows [error message]"

2. **When does it happen?**
   - "Always"
   - "Only with large files"
   - "Only on slow internet"
   - "Only after [steps]"

3. **What should happen instead?**
   - Current: "Button is disabled"
   - Expected: "Button should be enabled and clickable"

4. **How to reproduce?**
   - Exact steps: "1. Open page, 2. Click button, 3. [error shows]"
   - Environment: "Chrome on Windows" / "Safari on iPhone" / etc.

5. **Is it blocking work?**
   - "Can't continue without fixing this"
   - "Minor annoyance, can work around it"

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

**If bug report is unclear:**
- Ask more questions (iterate until clear)
- Do NOT guess or assume
- Get tester confirmation before fixing

---

## Rationale

This protocol exists to:
- Prevent cascading failures from unrelated side effects
- Keep fixes focused and minimal
- Maintain code quality and test coverage
- Give Eyal control over scope and risk
- Ensure QA testers verify fixes before deployment
