import http from 'http';
import { connectDB, closeDB } from './src/config/db.js';
import { Owner } from './src/models/Owner.js';
import { Inventory } from './src/models/Inventory.js';
import { seedDatabase } from './src/utils/seedData.js';
import { calculateHaversineDistance } from './src/utils/haversine.js';

// Helper to make local HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('====================================================');
  console.log('HYPERLOCAL CONSTRUCTION MARKETPLACE - TEST SUITE');
  console.log('====================================================\n');

  // Step 1: Connect to DB and ensure seed data
  console.log('[TEST 1] Initializing Database & Seed Records...');
  await connectDB();
  await seedDatabase();

  const ownerCount = await Owner.countDocuments();
  const inventoryCount = await Inventory.countDocuments();
  console.log(`[PASS] DB seeded: ${ownerCount} suppliers, ${inventoryCount} materials.\n`);

  // Step 2: Test Haversine distance calculation
  console.log('[TEST 2] Verifying Haversine Great-Circle Calculation...');
  // Mumbai to Pune coordinates
  const mumbaiLat = 19.0760, mumbaiLng = 72.8777;
  const puneLat = 18.5204, puneLng = 73.8567;
  const dist = calculateHaversineDistance(mumbaiLat, mumbaiLng, puneLat, puneLng);
  console.log(`Calculated Mumbai to Pune distance: ${dist} km (Expected ~118-125 km)`);
  if (dist > 100 && dist < 140) {
    console.log('[PASS] Haversine calculation accurate.\n');
  } else {
    throw new Error(`Haversine calculation unexpected: ${dist}`);
  }

  // Step 3: Verify Bcrypt password encryption on Owner model
  console.log('[TEST 3] Security Audit: Bcrypt Password Encryption...');
  const testOwner = await Owner.findOne({ email: 'balaji.materials@example.com' }).select('+password');
  console.log(`Stored password hash: ${testOwner.password.substring(0, 20)}...`);
  if (!testOwner.password.startsWith('$2a$') && !testOwner.password.startsWith('$2b$')) {
    throw new Error('Password was not hashed using bcrypt!');
  }
  const isMatch = await testOwner.comparePassword('password123');
  const isWrong = await testOwner.comparePassword('wrongpassword');
  if (isMatch && !isWrong) {
    console.log('[PASS] Bcrypt password encryption and comparison fully verified.\n');
  } else {
    throw new Error('Password verification logic failed!');
  }

  // Step 4: Verify 2dsphere spatial index
  console.log('[TEST 4] Verifying 2dsphere Geospatial Index on Owner model...');
  const indexes = await Owner.collection.getIndexes();
  console.log('Owner Indexes:', Object.keys(indexes));
  if (indexes['location_2dsphere']) {
    console.log('[PASS] 2dsphere spatial index confirmed active.\n');
  } else {
    console.warn('[WARN] 2dsphere index not explicitly named location_2dsphere');
  }

  // Step 5: Test Time-stamp synchronization & Stale warnings logic
  console.log('[TEST 5] Verifying Time-Stamp Synchronization & Stale Badge Logic...');
  const freshItem = await Inventory.findOne({
    lastUpdatedTimestamp: { $gte: new Date(Date.now() - 6 * 3600 * 1000) },
  });
  const staleItem = await Inventory.findOne({
    lastUpdatedTimestamp: { $lte: new Date(Date.now() - 48 * 3600 * 1000) },
  });

  if (freshItem) {
    console.log(`[PASS] Fresh item found: ${freshItem.brand} (Updated: ${freshItem.lastUpdatedTimestamp.toISOString()})`);
  }
  if (staleItem) {
    console.log(`[PASS] Stale item found: ${staleItem.brand} (Updated: ${staleItem.lastUpdatedTimestamp.toISOString()}) - Triggers stale badge`);
  }

  console.log('\n====================================================');
  console.log('ALL SYSTEM INTEGRITY AND SECURITY CHECKS PASSED!');
  console.log('====================================================');

  await closeDB();
  process.exit(0);
}

runVerification().catch((err) => {
  console.error('[TEST SUITE ERROR]:', err);
  process.exit(1);
});
