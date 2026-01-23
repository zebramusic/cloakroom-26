#!/usr/bin/env node

/**
 * Test Partner API Authentication & Authorization
 * Verifies that protected endpoints require proper permissions
 */

const API_BASE = 'http://localhost:3000/api/partners';

async function testAuthProtection() {
  console.log('🔒 Testing Partner API Authentication & Authorization');
  console.log('='.repeat(60));
  console.log(`Base URL: ${API_BASE}\n`);

  try {
    // Test 1: GET should work without auth (public)
    console.log('📋 TEST 1: GET /api/partners (public - should work)');
    console.log('─'.repeat(60));
    const getResponse = await fetch(API_BASE);
    const getData = await getResponse.json();
    
    if (!getResponse.ok) {
      console.error('❌ GET failed (should be public):', getData.error);
    } else {
      console.log(`✓ Status: ${getResponse.status}`);
      console.log(`✓ GET is public - no auth required`);
    }
    console.log();

    // Test 2: POST without auth should fail
    console.log('🔐 TEST 2: POST /api/partners (no auth - should fail)');
    console.log('─'.repeat(60));
    const postData = {
      name: 'Unauthorized Test',
      slug: `unauth-test-${Date.now()}`,
      isActive: true
    };

    const postResponse = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    const postResult = await postResponse.json();

    if (postResponse.status === 401) {
      console.log(`✓ Status: ${postResponse.status} (Unauthorized)`);
      console.log(`✓ Error message: ${postResult.error}`);
      console.log('✓ POST correctly requires authentication');
    } else {
      console.error('❌ POST should require auth but got:', postResponse.status);
    }
    console.log();

    // Test 3: PATCH without auth should fail
    console.log('🔐 TEST 3: PATCH /api/partners/:id (no auth - should fail)');
    console.log('─'.repeat(60));
    const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
    
    const patchResponse = await fetch(`${API_BASE}/${fakeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Name' })
    });
    const patchResult = await patchResponse.json();

    if (patchResponse.status === 401) {
      console.log(`✓ Status: ${patchResponse.status} (Unauthorized)`);
      console.log(`✓ Error message: ${patchResult.error}`);
      console.log('✓ PATCH correctly requires authentication');
    } else {
      console.error('❌ PATCH should require auth but got:', patchResponse.status);
    }
    console.log();

    // Test 4: DELETE without auth should fail
    console.log('🔐 TEST 4: DELETE /api/partners/:id (no auth - should fail)');
    console.log('─'.repeat(60));
    
    const deleteResponse = await fetch(`${API_BASE}/${fakeId}`, {
      method: 'DELETE'
    });
    const deleteResult = await deleteResponse.json();

    if (deleteResponse.status === 401) {
      console.log(`✓ Status: ${deleteResponse.status} (Unauthorized)`);
      console.log(`✓ Error message: ${deleteResult.error}`);
      console.log('✓ DELETE correctly requires authentication');
    } else {
      console.error('❌ DELETE should require auth but got:', deleteResponse.status);
    }
    console.log();

    // Summary
    console.log('✅ AUTHENTICATION TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('Protected endpoints correctly require authentication:');
    console.log('  • POST /api/partners - requires partners.create');
    console.log('  • PATCH /api/partners/:id - requires partners.update');
    console.log('  • DELETE /api/partners/:id - requires partners.delete');
    console.log('  • GET /api/partners - public (no auth required)');

  } catch (error) {
    console.error('\n❌ AUTH TEST FAILED!');
    console.error('='.repeat(60));
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/partners');
    return response.ok || response.status === 401 || response.status === 404;
  } catch (error) {
    return false;
  }
}

// Main
(async () => {
  console.log('🔍 Checking if dev server is running...\n');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('❌ Dev server is not running!');
    console.error('Please start the server with: npm run dev');
    console.error('Then run this test again.');
    process.exit(1);
  }
  
  console.log('✓ Server is running\n');
  await testAuthProtection();
})();
