#!/bin/bash

exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting EC2 initialization script..."

# Update and install packages
apt update -y
apt install -y git curl unzip tar gcc g++ make

# Install Node.js via NVM
su - admin -c 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash'
su - admin -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm install --lts'
su - admin -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm alias default node'

# Install PM2
su - admin -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && npm install -g pm2'

# Configure PM2 startup
su - admin -c 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && pm2 startup'
env PATH=$PATH:/home/admin/.nvm/versions/node/$(su - admin -c 'export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && node -v')/bin \
    /home/admin/.nvm/versions/node/$(su - admin -c 'export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && node -v')/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin

# Create logs directory
su - admin -c 'mkdir -p ~/logs'

# Install AWS CLI
curl "https://awscli.amazo
