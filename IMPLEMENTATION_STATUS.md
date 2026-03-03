# TASK-001: QA Chat Interactive Mode — Implementation Status

**Date:** 2026-03-03 11:35 AM  
**Branch:** feature/task-001-qa-interactive  
**Status:** ✅ Tasks 1-3 COMPLETE | Ready for Firestore setup + deployment

---

## ✅ Completed Tasks (1-3)

### Task 1: Firestore Collections Setup
**Status:** ✅ COMPLETE

**Deliverables:**
- [x] `firebase/firestore.rules` — Security rules (apply manually in Firebase Console)
- [x] `scripts/setup-firestore.js` — Automated collections creation script
- [x] Documentation of required setup steps

**Next Steps (Manual):**
1. Run: `node scripts/setup-firestore.js` (requires GOOGLE_APPLICATION_CREDENTIALS env var)
2. Apply security rules via Firebase Console:
   - Go to: Firebase Console → ai-lms-pro → Firestore → Rules
   - Copy-paste from: `firebase/firestore.rules`
   - Click "Publish"

**Verification:**
- ✅ Collections will be created: dario-queue, error-logs
- ✅ qa_chat collection verified to exist
- ✅ Test documents auto-cleanup after verification

---

### Task 2: Cloud Function — onQAChatMessage Trigger
**Status:** ✅ COMPLETE

**Deliverables:**
- [x] `firebase/functions/src/qa-chat-trigger.js` — Cloud Function logic
- [x] `firebase/functions/src/index.js` — Function export/initialization
- [x] Syntax verification passed

**What It Does:**
1. Triggers on new documents in qa_chat collection
2. Filters out messages from "dario" (to prevent loops)
3. Captures full context: testerId, testerName, feature, message, reproductionSteps, attachments
4. Pushes to dario-queue collection with status: "pending"
5. Logs errors to error-logs collection

**Next Steps (Manual):**
1. Navigate to Cloud Functions directory: `cd firebase/functions`
2. Install dependencies: `npm install`
3. Deploy: `firebase deploy --only functions:onQAChatMessage`
4. Verify in Firebase Console: Functions → onQAChatMessage should show "ACTIVE"

**Testing:**
- Write a test message to qa_chat collection
- Check dario-queue → should contain new document with status: "pending"

---

### Task 3: Dario Firestore Listener — Realtime Processing
**Status:** ✅ COMPLETE

**Deliverables:**
- [x] `scripts/qa-chat-listener.js` — Realtime listener + message processor
- [x] Syntax verification passed
- [x] Optional Telegram integration (when TELEGRAM_BOT_TOKEN env var is set)

**What It Does:**
1. Listens to dario-queue collection for status: "pending"
2. Processes each message with QA Testing Protocol heuristics:
   - If no reproduction steps → asks tester for them
   - If message too short → asks for more detail
   - Otherwise → provides analysis + follow-up questions
3. Writes response directly to qa_chat collection
4. Marks message as processed in dario-queue
5. Logs any errors to error-logs collection

**Next Steps (Manual):**
1. Set environment variable: `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/firebase-service-account.json`
2. Run: `node scripts/qa-chat-listener.js`
3. Process will start listening to dario-queue in realtime
4. Output: `[QA Chat Listener] Running. Press Ctrl+C to stop.`

**Optional - Telegram Alerts:**
```bash
export TELEGRAM_BOT_TOKEN=<your-bot-token>
export TELEGRAM_CHAT_ID=<your-chat-id>
node scripts/qa-chat-listener.js
```

---

## Remaining Tasks (4-7)

### Task 4: Dario Heartbeat Cron Job (every 5 min)
**Status:** 🔄 TODO
**Estimated:** 1 hour

### Task 5: Heartbeat Monitor Cron (every 10 min, alert on offline)
**Status:** 🔄 TODO
**Estimated:** 1 hour

### Task 6: Integration Test (end-to-end test flow)
**Status:** 🔄 TODO
**Estimated:** 1.5 hours

### Task 7: Documentation & Deployment Guide
**Status:** 🔄 TODO
**Estimated:** 1 hour

---

## How to Proceed

### Option A: Continue with Tasks 4-7 (Recommended)
- Continue in this branch/worktree
- Build heartbeat monitoring + testing
- Then merge to main when complete

### Option B: Deploy Tasks 1-3 Now
- Merge this branch to main
- Run setup.firestore.js
- Apply security rules
- Deploy Cloud Function
- Start Dario listener
- Then continue with Tasks 4-7 on separate branch

### Option C: Code Review First
- Request code review before proceeding
- Eyal reviews Tasks 1-3 implementation
- Feedback incorporated, then continue

---

## Files Changed (Summary)

**New Files:**
- firebase/functions/src/qa-chat-trigger.js (2KB)
- firebase/functions/src/index.js (251B)
- firebase/firestore.rules (1KB)
- scripts/qa-chat-listener.js (6KB)
- scripts/setup-firestore.js (3.5KB)

**Commits:**
1. feat: add Cloud Function onQAChatMessage + Dario listener (Tasks 1-3)
2. feat: add Firestore setup script and security rules (Task 1 complete)

---

## Testing Status

✅ Syntax checks pass for:
- qa-chat-trigger.js
- index.js
- qa-chat-listener.js

⏳ Pending (Tasks 4-7):
- Integration test (full flow)
- Deployment verification
- Heartbeat monitoring tests

---

## Notes

- No dependencies on external APIs yet (Telegram optional)
- All code follows QA Testing Protocol specifications
- Error logging structured for Firestore querying
- Setup scripts designed for minimal manual intervention
