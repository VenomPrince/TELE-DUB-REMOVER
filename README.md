# Telegram Duplicate Media Bot

This bot automatically detects and removes duplicate media (photos, videos, documents) from a Telegram channel.

## Setup

1. Create a new bot using [@BotFather](https://t.me/botfather) on Telegram
2. Get your bot token
3. Add the bot to your channel as an administrator with delete messages permission
4. Get your channel ID (you can use [@username_to_id_bot](https://t.me/username_to_id_bot))
5. Copy `.env.example` to `.env` and fill in your bot token and channel ID
6. Install dependencies: `npm install`
7. Start the bot: `npm start`

## Features

- Detects duplicate media using MD5 hash comparison
- Supports photos, videos, and documents
- Automatically removes duplicates when detected
- Keeps track of processed media hashes

## Requirements

- Node.js 16 or higher
- Admin privileges in the target channel