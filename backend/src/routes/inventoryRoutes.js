import { Router } from 'express';
import {
  updateSinglePrice,
  bulkUpdatePrices,
  getMyInventory,
  addInventoryItem,
  deleteInventoryItem,
  singlePriceUpdateSchema,
  bulkPriceUpdateSchema,
  addInventoryItemSchema,
} from '../controllers/inventoryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { priceUpdateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Supplier inventory management routes
router.get('/', requireAuth, getMyInventory);
router.get('/my-inventory', requireAuth, getMyInventory);

// Add new specific material
router.post(
  '/',
  requireAuth,
  priceUpdateLimiter,
  validate(addInventoryItemSchema),
  addInventoryItem
);

// Bulk rate updates
router.post(
  '/bulk-update',
  requireAuth,
  priceUpdateLimiter,
  validate(bulkPriceUpdateSchema),
  bulkUpdatePrices
);

// Single material price overwrite
router.put(
  '/:id',
  requireAuth,
  priceUpdateLimiter,
  validate(singlePriceUpdateSchema),
  updateSinglePrice
);

// Remove material from yard
router.delete('/:id', requireAuth, deleteInventoryItem);

export default router;
