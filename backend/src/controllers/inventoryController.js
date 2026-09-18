import { z } from 'zod';
import { Inventory } from '../models/Inventory.js';

export const singlePriceUpdateSchema = z.object({
  unitPrice: z.number().min(0.01),
  stockStatus: z.enum(['In Stock', 'Limited Stock', 'Out of Stock', 'Bulk Available']).optional(),
  brand: z.string().min(1).max(100).optional(),
  spec: z.string().max(200).optional(),
  unit: z.string().max(50).optional(),
  minOrderQty: z.number().min(1).optional(),
  flashDeal: z
    .object({
      active: z.boolean(),
      discountPercent: z.number().min(0).max(80),
      bannerText: z.string().max(100).optional(),
    })
    .optional(),
});

export const addInventoryItemSchema = z.object({
  materialType: z.string().min(2).max(50),
  brand: z.string().min(2).max(100),
  spec: z.string().min(2).max(200),
  unitPrice: z.number().min(0.01),
  unit: z.string().min(1).max(50),
  stockStatus: z.enum(['In Stock', 'Limited Stock', 'Out of Stock', 'Bulk Available']).default('In Stock'),
  minOrderQty: z.number().min(1).default(1),
  flashDeal: z
    .object({
      active: z.boolean().default(false),
      discountPercent: z.number().min(0).max(80).default(0),
      bannerText: z.string().max(100).optional(),
    })
    .optional(),
});

export const bulkPriceUpdateSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      unitPrice: z.number().min(0.01),
      stockStatus: z.enum(['In Stock', 'Limited Stock', 'Out of Stock', 'Bulk Available']),
      flashDealActive: z.boolean().optional(),
      discountPercent: z.number().min(0).max(80).optional(),
      bannerText: z.string().optional(),
    })
  ),
});

export const updateSinglePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.owner._id;
    const updateData = req.body;

    const item = await Inventory.findOne({ _id: id, ownerId });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.unitPrice = updateData.unitPrice;
    if (updateData.stockStatus) item.stockStatus = updateData.stockStatus;
    if (updateData.brand) item.brand = updateData.brand;
    if (updateData.spec) item.spec = updateData.spec;
    if (updateData.unit) item.unit = updateData.unit;
    if (updateData.minOrderQty) item.minOrderQty = updateData.minOrderQty;
    if (updateData.flashDeal) item.flashDeal = updateData.flashDeal;

    item.lastUpdatedTimestamp = new Date();
    await item.save();

    return res.status(200).json({
      success: true,
      message: `${item.materialType} rate updated`,
      item,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const bulkUpdatePrices = async (req, res) => {
  try {
    const ownerId = req.owner._id;
    const { items } = req.body;
    const now = new Date();

    const updatePromises = items.map((it) => {
      const updateDoc = {
        unitPrice: it.unitPrice,
        stockStatus: it.stockStatus,
        lastUpdatedTimestamp: now,
      };

      if (it.flashDealActive !== undefined) {
        updateDoc.flashDeal = {
          active: it.flashDealActive,
          discountPercent: it.discountPercent || 0,
          bannerText: it.bannerText || '',
        };
      }

      return Inventory.findOneAndUpdate(
        { _id: it.id, ownerId },
        { $set: updateDoc },
        { new: true }
      );
    });

    const updated = await Promise.all(updatePromises);

    return res.status(200).json({
      success: true,
      timestamp: now.toISOString(),
      updatedItems: updated.filter(Boolean),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyInventory = async (req, res) => {
  try {
    const ownerId = req.owner._id;
    const items = await Inventory.find({ ownerId }).sort({ materialType: 1 });

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const addInventoryItem = async (req, res) => {
  try {
    const ownerId = req.owner._id;
    const {
      materialType,
      brand,
      spec,
      unitPrice,
      unit,
      stockStatus = 'In Stock',
      minOrderQty = 1,
      flashDeal,
    } = req.body;

    const newItem = await Inventory.create({
      ownerId,
      materialType,
      brand,
      spec,
      unitPrice: parseFloat(unitPrice),
      unit,
      stockStatus,
      minOrderQty: parseInt(minOrderQty, 10) || 1,
      flashDeal: flashDeal || { active: false, discountPercent: 0, bannerText: '' },
      lastUpdatedTimestamp: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: `${materialType} successfully added to yard inventory.`,
      item: newItem,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.owner._id;

    const deleted = await Inventory.findOneAndDelete({ _id: id, ownerId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Material not found or access denied.' });
    }

    return res.status(200).json({
      success: true,
      message: `${deleted.materialType} removed from yard listing.`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
