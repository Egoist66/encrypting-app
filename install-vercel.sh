#!/bin/bash
set -e

echo "=== Starting Vercel installation ==="

# Временно скрываем workspaces и .npmrc
mv package.json package.json.bak
mv package-lock.json package-lock.json.bak 2>/dev/null || true
rm -rf node_modules

# Устанавливаем зависимости клиента (включая devDependencies)
echo "Installing client dependencies..."
cd client
rm -rf package-lock.json node_modules .npmrc
npm install --include=dev --force --legacy-peer-deps

# Проверяем установку vite
if [ -f "node_modules/.bin/vite" ]; then
  echo "✓ Vite installed successfully"
  ls -lh node_modules/.bin/vite
else
  echo "✗ Vite NOT installed - trying alternative method..."
  npm install vite@7.1.10 --save-dev --force --legacy-peer-deps
fi
cd ..

# Устанавливаем зависимости API
echo "Installing API dependencies..."
cd api
rm -rf package-lock.json node_modules .npmrc
npm install --include=dev --legacy-peer-deps
cd ..

# Восстанавливаем
mv package.json.bak package.json
mv package-lock.json.bak package-lock.json 2>/dev/null || true

echo "=== Installation complete ==="

