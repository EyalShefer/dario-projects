/**
 * Dario Heartbeat Monitor
 * Checks if heartbeat message was received in last 10 minutes
 * If not → sends alert to Telegram
 *
 * Runs every 10 minutes as a cron job
 */

const TelegramAPI = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8431716250:AAHXNnc1u5Z1ez2AmMiZNjKmk3VeWMrc1qo';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '772680940';
const HEARTBEAT_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

const bot = new TelegramAPI(TELEGRAM_TOKEN);

// Track last known heartbeat timestamp
let lastHeartbeatTimestamp = null;

/**
 * Check if we've received a heartbeat recently
 * This works by checking Telegram chat for recent "✅ Dario online" messages
 */
async function checkHeartbeat() {
  try {
    // Get recent updates from Telegram
    const updates = await bot.getUpdates({ limit: 100, timeout: 0 });
    
    // Find the most recent heartbeat message from this chat
    let mostRecentHeartbeat = null;
    
    for (const update of updates) {
      if (update.message && update.message.chat.id === parseInt(TELEGRAM_CHAT_ID)) {
        const messageText = update.message.text || '';
        
        // Look for heartbeat pattern
        if (messageText.includes('✅ Dario online')) {
          const messageTime = update.message.date * 1000; // Convert to ms
          
          if (!mostRecentHeartbeat || messageTime > mostRecentHeartbeat.time) {
            mostRecentHeartbeat = {
              time: messageTime,
              text: messageText,
            };
          }
        }
      }
    }

    if (!mostRecentHeartbeat) {
      console.log('[Monitor] No heartbeat messages found in recent history');
      await sendAlert('⚠️ Dario offline: No heartbeat messages in chat history. Process may have crashed.');
      return false;
    }

    const timeSinceLastHeartbeat = Date.now() - mostRecentHeartbeat.time;
    const secondsAgo = Math.round(timeSinceLastHeartbeat / 1000);
    const minutesAgo = Math.round(timeSinceLastHeartbeat / 60000);

    console.log(`[Monitor] Last heartbeat: ${secondsAgo} seconds ago (${mostRecentHeartbeat.text})`);

    if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT_MS) {
      console.log(`[Monitor] ⚠️ ALERT: No heartbeat for ${minutesAgo} minutes`);
      await sendAlert(`⚠️ Dario offline: No heartbeat for ${minutesAgo} minutes. Process may have crashed.`);
      return false;
    } else {
      console.log(`[Monitor] ✅ Dario is online (last heartbeat ${minutesAgo}m ago)`);
      return true;
    }

  } catch (error) {
    console.error('[Monitor] Error checking heartbeat:', error.message);
    
    // Conservative: on error, send alert
    // Better to notify of an issue than silence when something is wrong
    await sendAlert(`⚠️ Heartbeat monitor error: ${error.message}`);
    return false;
  }
}

/**
 * Send alert to Telegram
 */
async function sendAlert(message) {
  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, message);
    console.log('[Monitor] Alert sent to Telegram');
  } catch (error) {
    console.error('[Monitor] Failed to send alert:', error.message);
  }
}

/**
 * Run check immediately
 */
if (require.main === module) {
  console.log('[Heartbeat Monitor] Starting check...');
  checkHeartbeat().catch((error) => {
    console.error('[Monitor] Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { checkHeartbeat };
