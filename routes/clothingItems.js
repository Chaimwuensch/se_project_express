// routes/clothingItems.js
const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

const {
  validateClothingItem,
  validateItemId,
} = require('../middlewares/validation');

router.get('/', getClothingItems);

router.post('/', auth, validateClothingItem, createClothingItem);
router.delete('/:itemId', auth, validateItemId, deleteClothingItem);
router.put('/:itemId/likes', auth, validateItemId, likeItem);
router.delete('/:itemId/likes', auth, validateItemId, dislikeItem);

module.exports = router;
