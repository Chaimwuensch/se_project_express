const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', auth, usersRouter);
router.use('/items', clothingItemsRouter);

module.exports = router;
