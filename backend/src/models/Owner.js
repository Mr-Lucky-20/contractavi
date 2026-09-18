import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ownerSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    physicalAddress: {
      type: String,
      required: [true, 'Physical address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
      default: '',
    },
    operationalRadiusKm: {
      type: Number,
      default: 35,
      min: 1,
      max: 200,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    deliveryVehicleAvailable: {
      type: Boolean,
      default: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (coords) =>
            Array.isArray(coords) &&
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 &&
            coords[1] >= -90 &&
            coords[1] <= 90,
          message: 'Invalid [lng, lat] coordinates',
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

ownerSchema.index({ location: '2dsphere' });

ownerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

ownerSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Owner = mongoose.model('Owner', ownerSchema);
