const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  inputFeatures: {
    Area_Sqft: { type: Number, required: true },
    Facing: { type: String, required: true },
    Floor: { type: Number, required: true },
    Car_Parking_Sqft: { type: Number, required: true },
    Bedrooms: { type: Number, required: true }
  },
  predictedPrice: {
    type: Number,
    required: true
  },
  modelName: {
    type: String,
    required: true
  },
  predictionMetadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prediction', PredictionSchema);
