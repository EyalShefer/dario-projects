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
      
      throw error;
    }
  });
