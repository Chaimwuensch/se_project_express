const ClothingItem = require('../models/clothingItem');

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then(items => res.send({ data: items }))
    .catch(err => {
      console.error(err);
      res.status(500).send({ message: 'Server error' });
    });
};

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

// PUT /items/:itemId/likes
module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add if not already there
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Item with the specified ID not found' });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Invalid item ID' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

// DELETE /items/:itemId/likes
module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove from array
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Item with the specified ID not found' });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Invalid item ID' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

module.exports = { getClothingItems};
