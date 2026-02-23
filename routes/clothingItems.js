const express = require('express');
const router = express.Router();


const clothingController = require('../controllers/clothingItems');

router.get('/items', clothingController.getClothingItems);
router.put('/items/:itemId/likes', clothingController.likeItem);
router.delete('/items/:itemId/likes', clothingController.dislikeItem);

module.exports = router;
