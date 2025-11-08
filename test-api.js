#!/usr/bin/env node

/**
 * Simple script to test the Amazing Scientists API connectivity
 * Run with: node test-api.js
 */

const https = require('https');
const http = require('http');

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testAPI() {
  console.log('🧬 Testing Amazing Scientists API...');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  console.log('');
  
  // Test endpoints
  const endpoints = [
    { name: 'Root', path: '/' },
    { name: 'Scientists List', path: '/scientists?per_page=5' },
    { name: 'API Stats', path: '/stats' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const response = await testEndpoint(`${API_BASE_URL}${endpoint.path}`);
      
      if (response.status === 200) {
        console.log(`✅ ${endpoint.name}: OK (${response.status})`);
        
        // Try to parse and show some basic info
        try {
          const parsed = JSON.parse(response.data);
          if (endpoint.path.includes('/scientists')) {
            console.log(`   📊 Found ${parsed.scientists?.length || 0} scientists`);
          }
        } catch (e) {
          // Ignore JSON parse errors for non-JSON responses
        }
      } else {
        console.log(`⚠️  ${endpoint.name}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🏁 API Test Complete!');
  console.log('');
  console.log('If you see errors above, make sure:');
  console.log('1. Your Amazing Scientists API server is running');
  console.log('2. The API is accessible at the configured URL');
  console.log('3. CORS is properly configured on the API server');
}

// Run the test
testAPI().catch(console.error);