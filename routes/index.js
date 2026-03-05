const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', auth, usersRouter);
router.use('/items', clothingItemsRouter);

router.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

module.exports = router;
