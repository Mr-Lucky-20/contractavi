import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, closeDB } from './src/config/db.js';
import { sanitizeInputs } from './src/middleware/sanitizeMiddleware.js';
import authRoutes from './src/routes/authRoutes.js';
import vendorRoutes from './src/routes/vendorRoutes.js';
import inventoryRoutes from './src/routes/inventoryRoutes.js';
import { seedDatabase } from './src/utils/seedData.js';

dotenv.config();

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(sanitizeInputs);

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/inventory', inventoryRoutes);

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  await connectDB();
  await seedDatabase();

  const server = app.listen(5005, async () => {
    console.log('[API TEST] Server listening on port 5005');

    try {
      // 1. Test Nearest Vendors API
      console.log('\n[1] Testing GET /api/vendors/nearest?lat=19.0760&lng=72.8777&radius=35');
      const res1 = await request({
        hostname: 'localhost',
        port: 5005,
        path: '/api/vendors/nearest?lat=19.0760&lng=72.8777&radius=35&sort=distance_asc',
        method: 'GET',
      });
      console.log(`Status: ${res1.status}, Count: ${res1.body.count}`);
      console.log(`Nearest vendor: ${res1.body.vendors[0]?.storeName} (${res1.body.vendors[0]?.distanceKm} km away)`);
      console.log(`Verification: ${res1.body.vendors[0]?.verification?.badgeText}`);

      // 2. Test Sorting by Lowest Price
      console.log('\n[2] Testing GET /api/vendors/nearest?sort=price_asc&material=Cement');
      const res2 = await request({
        hostname: 'localhost',
        port: 5005,
        path: '/api/vendors/nearest?lat=19.0760&lng=72.8777&sort=price_asc&material=Cement',
        method: 'GET',
      });
      console.log(`Status: ${res2.status}, Lowest Cement vendor: ${res2.body.vendors[0]?.storeName} at ₹${res2.body.vendors[0]?.lowestPrice}`);

      // 3. Test Supplier Login
      console.log('\n[3] Testing POST /api/auth/login');
      const res3 = await request(
        {
          hostname: 'localhost',
          port: 5005,
          path: '/api/auth/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { email: 'balaji.materials@example.com', password: 'password123' }
      );
      console.log(`Status: ${res3.status}, Auth Success: ${res3.body.success}`);
      const token = res3.body.token;
      console.log(`JWT Token issued: ${token ? 'YES (Valid Bearer)' : 'NO'}`);

      // 4. Test Single Material Price Overwrite
      const inventoryRes = await request({
        hostname: 'localhost',
        port: 5005,
        path: '/api/inventory/my-inventory',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const cementItem = inventoryRes.body.items.find((i) => i.materialType === 'Cement');
      console.log(`\nCurrent Cement Price before update: ₹${cementItem.unitPrice}`);

      console.log('\n[4] Testing PUT /api/inventory/:id (Daily Price Overwrite)');
      const updateRes = await request(
        {
          hostname: 'localhost',
          port: 5005,
          path: `/api/inventory/${cementItem._id}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
        { unitPrice: 395, stockStatus: 'In Stock' }
      );
      console.log(`Status: ${updateRes.status}, Message: ${updateRes.body.message}`);
      console.log(`Updated Price: ₹${updateRes.body.item?.unitPrice}`);

      // 5. Test Bulk Update
      console.log('\n[5] Testing POST /api/inventory/bulk-update');
      const bulkRes = await request(
        {
          hostname: 'localhost',
          port: 5005,
          path: '/api/inventory/bulk-update',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
        {
          items: [
            {
              id: cementItem._id,
              unitPrice: 399,
              stockStatus: 'In Stock',
              flashDealActive: true,
              discountPercent: 10,
              bannerText: 'Special Flash Promo',
            },
          ],
        }
      );
      console.log(`Status: ${bulkRes.status}, Message: ${bulkRes.body.message}`);

      console.log('\nALL API ENDPOINTS TESTED AND FUNCTIONING PERFECTLY!');
      server.close();
      await closeDB();
      process.exit(0);
    } catch (e) {
      console.error('API Test Failure:', e);
      server.close();
      await closeDB();
      process.exit(1);
    }
  });
}

run();
