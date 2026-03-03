/**
 * Integration test: QA Chat Interactive flow
 * End-to-end: tester writes → Cloud Function triggers → Dario processes → responds
 *
 * Requires:
 * - Firebase project initialized
 * - Service account credentials via GOOGLE_APPLICATION_CREDENTIALS
 * - qa_chat, dario-queue, error-logs collections created
 */

const admin = require('firebase-admin');
const path = require('path');
const { startQAChatListener } = require('../scripts/qa-chat-listener');

// Initialize Firebase for testing
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
  path.join(__dirname, '../firebase-service-account.json');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath)),
      projectId: 'ai-lms-pro',
    });
  } catch (error) {
    console.error('Failed to initialize Firebase for testing:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();

describe('QA Chat Interactive Mode', () => {
  
  /**
   * Test: Full end-to-end flow
   * 1. Tester writes message to qa_chat
   * 2. Cloud Function should push to dario-queue (simulated - we do this manually)
   * 3. Dario listener processes and writes response
   */
  test(
    'Tester message → Dario listener processes → writes response to qa_chat',
    async () => {
      console.log('\n[Test] Starting end-to-end flow test...');

      // 1. Start Dario listener
      console.log('[Test] Starting Dario listener...');
      const unsubscribe = startQAChatListener();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for listener to initialize

      // 2. Create a message that would come from Cloud Function
      // (In production, Cloud Function triggers this; here we simulate it)
      const testMessage = {
        qa_chatId: 'test-chat-001',
        testerId: 'test-tester-001',
        testerName: 'Integration Tester',
        feature: 'Image Upload',
        message: 'The image upload button is not responding',
        reproductionSteps: [
          'Click the upload button',
          'Select an image',
          'See nothing happen',
        ],
        attachments: [],
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
        createdBy: 'test-simulation',
        originalMessageId: 'test-msg-' + Date.now(),
      };

      console.log('[Test] Writing test message to dario-queue...');
      const queueRef = await db.collection('dario-queue').add(testMessage);
      const queueDocId = queueRef.id;
      console.log('[Test] Message written:', queueDocId);

      // 3. Wait for Dario listener to process (up to 5 seconds)
      console.log('[Test] Waiting for Dario listener to process...');
      let processed = false;
      let attempts = 0;
      const maxAttempts = 10; // 10 x 500ms = 5 seconds

      while (!processed && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const queueDoc = await db.collection('dario-queue').doc(queueDocId).get();
        const status = queueDoc.data()?.status;
        
        console.log(`[Test] Attempt ${attempts + 1}: status = ${status}`);
        
        if (status === 'processed') {
          processed = true;
          console.log('[Test] ✅ Message marked as processed');
        }
        
        attempts++;
      }

      expect(processed).toBe(true);

      // 4. Verify response was written to qa_chat
      console.log('[Test] Checking for response in qa_chat...');
      const responsesSnapshot = await db.collection('qa_chat')
        .where('responseToMessage', '==', testMessage.originalMessageId)
        .where('author', '==', 'dario')
        .get();

      expect(responsesSnapshot.size).toBeGreaterThan(0);
      const response = responsesSnapshot.docs[0].data();
      console.log('[Test] ✅ Found response:', response.message);
      expect(response.message.length).toBeGreaterThan(0);

      // 5. Verify queue document was updated with response metadata
      const updatedQueueDoc = await db.collection('dario-queue').doc(queueDocId).get();
      const queueData = updatedQueueDoc.data();
      
      expect(queueData.status).toBe('processed');
      expect(queueData.responseWritten).toBe(true);
      expect(queueData.processedBy).toBe('dario');
      console.log('[Test] ✅ Queue document updated correctly');

      // 6. Cleanup
      console.log('[Test] Cleaning up...');
      unsubscribe();
      
      // Delete test documents
      await db.collection('dario-queue').doc(queueDocId).delete();
      for (const doc of responsesSnapshot.docs) {
        await doc.ref.delete();
      }
      console.log('[Test] ✅ Test data cleaned up');

      console.log('[Test] ✅ FULL FLOW TEST PASSED\n');
    },
    30000 // 30 second timeout
  );

  /**
   * Test: Listener asks for reproduction steps when missing
   */
  test(
    'Listener asks for reproduction steps when missing',
    async () => {
      console.log('\n[Test] Starting "ask for steps" test...');

      const unsubscribe = startQAChatListener();
      await new Promise(resolve => setTimeout(resolve, 1000));

      const testMessage = {
        qa_chatId: 'test-chat-002',
        testerId: 'test-tester-002',
        testerName: 'User B',
        feature: 'Login',
        message: 'Login page is broken',
        reproductionSteps: [], // MISSING - should trigger clarification
        attachments: [],
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
        createdBy: 'test',
        originalMessageId: 'test-msg-' + Date.now(),
      };

      const queueRef = await db.collection('dario-queue').add(testMessage);
      const queueDocId = queueRef.id;

      // Wait for processing
      let processed = false;
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const doc = await db.collection('dario-queue').doc(queueDocId).get();
        if (doc.data()?.status === 'processed') {
          processed = true;
          break;
        }
      }

      expect(processed).toBe(true);

      // Check response type is "clarification"
      const responsesSnapshot = await db.collection('qa_chat')
        .where('responseToMessage', '==', testMessage.originalMessageId)
        .where('author', '==', 'dario')
        .get();

      expect(responsesSnapshot.size).toBeGreaterThan(0);
      const response = responsesSnapshot.docs[0].data();
      expect(response.type).toBe('clarification');
      expect(response.message).toContain('steps');
      console.log('[Test] ✅ Clarification question sent:', response.message);

      // Cleanup
      unsubscribe();
      await db.collection('dario-queue').doc(queueDocId).delete();
      for (const doc of responsesSnapshot.docs) {
        await doc.ref.delete();
      }

      console.log('[Test] ✅ "ASK FOR STEPS" TEST PASSED\n');
    },
    30000
  );

  /**
   * Test: Listener asks for details when message too short
   */
  test(
    'Listener asks for details when message is too short',
    async () => {
      console.log('\n[Test] Starting "ask for details" test...');

      const unsubscribe = startQAChatListener();
      await new Promise(resolve => setTimeout(resolve, 1000));

      const testMessage = {
        qa_chatId: 'test-chat-003',
        testerId: 'test-tester-003',
        testerName: 'User C',
        feature: 'Dashboard',
        message: 'Broken', // TOO SHORT - should trigger clarification
        reproductionSteps: ['Step 1'],
        attachments: [],
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
        createdBy: 'test',
        originalMessageId: 'test-msg-' + Date.now(),
      };

      const queueRef = await db.collection('dario-queue').add(testMessage);
      const queueDocId = queueRef.id;

      // Wait for processing
      let processed = false;
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const doc = await db.collection('dario-queue').doc(queueDocId).get();
        if (doc.data()?.status === 'processed') {
          processed = true;
          break;
        }
      }

      expect(processed).toBe(true);

      // Check response type is "clarification"
      const responsesSnapshot = await db.collection('qa_chat')
        .where('responseToMessage', '==', testMessage.originalMessageId)
        .where('author', '==', 'dario')
        .get();

      expect(responsesSnapshot.size).toBeGreaterThan(0);
      const response = responsesSnapshot.docs[0].data();
      expect(response.type).toBe('clarification');
      console.log('[Test] ✅ Detail request sent:', response.message);

      // Cleanup
      unsubscribe();
      await db.collection('dario-queue').doc(queueDocId).delete();
      for (const doc of responsesSnapshot.docs) {
        await doc.ref.delete();
      }

      console.log('[Test] ✅ "ASK FOR DETAILS" TEST PASSED\n');
    },
    30000
  );

});
