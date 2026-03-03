/**
 * Dario Heartbeat Monitor
 * Sends "I'm alive" message every 5 minutes to Telegram
 * Used to detect if Dario process has crashed
 */

const TelegramAPI = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8431716250:AAHXNnc1u5Z1ez2AmMiZNjKmk3VeWMrc1qo';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '772680940';

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
