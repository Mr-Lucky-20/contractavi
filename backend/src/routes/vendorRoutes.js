import { Router } from 'express';
import { getNearestVendors, getVendorById, rateVendor } from '../controllers/vendorController.js';

const router = Router();

router.get('/nearest', getNearestVendors);
router.get('/:id', getVendorById);
router.post('/:id/rate', rateVendor);

export default router;
