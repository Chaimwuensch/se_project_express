const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const { JWT_SECRET } = require('../utils/config');
const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
// GET /users/me
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('User with the specified ID not found'));
      }

      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid user ID'));
      }

      return next(new InternalServerError('An error has occurred on the server'));
    });
};

// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    name, avatar, email, password,
  } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) => User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('A user with this email already exists'));
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data passed to create a user'));
      }

      return next(new InternalServerError('An error has occurred on the server'));
    });
};

// POST /signin
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      return res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Incorrect email or password')));
};

// PATCH /users/me
module.exports.updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('User with the specified ID not found'));
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data passed to update user'));
      }

      return next(new InternalServerError('An error has occurred on the server'));
    });
};
