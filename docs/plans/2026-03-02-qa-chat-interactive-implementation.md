# QA Chat Interactive Mode — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task in a dedicated worktree.

**Goal:** Enable real-time conversation between testers and Dario in website chat (no polling delays, instant responses).

**Architecture:** 
- Cloud Function monitors qa_chat writes → pushes full context to dario-queue
- Dario runs realtime Firestore listener on dario-queue → processes messages
- Dario analyzes context, asks clarifying questions or responds
- Dario writes directly to qa_chat (no intermediaries)
- Parallel heartbeat monitoring (every 5 min) with offline alerts

**Tech Stack:**
- Firebase Cloud Functions (Node.js) - Firestore trigger
- Firestore realtime listeners (admin SDK)
- OpenClaw cron jobs (heartbeat monitoring)
- Telegram API (heartbeats + alerts)

**Related Design Doc:** `/docs/plans/2026-03-02-qa-chat-interactive-design.md`

---

## Task 1: Firestore Collections Setup

**Files:**
- Firestore: ai-lms-pro project
  - Create collection: `dario-queue`
  - Create collection: `error-logs`
  - Update security rules for `qa_chat` (write access for dario user)

**Step 1: Verify Firestore project**

Firebase Console → ai-lms-pro project
- Confirm: Firestore database exists in region `eur3`
- Confirm: `qa_chat` collection exists with tester messages

**Step 2: Create dario-queue collection**

Firebase Console → Firestore Database:
1. Click "Create collection" → Name: `dario-queue`
2. Create first document with structure (for testing):
```json
{
  "id": "test-msg-001",
  "qa_chatId": "test-chat",
  "testerId": "test-tester",
  "testerName": "Test User",
  "feature": "Test Feature",
  "message": "Test message",
  "reproductionSteps": ["Step 1"],
  "attachments": [],
  "timestamp": "2026-03-02T23:00:00Z",
  "status": "pending"
}
```

**Step 3: Create error-logs collection**

Firebase Console → Firestore Database:
1. Click "Create collection" → Name: `error-logs`
2. Create first document for testing:
```json
{
  "timestamp": "2026-03-02T23:00:00Z",
  "component": "test",
  "error": "test error",
  "severity": "info"
}
```

**Step 4: Update Firestore security rules**

Firebase Console → Firestore → Rules:

Replace entire rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // QA Chat collection - testers can write, Dario can read/write
    match /qa_chat/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid in ['tester-001', 'tester-002', 'tester-003']; // Expand as needed
      allow create: if request.auth.uid == 'dario'; // Dario can write
      allow update, delete: if false; // No edits/deletes
    }
    
    // Dario queue - Cloud Function writes, Dario reads
    match /dario-queue/{document=**} {
      allow read: if request.auth.uid == 'dario';
      allow write: if request.auth.uid == 'cloud-function'; // Cloud Function writes
      allow delete: if false; // No deletes
    }
    
    // Error logs - only system can write
    match /error-logs/{document=**} {
      allow read: if request.auth.uid == 'dario';
      allow write: if request.auth.uid in ['cloud-function', 'dario'];
    }
  }
}
```

**Step 5: Deploy rules**

Click "Publish" in Firebase Rules editor

**Commit:** None (Firestore config, no code)

---

## Task 2: Cloud Function - onQAChatMessage Trigger

**Files:**
- Create: `firebase/functions/src/qa-chat-trigger.js`
- Modify: `firebase/functions/src/index.js` (export function)
- Create: `firebase/functions/.env.local` (if needed for testing)

**Step 1: Create Cloud Function code**

File: `firebase/functions/src/qa-chat-trigger.js`

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();

/**
 * Cloud Function: Triggered when new message is written to qa_chat
 * Captures full context and pushes to dario-queue for processing
 */
exports.onQAChatMessage = functions
  .region('europe-west1')
  .firestore
  .document('qa_chat/{messageId}')
  .onCreate(async (snap, context) => {
    try {
      const message = snap.data();
      const messageId = context.params.messageId;

      // Only process tester messages (not Dario's own responses)
      if (message.author === 'dario') {
        console.log('[onQAChatMessage] Skipping Dario message:', messageId);
        return;
      }

      // Extract full context
      const queueEntry = {
        id: messageId,
        qa_chatId: message.qa_chatId || 'unknown',
        testerId: message.testerId || message.author || 'unknown',
        testerName: message.testerName || message.author || 'Tester',
        feature: message.feature || 'General',
        message: message.message || '',
        reproductionSteps: message.reproductionSteps || [],
        attachments: message.attachments || [],
        timestamp: message.timestamp || admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
        createdBy: 'cloud-function',
        originalMessageId: messageId,
      };

      // Write to dario-queue
      await db.collection('dario-queue').add(queueEntry);

      console.log('[onQAChatMessage] Queued message:', messageId, 'for Dario processing');

    } catch (error) {
      console.error('[onQAChatMessage] Error:', error);
      
      // Log to error-logs
      try {
        await db.collection('error-logs').add({
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          component: 'onQAChatMessage',
          error: error.message,
          stack: error.stack,
          severity: 'error',
          messageId: context.params.messageId,
        });
      } catch (logError) {
        console.error('[onQAChatMessage] Failed to log error:', logError);
      }
      
      throw error; // Fail the function so Firebase knows to retry
    }
  });
```

**Step 2: Export function from index.js**

File: `firebase/functions/src/index.js`

Add this line (or modify if file exists):
```javascript
const { onQAChatMessage } = require('./qa-chat-trigger');

exports.onQAChatMessage = onQAChatMessage;
```

**Step 3: Deploy Cloud Function**

```bash
cd firebase/functions
npm install  # Install dependencies if needed
firebase deploy --only functions:onQAChatMessage
```

Expected output:
```
Function onQAChatMessage has been successfully deployed at
projects/ai-lms-pro/locations/europe-west1/functions/onQAChatMessage
```

**Step 4: Test the function**

Firebase Console → Firestore → qa_chat collection:
1. Manually add a test message:
```json
{
  "qa_chatId": "chat-test-001",
  "author": "tester-001",
  "testerName": "Test Tester",
  "feature": "Image Upload",
  "message": "Testing the trigger",
  "timestamp": "2026-03-02T23:05:00Z"
}
```

2. Wait 2 seconds, then check dario-queue collection
3. Verify new document appeared with status: "pending"

Expected: ✅ Document in dario-queue with your test message

**Step 5: Commit**

```bash
cd /data/.openclaw/workspace
git add firebase/functions/src/qa-chat-trigger.js firebase/functions/src/index.js
git commit -m "feat: add Cloud Function onQAChatMessage trigger"
```

---

## Task 3: Dario Firestore Listener - Setup

**Files:**
- Create: `/data/.openclaw/workspace/scripts/qa-chat-listener.js`
- Modify: `/data/.openclaw/workspace/cron-jobs.json` (or equivalent cron config)

**Step 1: Create Dario queue listener script**

File: `scripts/qa-chat-listener.js`

```javascript
/**
 * Dario QA Chat Interactive Listener
 * Runs as long-lived process or periodic task
 * Listens to dario-queue collection for incoming messages
 * Processes with QA Testing Protocol
 * Writes responses directly to qa_chat
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase (use GOOGLE_APPLICATION_CREDENTIALS env var for service account)
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
  path.join(__dirname, '../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  projectId: 'ai-lms-pro',
});

const db = admin.firestore();
const TelegramAPI = require('node-telegram-bot-api');

// Get Telegram token from environment
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramAPI(TELEGRAM_TOKEN);

// Track processed messages to avoid duplicates
const processedMessages = new Set();

/**
 * Main listener: listens to dario-queue collection
 */
function startQAChatListener() {
  console.log('[QA Chat Listener] Starting Firestore listener...');

  const unsubscribe = db.collection('dario-queue')
    .where('status', '==', 'pending')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const docId = change.doc.id;
          
          // Avoid reprocessing
          if (processedMessages.has(docId)) {
            return;
          }
          
          processedMessages.add(docId);
          const messageData = change.doc.data();
          
          console.log('[QA Chat Listener] Received message:', docId);
          processMessage(docId, messageData);
        }
      });
    }, (error) => {
      console.error('[QA Chat Listener] Error in listener:', error);
      sendTelegramAlert(`⚠️ QA Chat Listener error: ${error.message}`);
    });

  return unsubscribe;
}

/**
 * Process a single message from dario-queue
 * Analyze context → ask clarifying Qs or respond
 */
async function processMessage(docId, messageData) {
  try {
    const {
      qa_chatId,
      testerName,
      feature,
      message,
      reproductionSteps,
      attachments,
    } = messageData;

    console.log(`[QA Chat] Processing: ${testerName} @ ${feature}: "${message}"`);

    // LOGIC: Analyze context
    let response = '';
    let responseType = 'question';

    // Heuristic: if reproduction steps are missing, ask for them
    if (!reproductionSteps || reproductionSteps.length === 0) {
      response = `@${testerName}, I see you're reporting an issue with ${feature}. Can you walk me through the exact steps to reproduce this? For example: 1. Click X 2. Select Y 3. See error Z?`;
      responseType = 'clarification';
    }
    // Heuristic: if message is very short, ask for more detail
    else if (message.length < 30) {
      response = `I see the issue: "${message}". Can you tell me more? What error message or behavior do you see? Is it a crash, timeout, or incorrect output?`;
      responseType = 'clarification';
    }
    // Otherwise: provide analysis
    else {
      response = `I've reviewed your report. Here's what I think: the issue is likely in ${feature}. To debug further, can you check if [specific thing] happens when you [specific action]?`;
      responseType = 'analysis';
    }

    // Write response to qa_chat
    const responseDoc = {
      qa_chatId,
      author: 'dario',
      message: response,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      responseToMessage: messageData.originalMessageId,
      type: responseType,
    };

    await db.collection('qa_chat').add(responseDoc);

    // Mark as processed
    await db.collection('dario-queue').doc(docId).update({
      status: 'processed',
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      processedBy: 'dario',
      responseWritten: true,
    });

    console.log(`[QA Chat] Responded to ${testerName}. Message written to qa_chat.`);

  } catch (error) {
    console.error('[QA Chat] Error processing message:', error);

    // Log error
    try {
      await db.collection('error-logs').add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        component: 'qa-chat-listener',
        operation: 'processMessage',
        error: error.message,
        stack: error.stack,
        severity: 'error',
        queueDocId: docId,
      });
    } catch (logError) {
      console.error('[QA Chat] Failed to log error:', logError);
    }

    // Alert user
    await sendTelegramAlert(`⚠️ QA Chat processing error: ${error.message}`);
  }
}

/**
 * Send alert to Telegram
 */
async function sendTelegramAlert(message) {
  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, message);
  } catch (error) {
    console.error('[Telegram] Failed to send alert:', error);
  }
}

/**
 * Start listener and keep process alive
 */
if (require.main === module) {
  console.log('[QA Chat Listener] Initializing...');
  const unsubscribe = startQAChatListener();

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('[QA Chat Listener] Shutting down...');
    unsubscribe();
    process.exit(0);
  });

  console.log('[QA Chat Listener] Running. Press Ctrl+C to stop.');
}

module.exports = { startQAChatListener };
```

**Step 2: Create local environment setup**

File: `.env.local` (in workspace root)

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/firebase-service-account.json
TELEGRAM_BOT_TOKEN=<your-bot-token>
TELEGRAM_CHAT_ID=<your-chat-id>
```

**Step 3: Install dependencies**

```bash
npm install firebase-admin node-telegram-bot-api
```

**Step 4: Test the listener locally**

```bash
node scripts/qa-chat-listener.js
```

Expected output:
```
[QA Chat Listener] Initializing...
[QA Chat Listener] Starting Firestore listener...
[QA Chat Listener] Running. Press Ctrl+C to stop.
```

Leave it running. In Firebase Console, add a test message to qa_chat. Listener should:
1. Print: `[QA Chat Listener] Received message: [doc-id]`
2. Write response to qa_chat
3. Update dario-queue status to "processed"

**Step 5: Commit**

```bash
git add scripts/qa-chat-listener.js .env.local
git commit -m "feat: add Dario QA Chat realtime listener"
```

---

## Task 4: Dario Heartbeat Cron Job

**Files:**
- Modify: OpenClaw cron configuration (gateway or cron tool)
- Create: `scripts/dario-heartbeat.js`

**Step 1: Create heartbeat script**

File: `scripts/dario-heartbeat.js`

```javascript
/**
 * Dario Heartbeat Monitor
 * Sends "I'm alive" message every 5 minutes to Telegram
 * Used to detect if Dario process has crashed
 */

const TelegramAPI = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('[Heartbeat] Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID env vars required');
  process.exit(1);
}

const bot = new TelegramAPI(TELEGRAM_TOKEN);

async function sendHeartbeat() {
  try {
    const timestamp = new Date().toISOString();
    const message = `✅ Dario online [${timestamp}]`;
    
    await bot.sendMessage(TELEGRAM_CHAT_ID, message);
    console.log(`[Heartbeat] Sent at ${timestamp}`);
    
  } catch (error) {
    console.error('[Heartbeat] Failed to send:', error.message);
    process.exit(1); // Fail so OpenClaw knows there was an error
  }
}

// Run immediately and exit (called by cron)
if (require.main === module) {
  sendHeartbeat().catch((error) => {
    console.error('[Heartbeat] Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { sendHeartbeat };
```

**Step 2: Register cron job with OpenClaw**

Using OpenClaw cron tool (from MEMORY.md: cron action):

```javascript
// Via cron tool - Schedule heartbeat every 5 minutes
{
  "action": "add",
  "job": {
    "name": "dario-heartbeat",
    "schedule": {
      "kind": "every",
      "everyMs": 300000  // 5 minutes in milliseconds
    },
    "payload": {
      "kind": "systemEvent",
      "text": "node /data/.openclaw/workspace/scripts/dario-heartbeat.js"
    },
    "sessionTarget": "main",
    "enabled": true
  }
}
```

**Step 3: Test heartbeat manually**

```bash
node scripts/dario-heartbeat.js
```

Expected: Message appears in Telegram dario_bot chat with timestamp

**Step 4: Commit**

```bash
git add scripts/dario-heartbeat.js
git commit -m "feat: add Dario heartbeat monitor (every 5 min)"
```

---

## Task 5: Heartbeat Monitor Cron (Alert on Offline)

**Files:**
- Create: `scripts/dario-heartbeat-monitor.js`

**Step 1: Create monitor script**

File: `scripts/dario-heartbeat-monitor.js`

```javascript
/**
 * Dario Heartbeat Monitor
 * Checks if heartbeat message was received in last 10 minutes
 * If not → sends alert to Telegram
 */

const TelegramAPI = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const HEARTBEAT_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('[Monitor] Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID env vars required');
  process.exit(1);
}

const bot = new TelegramAPI(TELEGRAM_TOKEN);

async function checkHeartbeat() {
  try {
    // Get last 5 messages from the chat
    const messages = await bot.getUpdates({ limit: 100 });
    
    // Filter for heartbeat messages from this chat
    const heartbeatMessages = messages
      .filter(m => m.message && m.message.chat.id === parseInt(TELEGRAM_CHAT_ID))
      .filter(m => m.message.text && m.message.text.includes('✅ Dario online'))
      .sort((a, b) => b.message.date - a.message.date);

    if (heartbeatMessages.length === 0) {
      console.log('[Monitor] No heartbeat messages found');
      await sendAlert('⚠️ Dario offline: No heartbeat messages in chat');
      return;
    }

    const lastHeartbeat = heartbeatMessages[0];
    const lastHeartbeatTime = lastHeartbeat.message.date * 1000; // Convert to ms
    const timeSinceLastHeartbeat = Date.now() - lastHeartbeatTime;

    console.log(`[Monitor] Last heartbeat: ${Math.round(timeSinceLastHeartbeat / 1000)} seconds ago`);

    if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT_MS) {
      const minutesAgo = Math.round(timeSinceLastHeartbeat / 60000);
      await sendAlert(`⚠️ Dario offline: No heartbeat for ${minutesAgo} minutes. Process may have crashed.`);
    } else {
      console.log('[Monitor] Dario is online ✅');
    }

  } catch (error) {
    console.error('[Monitor] Error checking heartbeat:', error.message);
    await sendAlert(`⚠️ Heartbeat monitor error: ${error.message}`);
  }
}

async function sendAlert(message) {
  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, message);
    console.log('[Monitor] Alert sent');
  } catch (error) {
    console.error('[Monitor] Failed to send alert:', error);
  }
}

// Run immediately
if (require.main === module) {
  checkHeartbeat().catch((error) => {
    console.error('[Monitor] Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { checkHeartbeat };
```

**Step 2: Register cron job with OpenClaw**

```javascript
{
  "action": "add",
  "job": {
    "name": "dario-heartbeat-monitor",
    "schedule": {
      "kind": "every",
      "everyMs": 600000  // 10 minutes
    },
    "payload": {
      "kind": "systemEvent",
      "text": "node /data/.openclaw/workspace/scripts/dario-heartbeat-monitor.js"
    },
    "sessionTarget": "main",
    "enabled": true
  }
}
```

**Step 3: Test monitor manually**

```bash
node scripts/dario-heartbeat-monitor.js
```

Expected: Either "Dario is online ✅" or alert if heartbeat is stale

**Step 4: Commit**

```bash
git add scripts/dario-heartbeat-monitor.js
git commit -m "feat: add Dario offline detection monitor (every 10 min)"
```

---

## Task 6: Integration Testing

**Files:**
- Create: `tests/qa-chat-interactive.test.js`

**Step 1: Write integration test**

File: `tests/qa-chat-interactive.test.js`

```javascript
/**
 * Integration test: QA Chat Interactive flow
 * End-to-end: tester writes → Dario processes → responds
 */

const admin = require('firebase-admin');
const { startQAChatListener } = require('../scripts/qa-chat-listener');

const db = admin.firestore();

describe('QA Chat Interactive Mode', () => {
  
  test('Tester message triggers Cloud Function → Dario processes → writes response', async () => {
    // 1. Start Dario listener
    const unsubscribe = startQAChatListener();

    // 2. Write test message to qa_chat (simulates tester)
    const testMessage = {
      qa_chatId: 'test-chat-001',
      author: 'test-tester',
      testerName: 'Test Tester',
      feature: 'Upload Feature',
      message: 'Upload button not working',
      reproductionSteps: ['Click upload', 'See nothing happen'],
      attachments: [],
      timestamp: new Date(),
    };

    const messageRef = await db.collection('qa_chat').add(testMessage);
    const messageId = messageRef.id;
    console.log(`Test: Added message ${messageId}`);

    // 3. Wait for Cloud Function to trigger and write to dario-queue
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second wait

    // 4. Check dario-queue has the message
    const queueSnapshot = await db.collection('dario-queue')
      .where('originalMessageId', '==', messageId)
      .get();

    expect(queueSnapshot.size).toBe(1);
    const queueDoc = queueSnapshot.docs[0].data();
    expect(queueDoc.testerId).toBe('test-tester');
    expect(queueDoc.status).toBe('pending');
    console.log(`Test: Found message in dario-queue`);

    // 5. Wait for Dario listener to process (up to 5 seconds)
    let responseFound = false;
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second per retry

      const processedSnapshot = await db.collection('dario-queue')
        .where('originalMessageId', '==', messageId)
        .get();
      
      if (processedSnapshot.docs[0].data().status === 'processed') {
        responseFound = true;
        break;
      }
    }

    expect(responseFound).toBe(true);
    console.log(`Test: Dario marked message as processed`);

    // 6. Check that response was written to qa_chat
    const responseSnapshot = await db.collection('qa_chat')
      .where('responseToMessage', '==', messageId)
      .where('author', '==', 'dario')
      .get();

    expect(responseSnapshot.size).toBeGreaterThan(0);
    const response = responseSnapshot.docs[0].data();
    expect(response.message.length).toBeGreaterThan(0);
    console.log(`Test: Found Dario response in qa_chat: "${response.message}"`);

    // 7. Cleanup
    unsubscribe();
    expect(true).toBe(true);
  }, 30000); // 30 second timeout

});
```

**Step 2: Run test**

```bash
npm test -- tests/qa-chat-interactive.test.js
```

Expected output:
```
 ✓ Tester message triggers Cloud Function → Dario processes → writes response (12s)

Test Suites: 1 passed
Tests:       1 passed
```

**Step 3: Commit**

```bash
git add tests/qa-chat-interactive.test.js
git commit -m "test: add QA Chat interactive mode integration test"
```

---

## Task 7: Documentation & Deployment

**Files:**
- Create: `/docs/QA-CHAT-INTERACTIVE-README.md`
- Modify: `TASK-REGISTRY.md` (mark complete)

**Step 1: Write deployment guide**

File: `docs/QA-CHAT-INTERACTIVE-README.md`

```markdown
# QA Chat Interactive Mode — Deployment & Operations

## What It Does

Enables real-time conversation between testers and Dario in website chat:

1. Tester writes in website chat
2. Cloud Function captures message → pushes to dario-queue
3. Dario listener receives event (instant)
4. Dario analyzes context → asks clarifying Qs or provides insights
5. Response written directly to qa_chat
6. Tester sees response in real-time (no 2-min polling)

## Components Running

### 1. Cloud Function: onQAChatMessage
- **Trigger:** Firestore write to qa_chat collection
- **Action:** Push message context to dario-queue
- **Firebase Console:** Functions → onQAChatMessage
- **Status:** Should show "ACTIVE"

### 2. Dario QA Chat Listener
- **Script:** `scripts/qa-chat-listener.js`
- **Running as:** Long-lived OpenClaw process (or cron job every N seconds)
- **Action:** Listen to dario-queue → process → write to qa_chat
- **Start command:** `node scripts/qa-chat-listener.js`
- **Logs:** Check OpenClaw logs for "[QA Chat Listener]" messages

### 3. Dario Heartbeat Cron
- **Script:** `scripts/dario-heartbeat.js`
- **Frequency:** Every 5 minutes
- **Action:** Send "✅ Dario online" to Telegram
- **Logs:** Check Telegram dario_bot chat for heartbeat messages

### 4. Heartbeat Monitor Cron
- **Script:** `scripts/dario-heartbeat-monitor.js`
- **Frequency:** Every 10 minutes
- **Action:** Check if heartbeat received. If not → alert
- **Logs:** Check Telegram for "⚠️ Dario offline" alerts

## Troubleshooting

### Issue: Tester writes but Dario doesn't respond

**Check:**
1. Cloud Function deployed: Firebase Console → Functions → onQAChatMessage status
2. dario-queue collection has pending messages: Firebase Console → Firestore → dario-queue
3. Dario listener running: Check OpenClaw logs for "[QA Chat Listener] Running"
4. Firestore security rules allow Dario writes: Firebase Console → Security Rules

### Issue: Dario offline alert keeps firing

**Check:**
1. Dario listener process still running
2. No errors in OpenClaw logs
3. Firestore connection OK (check error-logs collection)

### Restart Dario

```bash
# Stop the listener
kill $(pgrep -f 'qa-chat-listener.js')

# Restart
node scripts/qa-chat-listener.js &
```

## Monitoring

- **Real-time:** Check Telegram dario_bot chat for heartbeats (every 5 min)
- **Errors:** Check Firestore → error-logs collection
- **Messages:** Check Firestore → dario-queue (should be mostly "processed")
- **Responses:** Check Firestore → qa_chat collection for messages from "dario" author
```

**Step 2: Update TASK-REGISTRY.md**

Mark the task as complete:

```markdown
### TASK-001: QA Chat Monitor — Interactive Mode
**Status:** ✅ COMPLETE
**Completion Date:** 2026-03-02
```

**Step 3: Commit**

```bash
git add docs/QA-CHAT-INTERACTIVE-README.md TASK-REGISTRY.md
git commit -m "docs: add QA Chat Interactive deployment guide and mark task complete"
```

---

## Summary

**Total Implementation Tasks:** 7

- ✅ Task 1: Firestore collections + security rules
- ✅ Task 2: Cloud Function onQAChatMessage
- ✅ Task 3: Dario realtime listener
- ✅ Task 4: Dario heartbeat cron (every 5 min)
- ✅ Task 5: Heartbeat monitor cron (every 10 min)
- ✅ Task 6: Integration test
- ✅ Task 7: Documentation & deployment guide

**Estimated Time:** 8-10 hours total (with testing and debugging)

**Key Dependencies:**
- Firebase project (ai-lms-pro) initialized ✅
- Service account key for Firestore access ✅
- Telegram bot token ✅
- OpenClaw cron capability ✅

**Next:** Choose execution approach below
