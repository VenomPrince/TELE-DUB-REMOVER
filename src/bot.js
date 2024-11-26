import TelegramBot from 'node-telegram-bot-api';
import crypto from 'crypto';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize bot with both polling and webhook options
const bot = new TelegramBot(process.env.BOT_TOKEN, { 
  polling: true,
  channelMode: true  // Enable channel mode for better private channel support
});

const channelId = process.env.CHANNEL_ID;

// Store media hashes with additional metadata
const mediaHashes = new Map();

// Verify channel access and bot permissions
async function verifyChannelAccess() {
  try {
    await bot.getChatAdministrators(channelId);
    console.log('Successfully connected to channel');
    return true;
  } catch (error) {
    console.error('Error accessing channel:', error.message);
    console.log('Please ensure:');
    console.log('1. The channel ID is correct');
    console.log('2. The bot is added as an administrator');
    console.log('3. The bot has permission to delete messages');
    return false;
  }
}

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

// Handle media messages
async function handleMedia(msg) {
  let fileId;
  let mediaType;

  if (msg.photo) {
    fileId = msg.photo[msg.photo.length - 1].file_id;
    mediaType = 'photo';
  } else if (msg.video) {
    fileId = msg.video.file_id;
    mediaType = 'video';
  } else if (msg.document) {
    fileId = msg.document.file_id;
    mediaType = 'document';
  } else {
    return;
  }

  const hash = await calculateFileHash(fileId);
  if (!hash) return;

  if (mediaHashes.has(hash)) {
    try {
      await bot.deleteMessage(channelId, msg.message_id);
      console.log(`Deleted duplicate ${mediaType} with message ID: ${msg.message_id}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      if (error.response && error.response.statusCode === 403) {
        console.log('Please check bot admin permissions in the channel');
      }
    }
  } else {
    mediaHashes.set(hash, {
      messageId: msg.message_id,
      mediaType,
      timestamp: Date.now()
    });
  }
}

// Listen for all types of channel posts
bot.on('channel_post', async (msg) => {
  handleMedia(msg);
});

// Also listen for edited channel posts
bot.on('edited_channel_post', async (msg) => {
  handleMedia(msg);
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Startup sequence
async function startBot() {
  console.log('Bot starting...');
  const hasAccess = await verifyChannelAccess();
  if (hasAccess) {
    console.log('Bot is running and monitoring for duplicate media...');
  } else {
    console.log('Bot startup failed. Please check your configuration.');
  }
}

startBot();
