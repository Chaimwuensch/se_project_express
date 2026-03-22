const ClothingItem = require('../models/clothingItem');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');

// GET /items
const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => next(err));
};

// POST /items
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data passed to create an item'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};

// DELETE /items/:itemId
const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        return next(new ForbiddenError('You do not have permission to delete this item'));
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) =>
        res.send(deletedItem)
      );
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item with the specified ID not found'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};

// PUT /items/:itemId/likes
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item with the specified ID not found'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};

// DELETE /items/:itemId/likes
const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item with the specified ID not found'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID'));
      }
      return next(new InternalServerError('An error has occurred on the server'));
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
