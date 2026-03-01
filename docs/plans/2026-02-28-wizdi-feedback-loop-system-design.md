# Wizdi AI Studio: Feedback Loop System Design

**Date:** 2026-02-28  
**Project:** Wizdi AI Studio (ai-lms-system)  
**Scope:** Chat-driven agent-powered feedback & fix system  
**Status:** APPROVED

---

## Executive Summary

A chat-based feedback system where Adva (and other testers) report issues directly in the app. An architect agent (Dario) reads the feedback, clarifies with the tester, reads the codebase, makes fixes, deploys to staging, and waits for approval. Once approved, the fix goes to production. Eyal is notified only when issues are resolved or when strategic decisions are needed.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ STAGING ENVIRONMENT (Vercel)                                │
│ - Feature branch deployed                                   │
│ - Adva tests here                                           │
└────────────────┬────────────────────────────────────────────┘
                 ↑
        ┌────────┴─────────┐
        │                  │
   ┌────▼─────┐    ┌──────▼──────┐
   │ Chat      │    │ Agent       │
   │ Widget    │◄───┤ (Dario)     │
   │ (in-app)  │    │             │
   └────▲─────┘    └──────┬──────┘
        │                 │
        │         ┌───────▼────────┐
        │         │ GitHub         │
        │         │ - Feature BR   │
        │         │ - Read code    │
        │         │ - Push fixes   │
        │         └────────────────┘
        │
   ┌────┴────────┐
   │ Adva types  │
   │ feedback    │
   │ + tests     │
   └─────────────┘
```

**Data Flow:**
1. Adva writes in chat widget → stored in Firestore
2. Agent monitors chat collection (polling) → reads new messages
3. Agent reads GitHub code → understands structure
4. Agent makes fixes → commits to feature branch
5. CI/CD auto-deploys feature branch to staging
6. Agent notifies Adva: "Ready on staging"
7. Adva tests → replies in chat
8. Loop repeats OR final merge when approved
9. Eyal notified when complete

---

## 2. Chat Widget & Data Storage

### 2.1 Chat Widget (React Component)

**Location:** Embedded in React app (staging + production)

**Features:**
- Input field for feedback
- Message history (all previous messages visible)
- Status indicators: "Awaiting agent reply", "Fix deployed", "Ready to test"
- User identification: Auto-detect from session OR ask name/role on first message
- Optional: Screenshot/attachment upload

**Display Logic:**
- Shows only messages from current session
- Timestamps on each message
- Sender name + role visible
- Agent replies clearly distinguished

### 2.2 Firestore Collection: `feedback_sessions`

```javascript
{
  sessionId: "session-001",
  createdAt: timestamp,
  updatedAt: timestamp,
  status: "in_progress" | "completed" | "approved",
  
  reporter: {
    id: "adva-001",
    name: "Adva Gavai",
    role: "Pedagogical Consultant"
  },
  
  messages: [
    {
      id: "msg-1",
      sender: "adva" | "agent",
      senderName: "Adva Gavai",
      senderRole: "Pedagogical Consultant",
      text: "When I add a lesson, images don't show",
      timestamp: 1740684000,
      processed: false,
      attachments: [] // optional screenshots
    },
    {
      id: "msg-2",
      sender: "agent",
      senderName: "Dario (Agent)",
      senderRole: "AI Assistant",
      text: "Which component? Lesson editor or preview?",
      timestamp: 1740684300,
      processed: true
    }
  ],
  
  linkedIssue: {
    branch: "feature/issue-001",
    commitHash: "abc123def456",
    deployedTo: "staging",
    stagingUrl: "https://ai-lms-system-feature-issue-001.vercel.app",
    testsPassedAt: 1740685800
  },
  
  iteration: 1  // Tracks number of fix attempts
}
```

---

## 3. Agent Logic & Workflow

### 3.1 Agent Runs as Cron Job

**Trigger:** Every 5-10 minutes (or configurable interval)

**Polling Cycle:**
```javascript
1. Query Firestore: feedback_sessions where any message has sender="adva" AND processed=false
2. For each unprocessed message:
   a. Read message text
   b. Analyze: Is it clear enough to act on?
   c. If vague → ask clarifying question (post reply, mark original: processed=true)
   d. If clear → proceed to fix
3. End cron
```

### 3.2 Message Analysis & Clarification

**If feedback is vague:**
- Agent posts clarifying question
- Example: "Which component? Lesson editor or preview pane?"
- Marks original message: `processed: true`
- Waits for Adva's reply in next cycle

**If feedback is clear:**
- Agent marks message: `processed: true`
- Proceeds to code reading + fix

### 3.3 Code Reading & Fix Creation

**Steps:**
1. Clone/pull repo from GitHub (using PAT from CREDENTIALS.md)
2. Parse folder structure based on issue context
   - Example: "Images not showing" → search for image-related components
   - Look in: `src/components/`, `src/services/`, `src/hooks/`
3. Read relevant files
4. Identify the bug/missing feature
5. Make targeted fix (small, surgical changes)
6. Add comments explaining change
7. Run TypeScript check locally (type safety)

### 3.4 Git Operations & Deployment

**Branch naming:** `feature/issue-{sessionId}`

```bash
git checkout -b feature/issue-001
# ... make changes ...
git add [modified files]
git commit -m "Fix: [Brief description from feedback]

Feedback session: session-001
Reporter: Adva Gavai
Issue: [Original feedback text]"
git push origin feature/issue-001
```

**CI/CD Pipeline (Automatic):**
Your existing GitHub Actions runs on feature branch push:
- ✅ TypeScript type check
- ✅ ESLint code quality
- ✅ Jest tests (unit + integration)
- ✅ Build check
- ✅ Husky + lint-staged
- ✅ All checks passed gate

**Staging Deploy (Automatic):**
If all checks pass → Vercel auto-deploys to staging URL:
```
https://ai-lms-system-feature-issue-001.vercel.app
```

### 3.5 Agent Notifies Adva

After successful staging deploy, agent posts in chat:
```
Agent: "Fix deployed to staging ✅

Test here: https://ai-lms-system-feature-issue-001.vercel.app

Let me know if it's fixed or if there's something else"
```

Agent marks linkedIssue:
```javascript
linkedIssue: {
  branch: "feature/issue-001",
  deployedTo: "staging",
  stagingUrl: "https://ai-lms-system-feature-issue-001.vercel.app",
  testsPassedAt: 1740685800,
  awaitingAdvaTestSince: 1740686000
}
```

### 3.6 Waiting for Test Result

**Polling now waits for Adva's reply:**

If Adva writes: "Yes, fixed!" or "Looks good!"
→ Proceed to final approval (Section 3.7)

If Adva writes: "Still broken because..." or "Not quite, because..."
→ New fix cycle begins (back to Section 3.3)
→ iteration counter increments

### 3.7 Final Approval & Production Merge

When Adva approves:

**Agent:**
1. Posts: "Merging to production..."
2. Creates PR (or direct merge, depending on your preference)
3. Merges feature branch → main
4. GitHub Actions runs full pipeline on main
5. Vercel auto-deploys to production
6. Posts final message: "✅ Live on production"
7. Marks session: `status: "completed"`

**Eyal Notification (Telegram):**
```
📋 Feedback Fixed ✅

Reporter: Adva Gavai
Role: Pedagogical Consultant

Issue: Images not displaying in lesson editor

Status: LIVE ON PRODUCTION
Branch: feature/issue-001
Iterations: 1 (fixed on first try)
Duration: 2 hours
Staging URL: [link]
```

---

## 4. Agent Escalation to Eyal

**If agent encounters a fundamental/design decision:**
- Agent posts to Telegram: "@Eyal - Should we approach X this way or that way?"
- Eyal replies in Telegram
- Agent reads reply and continues with guidance

**Examples of escalation scenarios:**
- "This fix requires refactoring [component]. Should we proceed?"
- "The issue seems to be in [core system]. Should we change the approach?"
- "This change affects [feature]. Is that OK?"

---

## 5. Quality Assurance & Regression Prevention

### 5.1 Test Suite Protection

**Your existing CI/CD runs on every feature branch:**
1. TypeScript Type Check → catches type errors
2. ESLint → code quality issues
3. Jest Tests → unit/integration tests
4. Build Check → bundling works
5. Husky + lint-staged → pre-commit checks

**Gate:** All checks must pass before staging deploy.

### 5.2 Code Scope Limiting

**Agent strategy:**
- Modify ONLY files related to the reported issue
- Example: "Images not showing" → only touch image-related components
- Avoid touching unrelated code

### 5.3 Playwright E2E Tests

After deploy to staging, E2E tests run automatically via CI/CD.

**If critical flows break:**
- Agent is notified of failed tests
- Agent posts: "E2E tests failed on staging. Let me fix this..."
- Makes corrections → pushes again

### 5.4 Dependency Analysis

**Before pushing, agent checks:**
- "Does this file have dependent components?"
- If high-risk modification → agent posts to Telegram: "@Eyal - This touches [component] which affects [X]. OK to proceed?"

### 5.5 Adva is the Final Gatekeeper

- She tests the ENTIRE feature, not just the bug
- If fix breaks something else → she reports: "You fixed X but now Y is broken"
- Agent loops back to new fix cycle

---

## 6. Error Handling & Edge Cases

### 6.1 If CI/CD Fails

Agent detects failed checks in GitHub Actions:
- Posts in chat: "Build failed. Let me fix this..."
- Analyzes error logs
- Makes corrections → pushes again
- Retries (max 3 attempts before escalating to Eyal)

### 6.2 If Agent Can't Understand Feedback

After 2-3 clarification questions, issue is still unclear:
- Posts: "I'm stuck on understanding this. Let me ask Eyal..."
- Posts to Telegram: "@Eyal - User described [issue] but I can't pinpoint it. Can you clarify?"
- Waits for Eyal's Telegram reply

### 6.3 Major Architecture Changes

Agent recognizes it needs major refactoring:
- Posts to Telegram: "@Eyal - This fix requires refactoring [component]. Shall we proceed?"
- Waits for approval

### 6.4 Multiple New Issues During Testing

If Adva reports new issue while testing same session:
- Agent creates NEW feedback_session (separate thread)
- Old session marked: `status: "completed"`
- New session begins independently

### 6.5 Session Timeout

- If no messages for 7 days → auto-close: `status: "completed"`
- Reopens if Adva writes again

### 6.6 Agent Crash/Downtime

If agent crashes mid-fix:
- Cron restarts automatically
- Resumes from last checkpoint (processed flag)
- No messages lost

---

## 7. Implementation Roadmap (High-Level)

1. **Chat Widget Component** (React)
   - Input field + message history
   - User identification
   - Firestore integration

2. **Firestore Setup**
   - Create `feedback_sessions` collection
   - Set up security rules
   - Create indices for polling queries

3. **Agent Logic (Node/TypeScript)**
   - Polling service
   - Message processor
   - GitHub API integration
   - Code analyzer
   - Git operations wrapper

4. **Telegram Integration**
   - Eyal notifications
   - Escalation handling
   - Reply parsing

5. **Testing**
   - Unit tests for agent logic
   - E2E test for full flow
   - Staging environment testing with real users

---

## 8. Data & Security

**Firestore Security Rules:**
- Only authenticated users can write to `feedback_sessions`
- Agent service account has read/write access
- Eyal can read all sessions (monitoring)

**GitHub Access:**
- Personal Access Token stored in CREDENTIALS.md (read-protected)
- Agent uses PAT only for repo operations
- Never logs credentials

**Telegram:**
- Eyal's Telegram ID in config
- Bot token in CREDENTIALS.md
- No user data sent to Telegram (only summaries)

---

## 9. Success Criteria

✅ Adva can report issues without knowing code  
✅ Agent understands vague feedback through clarification  
✅ Fixes deploy to staging automatically  
✅ Adva can test and approve before production  
✅ No regressions (full test suite runs)  
✅ Eyal only involved when needed (escalations)  
✅ Complete audit trail of all feedback & fixes  
✅ <2 hour turnaround per issue (typical)

---

## 10. Timeline & Effort

- **Phase 1:** Chat widget (2 days)
- **Phase 2:** Agent core logic (3-4 days)
- **Phase 3:** GitHub integration & testing (2-3 days)
- **Phase 4:** Telegram integration & polish (1-2 days)
- **Total:** ~8-11 days for MVP

---

## Appendix: Key Files & Configuration

**React Component Location:**
- `src/components/FeedbackChat/index.tsx`

**Firestore Collection:**
- `feedback_sessions`

**Agent Service:**
- `/agent/feedback-loop-agent.ts` (runs as cron)

**GitHub Credentials:**
- `CREDENTIALS.md` → `GITHUB_PAT`

**Telegram Config:**
- `.env` → `EYAL_TELEGRAM_ID`, `TELEGRAM_BOT_TOKEN`

---

**Design Approved By:** Eyal Shefer  
**Date Approved:** 2026-02-28  
**Next Step:** Implementation planning via writing-plans skill
