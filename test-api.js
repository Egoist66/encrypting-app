#!/usr/bin/env node

// Скрипт для тестирования API эндпоинтов

const BASE_URL = process.env.BASE_URL || 'https://encrypting-app.vercel.app';

async function testEndpoint(url, options = {}) {
  try {
    console.log(`🔍 Testing: ${url}`);
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(data, null, 2));
    console.log('---');
    
    return { success: true, status: response.status, data };
  } catch (error) {
    console.log(`❌ Error:`, error.message);
    console.log('---');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log(`🚀 Testing API endpoints on ${BASE_URL}\n`);
  
  // Test 1: Health check
  await testEndpoint(`${BASE_URL}/api/health`);
  
  // Test 2: Auth status (without login)
  await testEndpoint(`${BASE_URL}/api/auth/user`);
  
  // Test 3: Auth status endpoint
  await testEndpoint(`${BASE_URL}/api/auth/status`);
  
  // Test 4: Google OAuth initiation (should redirect)
  console.log('🔍 Testing Google OAuth initiation...');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/google`, { 
      redirect: 'manual' 
    });
    console.log(`✅ Status: ${response.status}`);
    console.log(`📍 Location: ${response.headers.get('location')}`);
    console.log('---');
  } catch (error) {
    console.log(`❌ Error:`, error.message);
    console.log('---');
  }
  
  console.log('🎉 Tests completed!');
}

runTests();
