/**
 * Firestore Collections Setup Script
 * Task 1: Creates dario-queue and error-logs collections
 * Also validates that qa_chat collection exists
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
  path.join(__dirname, '../firebase-service-account.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
    projectId: 'ai-lms-pro',
  });
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error.message);
  console.error('Ensure GOOGLE_APPLICATION_CREDENTIALS points to valid service account JSON');
  process.exit(1);
}

const db = admin.firestore();

/**
 * Create collections by writing a test document
 * (Firestore doesn't have explicit "create collection" API)
 */
async function setupCollections() {
  console.log('[Setup] Starting Firestore collections setup...\n');

  try {
    // 1. Verify qa_chat collection exists
    console.log('[Setup] Verifying qa_chat collection exists...');
    const qaChatSnapshot = await db.collection('qa_chat').limit(1).get();
    console.log('✅ qa_chat collection exists\n');

    // 2. Create dario-queue collection with test document
    console.log('[Setup] Creating dario-queue collection...');
    const queueTestDoc = {
      id: 'test-init-001',
      qa_chatId: 'test-chat',
      testerId: 'test-user',
      testerName: 'System Test',
      feature: 'Initialization',
      message: 'Initial test message for setup verification',
      reproductionSteps: [],
      attachments: [],
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'processed',
      createdBy: 'setup-script',
      note: 'This document verifies collection exists. Safe to delete.',
    };

    const queueRef = await db.collection('dario-queue').add(queueTestDoc);
    console.log('✅ dario-queue collection created:', queueRef.id);
    
    // Clean up test document
    await queueRef.delete();
    console.log('✅ Test document cleaned up\n');

    // 3. Create error-logs collection with test document
    console.log('[Setup] Creating error-logs collection...');
    const errorTestDoc = {
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      component: 'setup-script',
      error: 'test initialization',
      severity: 'info',
      note: 'This document verifies collection exists. Safe to delete.',
    };

    const errorRef = await db.collection('error-logs').add(errorTestDoc);
    console.log('✅ error-logs collection created:', errorRef.id);

    // Clean up test document
    await errorRef.delete();
    console.log('✅ Test document cleaned up\n');

    console.log('✅ All collections created successfully!\n');
    console.log('Next steps:');
    console.log('1. Update Firestore Security Rules (see docs/QA-CHAT-INTERACTIVE-README.md)');
    console.log('2. Deploy Cloud Function: firebase deploy --only functions:onQAChatMessage');
    console.log('3. Start Dario listener: node scripts/qa-chat-listener.js');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  setupCollections().then(() => {
    console.log('\n[Setup] Complete. Closing Firebase...');
    process.exit(0);
  }).catch((error) => {
    console.error('[Setup] Failed:', error);
    process.exit(1);
  });
}

module.exports = { setupCollections };
