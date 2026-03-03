const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export functions
const { onQAChatMessage } = require('./qa-chat-trigger');

exports.onQAChatMessage = onQAChatMessage;
