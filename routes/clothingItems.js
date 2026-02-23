const express = require('express');
const router = express.Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

router.get('/items', getClothingItems);
router.post('/items', createClothingItem);
router.delete('/items/:itemId', deleteClothingItem);
router.put('/items/:itemId/likes', likeItem);
router.delete('/items/:itemId/likes', dislikeItem);

module.exports = router;
