#!/usr/bin/env node

/**
 * Test Partner API endpoints
 * Tests all CRUD operations via HTTP API
 */

const API_BASE = "http://localhost:3000/api/partners";

async function testAPI() {
  console.log("🌐 Testing Partner API Endpoints");
  console.log("=".repeat(60));
  console.log(`Base URL: ${API_BASE}\n`);

  try {
    // Test 1: GET all partners
    console.log("📋 TEST 1: GET /api/partners");
    console.log("─".repeat(60));
    const listResponse = await fetch(API_BASE);
    const listData = await listResponse.json();

    if (!listResponse.ok) {
      throw new Error(`GET failed: ${listData.error || "Unknown error"}`);
    }

    console.log(`✓ Status: ${listResponse.status}`);
    console.log(`✓ Found ${listData.partners?.length || 0} partner(s)`);
    if (listData.partners && listData.partners.length > 0) {
      listData.partners.forEach((p, i) => {
        console.log(
          `  ${i + 1}. ${p.name} (${p.slug}) - Active: ${p.isActive}`,
        );
      });
    }
    console.log("✓ GET all partners successful\n");

    // Test 2: POST create partner
    console.log("📝 TEST 2: POST /api/partners");
    console.log("─".repeat(60));
    const newPartner = {
      name: "API Test Partner",
      slug: `api-test-${Date.now()}`,
      logo: "/uploads/partners/api-test.png",
      website: "https://apitest.com",
      contactEmail: "api@test.com",
      contactPhone: "+40 999 888 777",
      description: "Created via API test",
      isActive: true,
      order: 888,
    };

    const createResponse = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPartner),
    });
    const createData = await createResponse.json();

    if (!createResponse.ok) {
      throw new Error(`POST failed: ${createData.error || "Unknown error"}`);
    }

    console.log(`✓ Status: ${createResponse.status}`);
    console.log(`✓ Created: ${createData.partner.name}`);
    console.log(`  ID: ${createData.partner._id}`);
    console.log(`  Slug: ${createData.partner.slug}`);
    const partnerId = createData.partner._id;
    console.log("✓ POST create successful\n");

    // Test 3: GET single partner
    console.log("🔍 TEST 3: GET /api/partners/:id");
    console.log("─".repeat(60));
    const getResponse = await fetch(`${API_BASE}/${partnerId}`);
    const getData = await getResponse.json();

    if (!getResponse.ok) {
      throw new Error(`GET single failed: ${getData.error || "Unknown error"}`);
    }

    console.log(`✓ Status: ${getResponse.status}`);
    console.log(`✓ Found: ${getData.partner.name}`);
    console.log(`  Website: ${getData.partner.website || "N/A"}`);
    console.log(`  Email: ${getData.partner.contactEmail || "N/A"}`);
    console.log("✓ GET single partner successful\n");

    // Test 4: PATCH update partner
    console.log("✏️  TEST 4: PATCH /api/partners/:id");
    console.log("─".repeat(60));
    const updateData = {
      name: "Updated API Partner",
      description: "Updated via API test",
      website: "https://updated-api.com",
      isActive: false,
    };

    const updateResponse = await fetch(`${API_BASE}/${partnerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    const updatedData = await updateResponse.json();

    if (!updateResponse.ok) {
      throw new Error(`PATCH failed: ${updatedData.error || "Unknown error"}`);
    }

    console.log(`✓ Status: ${updateResponse.status}`);
    console.log(`✓ Updated: ${updatedData.partner.name}`);
    console.log(`  Description: ${updatedData.partner.description}`);
    console.log(`  Website: ${updatedData.partner.website}`);
    console.log(`  Active: ${updatedData.partner.isActive}`);
    console.log("✓ PATCH update successful\n");

    // Test 5: GET with filters
    console.log("🔎 TEST 5: GET /api/partners?published=true");
    console.log("─".repeat(60));
    const filterResponse = await fetch(`${API_BASE}?published=true`);
    const filterData = await filterResponse.json();

    if (!filterResponse.ok) {
      throw new Error(
        `GET filtered failed: ${filterData.error || "Unknown error"}`,
      );
    }

    console.log(`✓ Status: ${filterResponse.status}`);
    console.log(`✓ Active partners: ${filterData.partners?.length || 0}`);
    console.log("✓ GET with filters successful\n");

    // Test 6: DELETE partner
    console.log("🗑️  TEST 6: DELETE /api/partners/:id");
    console.log("─".repeat(60));
    const deleteResponse = await fetch(`${API_BASE}/${partnerId}`, {
      method: "DELETE",
    });
    const deleteData = await deleteResponse.json();

    if (!deleteResponse.ok) {
      throw new Error(`DELETE failed: ${deleteData.error || "Unknown error"}`);
    }

    console.log(`✓ Status: ${deleteResponse.status}`);
    console.log(`✓ Deleted partner with ID: ${partnerId}`);
    console.log("✓ DELETE successful\n");

    // Verify deletion
    console.log("✓ Verifying deletion...");
    const verifyResponse = await fetch(`${API_BASE}/${partnerId}`);
    const verifyData = await verifyResponse.json();

    if (verifyResponse.status !== 404) {
      throw new Error("Partner still exists after deletion!");
    }
    console.log("✓ Verified partner was deleted\n");

    // Final summary
    console.log("✅ ALL API TESTS PASSED!");
    console.log("=".repeat(60));
    console.log("All Partner API endpoints are working correctly.");
  } catch (error) {
    console.error("\n❌ API TEST FAILED!");
    console.error("=".repeat(60));
    console.error("Error:", error.message);
    if (error.cause) {
      console.error("Cause:", error.cause);
    }
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch("http://localhost:3000/api/partners");
    return response.ok || response.status === 401 || response.status === 404;
  } catch (error) {
    return false;
  }
}

// Main
(async () => {
  console.log("🔍 Checking if dev server is running...\n");

  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.error("❌ Dev server is not running!");
    console.error("Please start the server with: npm run dev");
    console.error("Then run this test again.");
    process.exit(1);
  }

  console.log("✓ Server is running\n");
  await testAPI();
})();
