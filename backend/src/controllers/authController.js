import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Owner } from '../models/Owner.js';
import { Inventory } from '../models/Inventory.js';
import { validatePhoneNumber, validateEmail } from '../utils/validationHelpers.js';

export const registerOwnerSchema = z.object({
  storeName: z.string().min(2).max(100),
  contactPerson: z.string().min(2).max(100),
  contact: z.string().min(8).max(25),
  email: z.string().email(),
  password: z.string().min(6),
  physicalAddress: z.string().min(5),
  city: z.string().min(2),
  pincode: z.string().min(4).max(10),
  gstNumber: z.string().optional().default(''),
  operationalRadiusKm: z.number().min(1).max(200).optional().default(35),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const loginOwnerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_cg_2026';
  return jwt.sign({ id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const register = async (req, res) => {
  try {
    const data = req.body;

    const emailCheck = validateEmail(data.email);
    if (!emailCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: emailCheck.error,
      });
    }

    const phoneCheck = validatePhoneNumber(data.contact);
    if (!phoneCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: phoneCheck.error,
      });
    }

    const existing = await Owner.findOne({ email: emailCheck.email });
    if (existing) {
      const invCount = await Inventory.countDocuments({ ownerId: existing._id });
      if (invCount === 0) {
        await Owner.findByIdAndDelete(existing._id);
      } else {
        return res.status(409).json({
          success: false,
          message: 'Email already registered.',
        });
      }
    }

    const owner = await Owner.create({
      storeName: data.storeName,
      contactPerson: data.contactPerson,
      contact: phoneCheck.formatted,
      email: emailCheck.email,
      password: data.password,
      physicalAddress: data.physicalAddress,
      city: data.city,
      pincode: data.pincode,
      gstNumber: data.gstNumber || '',
      operationalRadiusKm: data.operationalRadiusKm || 35,
      rating: 0,
      reviewCount: 0,
      location: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude],
      },
    });

    const defaultMaterials = [
      {
        materialType: 'Cement',
        brand: 'UltraTech PPC Cement',
        spec: 'Grade 53 Portland Pozzolana Cement',
        unitPrice: 350,
        unit: 'Bag (50kg)',
        stockStatus: 'In Stock',
        minOrderQty: 50,
      },
      {
        materialType: 'Steel/Saria',
        brand: 'Fe-550D TMT Rebar',
        spec: 'High-Ductility TMT Rebars (10mm, 12mm, 16mm)',
        unitPrice: 58500,
        unit: 'Metric Ton',
        stockStatus: 'In Stock',
        minOrderQty: 1,
      },
      {
        materialType: 'Bricks',
        brand: 'Kiln Fired Red Bricks',
        spec: 'Standard Heavy Density (9x4.25x2.75 in)',
        unitPrice: 8.5,
        unit: 'Per Piece',
        stockStatus: 'In Stock',
        minOrderQty: 2000,
      },
      {
        materialType: 'Sand',
        brand: 'River Washed Sand',
        spec: 'Double-Washed Plastering Sand Zone II',
        unitPrice: 42,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 200,
      },
      {
        materialType: 'Aggregate',
        brand: 'Crushed Granite Metal 20mm',
        spec: 'Machine-Crushed Basalt Aggregate for Slab Casting',
        unitPrice: 32,
        unit: 'Cubic Foot (cu.ft)',
        stockStatus: 'In Stock',
        minOrderQty: 300,
      },
    ].map((m) => ({
      ...m,
      ownerId: owner._id,
      lastUpdatedTimestamp: new Date(),
    }));

    try {
      await Inventory.insertMany(defaultMaterials);
    } catch (invErr) {
      await Owner.findByIdAndDelete(owner._id);
      throw invErr;
    }

    const token = generateToken(owner._id);

    return res.status(201).json({
      success: true,
      token,
      owner: {
        id: owner._id,
        storeName: owner.storeName,
        contactPerson: owner.contactPerson,
        contact: owner.contact,
        email: owner.email,
        city: owner.city,
        pincode: owner.pincode,
        rating: 0,
        reviewCount: 0,
        operationalRadiusKm: owner.operationalRadiusKm,
        location: owner.location,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create account.',
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email: email.toLowerCase() }).select('+password');
    if (!owner) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const isMatch = await owner.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const token = generateToken(owner._id);

    return res.status(200).json({
      success: true,
      token,
      owner: {
        id: owner._id,
        storeName: owner.storeName,
        contactPerson: owner.contactPerson,
        contact: owner.contact,
        email: owner.email,
        physicalAddress: owner.physicalAddress,
        city: owner.city,
        pincode: owner.pincode,
        rating: owner.rating || 0,
        reviewCount: owner.reviewCount || 0,
        operationalRadiusKm: owner.operationalRadiusKm,
        location: owner.location,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: err.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const owner = req.owner;
    const inventory = await Inventory.find({ ownerId: owner._id }).sort({ materialType: 1 });

    return res.status(200).json({
      success: true,
      owner,
      inventory,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load profile.',
    });
  }
};
