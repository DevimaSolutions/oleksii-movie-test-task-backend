#!/bin/bash

# This script is triggered by Github actions when changes are pulled to production server

# The script will terminate after the first line that fails
set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

echo "Jump to app folder"
cd /opt/oleksii-movie-test-task-backend

echo "Update app from Git"
git pull
git status

echo "Install app dependencies"
yarn

echo "Build your app"
yarn build

echo "Apply migrations"
yarn migration:run

echo "Reload start PM2 instances with 0 downtime"
pm2 reload ecosystem.config.js

echo "Save PM2 state"
pm2 save

echo "Show PM2 state"
pm2 ls