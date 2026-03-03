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

try {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
    projectId: 'ai-lms-pro',
  });
} catch (error) {
  console.error('[QA Chat Listener] Failed to initialize Firebase:', error.message);
  console.error('[QA Chat Listener] Ensure GOOGLE_APPLICATION_CREDENTIALS points to service account JSON');
  process.exit(1);
}

const db = admin.firestore();

// For Telegram alerts (optional - set TELEGRAM_BOT_TOKEN env var)
let bot = null;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (TELEGRAM_TOKEN) {
  try {
    const TelegramAPI = require('node-telegram-bot-api');
    bot = new TelegramAPI(TELEGRAM_TOKEN);
  } catch (error) {
    console.warn('[QA Chat Listener] Telegram support not available (node-telegram-bot-api not installed)');
  }
}

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
  if (!bot || !TELEGRAM_CHAT_ID) {
    console.log('[Telegram] Alert (no bot configured):', message);
    return;
  }

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
