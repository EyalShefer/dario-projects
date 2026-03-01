#!/usr/bin/env node

/**
 * QA Chat Monitor — Firestore to Telegram Bridge
 * Reads qa_chat collection, triggers Telegram messages on status changes
 * Run via cron every 2 minutes
 */

const admin = require('firebase-admin');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load Firebase credentials
const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'ai-lms-pro'
});

const db = admin.firestore();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const STATE_FILE = path.join(__dirname, '../.qa-chat-state.json');

// Load previous state
function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  }
  return {};
}

// Save state
function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// Send Telegram message
async function sendTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️ Telegram credentials missing, skipping message');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const data = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: 'HTML'
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Map status changes to messages
async function handleStatusChange(messageId, doc, previousStatus, newStatus) {
  const { text, threadId, sender } = doc;

  let telegramText = '';

  if (newStatus === 'acknowledged' && sender === 'tester') {
    // Unread → Acknowledged (דריו קרא)
    telegramText = `🔔 <b>באג חדש:</b> ${text}\n<i>(thread: ${threadId})</i>`;
  } else if (newStatus === 'in_progress' && sender === 'dario') {
    // Acknowledged → In Progress (דריו מתקן)
    telegramText = `🔧 <b>מתקן:</b> ${text}`;
  } else if (newStatus === 'waiting_approval' && sender === 'dario') {
    // In Progress → Waiting Approval (דריו סיים)
    telegramText = `✅ <b>תוקן, מחכה לאישור הבודק</b>\n<i>(thread: ${threadId})</i>`;
  } else if (newStatus === 'resolved') {
    // Waiting Approval → Resolved (בודק אישר)
    telegramText = `🎉 <b>הבודק אישר - thread ${threadId} סגור</b>`;
  }

  if (telegramText) {
    console.log(`📤 Sending: ${telegramText}`);
    await sendTelegram(telegramText);
  }
}

// Main monitoring function
async function monitorQaChat() {
  try {
    const state = loadState();
    const snapshot = await db.collection('qa_chat').get();

    for (const doc of snapshot.docs) {
      const messageId = doc.id;
      const data = doc.data();
      const previousStatus = state[messageId]?.status;

      // Track message and check for status changes
      if (previousStatus && previousStatus !== data.status) {
        console.log(`🔄 Status change: ${messageId} ${previousStatus} → ${data.status}`);
        await handleStatusChange(messageId, data, previousStatus, data.status);
      }

      // Update state
      state[messageId] = {
        status: data.status,
        timestamp: data.timestamp
      };
    }

    saveState(state);
    console.log(`✅ Monitor run complete (${snapshot.size} messages)`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  // Cleanup
  await admin.app().delete();
}

monitorQaChat();
