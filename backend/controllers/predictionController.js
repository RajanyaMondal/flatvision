const Prediction = require('../models/Prediction');
const axios = require('axios');

// @desc    Create a new prediction
// @route   POST /api/predictions
// @access  Private
exports.createPrediction = async (req, res, next) => {
  try {
    const { Area_Sqft, Facing, Floor, Car_Parking_Sqft, Bedrooms } = req.body;
    
    // Basic validation
    if (Area_Sqft === undefined || Facing === undefined || Floor === undefined || Car_Parking_Sqft === undefined || Bedrooms === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (Area_Sqft, Facing, Floor, Car_Parking_Sqft, Bedrooms)' });
    }

    if (Area_Sqft <= 0) return res.status(400).json({ success: false, message: 'Area must be positive' });
    if (Floor < 0) return res.status(400).json({ success: false, message: 'Floor number cannot be negative' });
    if (Car_Parking_Sqft < 0) return res.status(400).json({ success: false, message: 'Car Parking area cannot be negative' });
    if (Bedrooms <= 0) return res.status(400).json({ success: false, message: 'Bedrooms count must be positive' });

    const propertyData = {
      Area_Sqft, Facing, Floor, Car_Parking_Sqft, Bedrooms
    };

    // Forward request to ML Service
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    let mlResponse;
    try {
      mlResponse = await axios.post(`${mlServiceUrl}/predict`, propertyData);
    } catch (error) {
      console.error('ML Service Error:', error.message);
      return res.status(503).json({ success: false, message: 'Prediction service is currently unavailable. Please try again.' });
    }

    const { predicted_price, model_name, metadata } = mlResponse.data;

    // Save prediction to database
    const prediction = await Prediction.create({
      user: req.user.id,
      inputFeatures: propertyData,
      predictedPrice: predicted_price,
      modelName: model_name,
      predictionMetadata: metadata
    });

    res.status(201).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all predictions for logged in user
// @route   GET /api/predictions
// @access  Private
exports.getPredictions = async (req, res, next) => {
  try {
    const predictions = await Prediction.find({ user: req.user.id }).sort('-createdAt');
    res.json({
      success: true,
      count: predictions.length,
      data: predictions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prediction
// @route   GET /api/predictions/:id
// @access  Private
exports.getPrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ success: false, message: 'Prediction not found' });
    }

    // Make sure user owns prediction
    if (prediction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this prediction' });
    }

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete prediction
// @route   DELETE /api/predictions/:id
// @access  Private
exports.deletePrediction = async (req, res, next) => {
  try {
    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ success: false, message: 'Prediction not found' });
    }

    // Make sure user owns prediction
    if (prediction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this prediction' });
    }

    await prediction.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
