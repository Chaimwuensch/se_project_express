const router = require('express').Router();
const {
  getClothingItems,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

router.get('/items', getClothingItems);
router.put('/items/:itemId/likes', likeItem);
router.delete('/items/:itemId/likes', dislikeItem);

module.exports = router;
