import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Owner } from '../models/Owner.js';
import { Inventory } from '../models/Inventory.js';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config();

export const initialSuppliers = [
  {
    storeName: 'Bhilai Ispat & TMT Steel Depot',
    contactPerson: 'Arunav Agrawal',
    contact: '+91 94252 88411',
    email: 'bhilai.steel@example.com',
    password: 'password123',
    physicalAddress: 'Plot 12-B, Light Industrial Area, Nandini Road, Bhilai',
    city: 'Bhilai',
    pincode: '490026',
    gstNumber: '22AABCI5542B1Z8',
    operationalRadiusKm: 60,
    rating: 4.9,
    reviewCount: 58,
    deliveryVehicleAvailable: true,
    location: {
      type: 'Point',
      coordinates: [81.3852, 21.2144], // Bhilai, CG
    },
    inventoryItems: [
      {
        materialType: 'Steel/Saria',
        brand: 'SAIL Bhilai Fe-550D TMT Rebar',
        spec: 'Primary Mill TMT (10mm, 12mm, 16mm, 20mm Bundles)',
        unitPrice: 58500,
        unit: 'Metric Ton',
        stockStatus: 'In Stock',
        minOrderQty: 1,
        flashDeal: { active: true, discountPercent: 5, bannerText: 'Direct Mill Clearance Rate' },
        hoursAgo: 1.2,
      },
      {
        materialType: 'Cement',
        brand: 'ACC Jamul Suraksha Cement',
        spec: 'Water-repellent anti-corrosion blended cement',
        unitPrice: 355,
        unit: 'Bag (50kg)',
        stockStatus: 'In Stock',
        minOrderQty: 50,
        hoursAgo: 1.2,
      },
      {
        materialType: 'Bricks',
        brand: 'Bhilai Kiln Red Bricks',
        spec: 'Heavy Density Kiln Fired Standard (9x4.25x2.75 in)',
        unitPrice: 8.5,
        unit: 'Per Piece',
        stockStatus: 'In Stock',
        minOrderQty: 2000,
        hoursAgo: 1.2,
      },
      {
        materialType: 'Sand',
        brand: 'Shivnath River Washed Sand',
        spec: 'Natural Coarse Sand Zone II for Masonry',
        unitPrice: 42,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 250,
        hoursAgo: 1.2,
      },
      {
        materialType: 'Aggregate',
        brand: 'Kumhari Black Granite Metal 20mm',
        spec: 'High Abrasion Resistance Aggregate for Slab RCC',
        unitPrice: 32,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 300,
        hoursAgo: 1.2,
      },
    ],
  },
  {
    storeName: 'Mahanadi Building Materials & UltraTech Hub',
    contactPerson: 'Suresh Chandra Sharma',
    contact: '+91 98271 22980',
    email: 'mahanadi.materials@example.com',
    password: 'password123',
    physicalAddress: 'Sector C, Sirgitti Industrial Area, Bilaspur',
    city: 'Bilaspur',
    pincode: '495004',
    gstNumber: '22AABCM4419C1Z3',
    operationalRadiusKm: 50,
    rating: 4.8,
    reviewCount: 44,
    deliveryVehicleAvailable: true,
    location: {
      type: 'Point',
      coordinates: [82.1285, 22.0456], // Bilaspur, CG
    },
    inventoryItems: [
      {
        materialType: 'Cement',
        brand: 'UltraTech Super PPC (Rawan Plant)',
        spec: 'Grade 53 Portland Pozzolana Cement Direct from Hirmi/Rawan',
        unitPrice: 348,
        unit: 'Bag (50kg)',
        stockStatus: 'In Stock',
        minOrderQty: 50,
        flashDeal: { active: true, discountPercent: 6, bannerText: 'Direct Bilaspur Yard Discount' },
        hoursAgo: 0.8,
      },
      {
        materialType: 'Steel/Saria',
        brand: 'Jindal Panther Fe-550D TMT',
        spec: 'Earthquake Resistant High Ductility Saria',
        unitPrice: 59200,
        unit: 'Metric Ton',
        stockStatus: 'In Stock',
        minOrderQty: 1,
        hoursAgo: 0.8,
      },
      {
        materialType: 'Bricks',
        brand: 'High-Density Fly Ash Eco Bricks',
        spec: 'Compressive Strength >8.5 N/mm² Precision Mould',
        unitPrice: 5.8,
        unit: 'Per Piece',
        stockStatus: 'In Stock',
        minOrderQty: 3000,
        hoursAgo: 0.8,
      },
      {
        materialType: 'Sand',
        brand: 'Mahanadi Basin Double Washed Sand',
        spec: 'Sieve Screened Concrete Plastering Sand',
        unitPrice: 44,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 200,
        hoursAgo: 0.8,
      },
      {
        materialType: 'Aggregate',
        brand: 'Crushed Blue Metal Basalt 20mm',
        spec: 'Machine Graded Stone for Foundation & Columns',
        unitPrice: 30,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 300,
        hoursAgo: 0.8,
      },
    ],
  },
  {
    storeName: 'Raipur Mega Cement & Infrastructure Depot',
    contactPerson: 'Pradeep Dewangan',
    contact: '+91 97555 33214',
    email: 'raipur.infra@example.com',
    password: 'password123',
    physicalAddress: 'Ring Road No. 2, Near Tatibandh Chowk, Raipur',
    city: 'Raipur',
    pincode: '492099',
    gstNumber: '22AACCR8810D1Z7',
    operationalRadiusKm: 55,
    rating: 4.8,
    reviewCount: 51,
    deliveryVehicleAvailable: true,
    location: {
      type: 'Point',
      coordinates: [81.5840, 21.2580], // Tatibandh, Raipur, CG
    },
    inventoryItems: [
      {
        materialType: 'Cement',
        brand: 'Ambuja Plus Roof Special (Bhatapara)',
        spec: 'Waterproofing Micro-Filler Cement',
        unitPrice: 352,
        unit: 'Bag (50kg)',
        stockStatus: 'In Stock',
        minOrderQty: 60,
        flashDeal: { active: true, discountPercent: 4, bannerText: 'Monsoon Saria + Cement Bundle' },
        hoursAgo: 2.1,
      },
      {
        materialType: 'Steel/Saria',
        brand: 'Real Ispat GK TMT 550D',
        spec: 'Thermex Treated High-Grip Rib Rebar',
        unitPrice: 57900,
        unit: 'Metric Ton',
        stockStatus: 'In Stock',
        minOrderQty: 2,
        hoursAgo: 2.1,
      },
      {
        materialType: 'Bricks',
        brand: 'AAC Lightweight Blocks (Urla Plant)',
        spec: '600x200x150 mm Thermal & Sound Insulating',
        unitPrice: 52,
        unit: 'Per Piece',
        stockStatus: 'In Stock',
        minOrderQty: 600,
        hoursAgo: 2.1,
      },
      {
        materialType: 'Sand',
        brand: 'Manufactured M-Sand Grade A',
        spec: 'IS 383 Zone II Triple Washed Sand',
        unitPrice: 38,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 250,
        hoursAgo: 2.1,
      },
      {
        materialType: 'Aggregate',
        brand: 'Mandhar Crushed Black Metal 10mm/20mm',
        spec: 'IS Standard Crushed Aggregate for Ready Mix',
        unitPrice: 31,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 300,
        hoursAgo: 2.1,
      },
    ],
  },
  {
    storeName: 'Korba Power Ash & Masonry Products',
    contactPerson: 'Kailash Verma',
    contact: '+91 98261 77334',
    email: 'korba.ash@example.com',
    password: 'password123',
    physicalAddress: 'Industrial Area, Near Transport Nagar, Korba',
    city: 'Korba',
    pincode: '495677',
    gstNumber: '22AAFFK1102E1ZX',
    operationalRadiusKm: 45,
    rating: 4.5,
    reviewCount: 22,
    deliveryVehicleAvailable: true,
    location: {
      type: 'Point',
      coordinates: [82.7210, 22.3512], // Korba, CG
    },
    inventoryItems: [
      {
        materialType: 'Bricks',
        brand: 'NTPC Certified High-Strength Fly Ash Bricks',
        spec: 'Uniform Dimension Heavy Bearing Class A (9x4x3 in)',
        unitPrice: 5.4,
        unit: 'Per Piece',
        stockStatus: 'In Stock',
        minOrderQty: 4000,
        flashDeal: { active: true, discountPercent: 8, bannerText: 'Bulk Site Trailer Rate' },
        hoursAgo: 1.5,
      },
      {
        materialType: 'Cement',
        brand: 'Nuvoco Duraguard Cement',
        spec: 'Anti-crack moisture resistant cement',
        unitPrice: 345,
        unit: 'Bag (50kg)',
        stockStatus: 'In Stock',
        minOrderQty: 50,
        hoursAgo: 1.5,
      },
      {
        materialType: 'Steel/Saria',
        brand: 'Jindal Steel & Power TMT 550D',
        spec: 'High yield stress Fe-550D Rebars',
        unitPrice: 58800,
        unit: 'Metric Ton',
        stockStatus: 'In Stock',
        minOrderQty: 1,
        hoursAgo: 1.5,
      },
      {
        materialType: 'Sand',
        brand: 'Hasdeo River Washed Sand',
        spec: 'Clean Natural River Sand for Plastering',
        unitPrice: 40,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 250,
        hoursAgo: 1.5,
      },
      {
        materialType: 'Aggregate',
        brand: 'Hard Quartzite Crushed Aggregate 20mm',
        spec: 'Graded stone metal for industrial flooring',
        unitPrice: 29,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 300,
        hoursAgo: 1.5,
      },
    ],
  },
  {
    storeName: 'Raigarh Steel & Regional Building Yard',
    contactPerson: 'Dharmendra Sahu',
    contact: '+91 94060 99120',
    email: 'raigarh.steel@example.com',
    password: 'password123',
    physicalAddress: 'Raigarh-Gharghoda Highway, Industrial Area, Raigarh',
    city: 'Raigarh',
    pincode: '496001',
    gstNumber: '22AAKPS3310M1Z2',
    operationalRadiusKm: 50,
    rating: 4.4,
    reviewCount: 19,
    deliveryVehicleAvailable: false,
    location: {
      type: 'Point',
      coordinates: [83.3850, 21.9050], // Raigarh, CG
    },
    inventoryItems: [
      {
        materialType: 'Steel/Saria',
        brand: 'JSPL Structural TMT & Girders',
        spec: 'Heavy TMT Saria (12mm, 16mm, 25mm, 32mm)',
        unitPrice: 57500,
        unit: 'Metric Ton',
        stockStatus: 'Limited Stock',
        minOrderQty: 2,
        hoursAgo: 72, // 3 days ago -> Triggers stale badge
      },
      {
        materialType: 'Cement',
        brand: 'Shree Cement Roofon PPC',
        spec: 'High early strength corrosion inhibitor',
        unitPrice: 340,
        unit: 'Bag (50kg)',
        stockStatus: 'Limited Stock',
        minOrderQty: 50,
        hoursAgo: 72, // 3 days ago -> Triggers stale badge
      },
      {
        materialType: 'Bricks',
        brand: 'Traditional Red Kiln Bricks',
        spec: 'Locally Fired Clay Bricks for Boundary & Partitions',
        unitPrice: 7.8,
        unit: 'Per Piece',
        stockStatus: 'In Stock',
        minOrderQty: 2000,
        hoursAgo: 72,
      },
      {
        materialType: 'Sand',
        brand: 'Kelo River Coarse Sand',
        spec: 'Masonry Grade Desilted Sand',
        unitPrice: 36,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 300,
        hoursAgo: 72,
      },
      {
        materialType: 'Aggregate',
        brand: 'Crushed Granite Metal 20mm',
        spec: 'Graded road ballast and concrete mix',
        unitPrice: 28,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 300,
        hoursAgo: 72,
      },
    ],
  },
];

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Starting Chhattisgarh database seed process...');
    await connectDB();

    // Clear existing data
    await Owner.deleteMany({});
    await Inventory.deleteMany({});
    console.log('[Seeder] Cleared previous collection records.');

    for (const supplier of initialSuppliers) {
      const { inventoryItems, ...ownerData } = supplier;

      // Save Owner (bcrypt hash runs via pre-save)
      const owner = await Owner.create(ownerData);

      // Prepare inventory with calculated timestamps
      const now = new Date();
      const inventoryDocs = inventoryItems.map((item) => {
        const { hoursAgo, ...rest } = item;
        const timestamp = new Date(now.getTime() - (hoursAgo || 0) * 3600 * 1000);
        return {
          ...rest,
          ownerId: owner._id,
          lastUpdatedTimestamp: timestamp,
        };
      });

      await Inventory.insertMany(inventoryDocs);
      console.log(`[Seeder] Seeded owner: "${owner.storeName}" (${owner.city}, CG) with ${inventoryDocs.length} materials.`);
    }

    console.log('[Seeder] Database successfully populated with Chhattisgarh construction marketplace data.');
  } catch (err) {
    console.error('[Seeder] Error during seed:', err);
  }
};

// Allow direct execution via CLI
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase().then(() => {
    closeDB().then(() => process.exit(0));
  });
}
