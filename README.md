# Telegram Duplicate Media Bot

This bot automatically detects and removes duplicate media (photos, videos, documents) from any Telegram channel, including private channels.

## Setup

1. Create a new bot using [@BotFather](https://t.me/botfather) on Telegram
2. Get your bot token
3. Add the bot to your channel as an administrator with these permissions:
   - Delete messages
   - Read messages
4. Get your channel ID:
   - For public channels: use [@username_to_id_bot](https://t.me/username_to_id_bot)
   - For private channels: forward a message from your channel to [@username_to_id_bot](https://t.me/username_to_id_bot)
5. Copy `.env.example` to `.env` and fill in your bot token and channel ID
6. Install dependencies: `npm install`
7. Start the bot: `npm start`

## Features

- Works with both public and private channels
- Detects duplicate media using MD5 hash comparison
- Supports photos, videos, and documents
- Automatically removes duplicates when detected
- Keeps track of processed media hashes
- Verifies channel access and permissions on startup

## Requirements

- Node.js 16 or higher
- Admin privileges in the target channel
- Bot must be an administrator in the channel

## Troubleshooting

If the bot isn't working:
1. Ensure the channel ID is correct (including the minus sign for private channels)
2. Verify the bot is an administrator in the channel
3. Check that the bot has permission to delete messages
4. Make sure the bot token is correct
