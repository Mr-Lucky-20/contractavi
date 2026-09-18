import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: [true, 'Owner reference is required'],
      index: true,
    },
    materialType: {
      type: String,
      required: [true, 'Material type is required'],
      enum: ['Cement', 'Steel/Saria', 'Bricks', 'Sand', 'Aggregate'],
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand or Grade description is required'],
      trim: true,
    },
    spec: {
      type: String,
      trim: true,
      default: '',
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit measurement is required'],
      trim: true,
      default: 'Bag (50kg)',
    },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Limited Stock', 'Out of Stock', 'Bulk Available'],
      default: 'In Stock',
    },
    minOrderQty: {
      type: Number,
      default: 10,
    },
    flashDeal: {
      active: {
        type: Boolean,
        default: false,
      },
      discountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 80,
      },
      bannerText: {
        type: String,
        default: '',
      },
    },
    lastUpdatedTimestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for instant price lookups by owner and material
inventorySchema.index({ ownerId: 1, materialType: 1 });

export const Inventory = mongoose.model('Inventory', inventorySchema);
