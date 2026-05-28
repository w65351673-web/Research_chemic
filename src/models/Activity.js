/**
 * Activity Model
 * Stores all visitor activities, logins, and page views for admin tracking
 */

import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['visitor', 'user-login', 'page-view', 'new-order', 'new-user'],
    },
    message: {
      type: String,
      required: true,
    },
    page: {
      type: String,
    },
    user: {
      email: String,
      name: String,
      id: String,
    },
    location: {
      ip: String,
      country: String,
      city: String,
      region: String,
      latitude: Number,
      longitude: Number,
    },
    userAgent: {
      type: String,
    },
    device: {
      type: {
        type: String,
      },
      browser: String,
      os: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1 });
activitySchema.index({ read: 1 });
activitySchema.index({ 'user.email': 1 });

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;
