const ClothingItem = require('../models/clothingItem');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then(items => res.send({ data: items }))
    .catch(err => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server error' });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then(item => res.send(item))
    .catch(err => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Item not found' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server error' });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then(item => res.send(item))
    .catch(err => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Item not found' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server error' });
    });
};

module.exports = {
  getClothingItems,
  likeItem,
  dislikeItem
};
