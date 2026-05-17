const mongoose = require('mongoose');

const sessionTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  description: String
}, { timestamps: true });

// Create default session types
sessionTypeSchema.statics.createDefaults = async function() {
  const defaults = [
    { name: 'Demo Session', slug: 'demo', duration: 15, price: 0, isFree: true, description: 'Free 15-minute introduction session' },
    { name: 'Deep Session', slug: 'deep', duration: 60, price: 500, isFree: false, description: '1-hour detailed session' }
  ];
  
  for (const session of defaults) {
    await this.findOneAndUpdate(
      { slug: session.slug },
      session,
      { upsert: true, new: true }
    );
  }
};

module.exports = mongoose.model('SessionType', sessionTypeSchema);
