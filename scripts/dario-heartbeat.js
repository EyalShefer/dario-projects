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
    process.exit(1);
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
