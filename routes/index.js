const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');
const NotFoundError = require('../errors/NotFoundError');
const { validateLogin, validateCreateUser } = require('../middlewares/validation');

router.post(
  '/signin',
  validateLogin,
  login
);

router.post(
  '/signup',
  validateCreateUser,
  createUser
);

router.use('/users', auth, usersRouter);
router.use('/items', clothingItemsRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
