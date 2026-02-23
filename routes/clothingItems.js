const express = require('express');
const router = express.Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

router.get('/', clothingController.getClothingItems);
router.post('/', clothingController.createClothingItem);
router.delete('/:itemId', clothingController.deleteClothingItem);
router.put('/:itemId/likes', clothingController.likeItem);
router.delete('/:itemId/likes', clothingController.dislikeItem);

module.exports = router;
