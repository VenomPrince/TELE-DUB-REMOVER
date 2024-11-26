import TelegramBot from 'node-telegram-bot-api';
import crypto from 'crypto';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const channelId = process.env.CHANNEL_ID;

// Store media hashes
const mediaHashes = new Map();

// Calculate hash of media file
async function calculateFileHash(fileId) {
  try {
    const file = await bot.getFile(fileId);
    const response = await fetch(`https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`);
    const buffer = await response.buffer();
    return crypto.createHash('md5').update(buffer).digest('hex');
  } catch (error) {
    console.error('Error calculating file hash:', error);
    return null;
  }
}

// Check and handle media messages
bot.on('channel_post', async (msg) => {
  if (!msg.photo && !msg.video && !msg.document) return;

  let fileId;
  if (msg.photo) {
    fileId = msg.photo[msg.photo.length - 1].file_id; // Get the highest quality photo
  } else if (msg.video) {
    fileId = msg.video.file_id;
  } else if (msg.document) {
    fileId = msg.document.file_id;
  }

  const hash = await calculateFileHash(fileId);
  if (!hash) return;

  if (mediaHashes.has(hash)) {
    // Duplicate found, delete the message
    try {
      await bot.deleteMessage(channelId, msg.message_id);
      console.log(`Deleted duplicate media with message ID: ${msg.message_id}`);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  } else {
    // New media, store its hash
    mediaHashes.set(hash, {
      messageId: msg.message_id,
      timestamp: Date.now()
    });
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot is running...');