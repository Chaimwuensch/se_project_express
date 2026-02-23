const express = require('express');
const router = express.Router();

// Import ALL controller methods
const clothingController = require('../controllers/clothingItems');

// Define routes using dot notation (no destructuring)
router.get('/items', clothingController.getClothingItems);
router.put('/items/:itemId/likes', clothingController.likeItem);
router.delete('/items/:itemId/likes', clothingController.dislikeItem);

module.exports = router;
