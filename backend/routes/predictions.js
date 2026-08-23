const express = require('express');
const { createPrediction, getPredictions, getPrediction, deletePrediction } = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createPrediction)
  .get(protect, getPredictions);

router.route('/:id')
  .get(protect, getPrediction)
  .delete(protect, deletePrediction);

module.exports = router;
