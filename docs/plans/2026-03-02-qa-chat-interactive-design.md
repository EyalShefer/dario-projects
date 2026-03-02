# QA Chat Interactive Mode — Design Document

**Date:** 2026-03-02  
**Status:** Approved  
**Owner:** Eyal  
**Related Task:** TASK-001 (QA Chat Monitor — Interactive Mode)

---

## Overview

Transform QA Chat from **one-way notifications** (tester → Dario → Telegram) to **real-time conversation** (tester ↔ Dario directly in website chat).

**Goal:** Instant debugging interaction without delays or context switching to Telegram.

---

## Architecture

### Data Flow

```
Tester writes in website chat
        ↓
Firestore: qa_chat collection (write triggered)
        ↓
Cloud Function: on qa_chat write
        ↓
Capture full context → push to dario-queue
        ↓
Dario realtime listener (Firestore) 
        ↓
Receive event → analyze context
        ↓
Dario decides: ask clarifying questions OR respond with insights
        ↓
Dario writes directly to qa_chat collection
        ↓
Tester sees response instantly in website chat
```

### Parallel: Health Monitoring

```
Dario cron: Every 5 minutes
  → Send heartbeat to Telegram dario_bot
  
Dario monitor cron: Check heartbeat
  → If missing for 10+ min → Telegram alert: "⚠️ Dario offline"
```

---

## Components

### 1. Cloud Function (Firestore Trigger)

**Name:** `onQAChatMessage`

**Trigger:** When document is created in `qa_chat` collection

**Behavior:**
- Read new message from qa_chat
- Capture full context:
  - Message text
  - Tester ID / name
  - Feature being tested
  - Reproduction steps (if provided)
  - Attachments/screenshots
  - Timestamp
  - qa_chatId (to link response back)
- Write to `dario-queue` collection with status: "pending"

**Error handling:**
- If write to dario-queue fails → log to Firestore error collection + retry

### 2. Dario Realtime Listener

**Location:** Dario OpenClaw process (existing)

**New component:** Firestore realtime listener on `dario-queue` collection

**Behavior:**
- Listen for new documents in dario-queue (status: "pending")
- When event fires:
  - Load message + full context
  - Analyze using QA Testing Protocol:
    1. Check if enough info to debug
    2. If not → ask clarifying questions
    3. If yes → provide targeted insights/analysis
  - Write response to qa_chat collection
  - Update dario-queue document: status: "processed"

**Integration:** Runs within existing Dario process (no new service)

### 3. Dario Firestore Write Permissions

**Requirement:** Dario service account must have write access to `qa_chat` collection

**Why:** Dario writes responses directly (no middleman)

**Security:** Firestore security rules ensure:
- Only "dario" user can write as author: "dario"
- Only can write to qa_chat collection
- Writes are immutable (no editing/deleting)

### 4. Dario Heartbeat Cron

**Frequency:** Every 5 minutes

**Action:** Send heartbeat message to Telegram dario_bot chat

**Format:**
```
✅ Dario online [timestamp]
```

**Purpose:** Monitor process health

### 5. Heartbeat Monitor Cron

**Frequency:** Every 10 minutes

**Logic:**
- Check last heartbeat timestamp in Telegram dario_bot chat
- If last heartbeat > 10 minutes ago:
  - Send alert: "⚠️ Dario offline. Process may have crashed. Check logs."
- If recent: Silent (all good)

**Purpose:** Alert you if Dario stops responding

---

## Data Structures

### dario-queue Collection

Document created by Cloud Function when tester writes.

```json
{
  "id": "msg-12345",
  "qa_chatId": "chat-xyz",
  "testerId": "tester-001",
  "testerName": "Sarah",
  "feature": "Image Upload",
  "message": "Upload fails with large PNG files",
  "reproductionSteps": [
    "Click upload button",
    "Select 50MB PNG file",
    "See timeout error"
  ],
  "attachments": [
    "https://storage.firebase.com/screenshot-001.png"
  ],
  "timestamp": "2026-03-02T22:45:00Z",
  "status": "pending",
  "createdBy": "cloud-function"
}
```

After Dario processes:
```json
{
  ...same fields...
  "status": "processed",
  "processedAt": "2026-03-02T22:45:15Z",
  "processedBy": "dario"
}
```

### qa_chat Collection (Dario Response)

Document created by Dario when responding.

```json
{
  "id": "msg-12346",
  "qa_chatId": "chat-xyz",
  "author": "dario",
  "message": "What's the exact error message you see? Is it a timeout or memory error?",
  "timestamp": "2026-03-02T22:45:15Z",
  "responseToMessage": "msg-12345",
  "type": "question"
}
```

Or (if providing analysis):
```json
{
  "id": "msg-12347",
  "qa_chatId": "chat-xyz",
  "author": "dario",
  "message": "I see the issue. File size validation is missing. We should check file size before upload starts.",
  "timestamp": "2026-03-02T22:45:30Z",
  "responseToMessage": "msg-12345",
  "type": "analysis",
  "suggestedFix": "Add 50MB max file size check in uploadHandler()"
}
```

---

## QA Testing Protocol

When Dario receives a message, follow this protocol:

1. **Read full context** — analyze message + tester name + feature + reproduction steps + attachments

2. **Ask clarifying questions** (if insufficient info):
   - One question at a time
   - Specific, not vague
   - Write to qa_chat: "Can you tell me [specific info needed]?"
   - Wait for tester response (Dario listener catches reply → processes)

3. **Provide analysis** (if enough info):
   - Identify root cause
   - Suggest next steps
   - If it's a code issue → link to relevant code
   - If it's a test setup issue → explain

4. **Confirm understanding** (before suggesting fixes):
   - "So the issue is: [your understanding]. Correct?"
   - Wait for tester confirmation
   - Only then provide fix

5. **Use Hebrew** when responding (testers understand Hebrew)

---

## Resilience & Error Handling

### If Dario Crashes
- Messages stay queued in dario-queue
- When Dario restarts → listener reconnects
- Processes all pending messages from dario-queue
- No messages lost

### If Write to qa_chat Fails
- Log error to Firestore: error-logs collection
- Dario retries (exponential backoff)
- Alert you via Telegram if persistent failure

### If Heartbeat Missing
- Monitor cron detects > 10 min without heartbeat
- Sends alert: "⚠️ Dario offline"
- You can check OpenClaw logs / restart process

### If Cloud Function Fails
- Firestore trigger logs the error
- You're notified via Firebase console
- Dario doesn't receive the message

---

## Success Criteria

- ✅ Tester writes in website chat → Dario receives within 1 second
- ✅ Dario responds → appears in chat within 2 seconds
- ✅ Conversation flows in real-time (no 2-minute poll delay)
- ✅ Full context captured (tester name, feature, steps, attachments)
- ✅ Dario follows QA Testing Protocol (asks clarifying Qs before fixing)
- ✅ Heartbeat monitoring alerts on crashes
- ✅ No messages lost if Dario restarts

---

## Dependencies

- Firestore realtime listeners (already available)
- Cloud Functions (already available in Firebase)
- Firestore security rules update (to allow Dario writes)
- Dario service account credentials (already have)
- Telegram bot token (already have)

---

## Timeline

- Design: ✅ Approved (2026-03-02)
- Implementation: ~8-10 hours (Cloud Function + Dario listeners + heartbeat cron + testing)
- Deployment: Dependent on Eyal's approval of implementation plan

---

## Notes

- **Why not webhook?** Firestore approach is simpler, more secure (no HTTP exposure)
- **Why realtime listeners?** Instant responses, not polling every 2 minutes
- **Why heartbeat?** Early warning if Dario crashes before testers notice
- **Why full context in dario-queue?** Ensures Dario has everything needed without re-querying Firestore
