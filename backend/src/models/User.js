import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default: 'Site Contractor',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    savedVendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
      },
    ],
    // Ephemeral last known city or area preference (Transient telemetry policy: GPS coordinates are NOT persisted to DB)
    preferredCity: {
      type: String,
      default: 'Mumbai',
    },
    preferredPincode: {
      type: String,
      default: '400001',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
