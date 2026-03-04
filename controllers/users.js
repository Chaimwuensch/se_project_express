const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  CONFLICT_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

// GET /users
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

// GET /users/me
module.exports.getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'User with the specified ID not found' });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Invalid user ID' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

// POST /users
module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "The 'email' and 'password' fields are required" });
  }

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({ name, avatar, email, password: hashedPassword }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
      return;
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: 'Email already in use' });
      }
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Invalid data passed to create a user' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

// POST /signin
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR)
      .send({ message: "The 'email' and 'password' fields are required" });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
      return;
    })
    .catch(() => {
      res
        .status(UNAUTHORIZED_ERROR)
        .send({ message: 'Incorrect email or password' });
    });
};

// PATCH /users/me
module.exports.updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(_id, { name, avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'User with the specified ID not found' });
      }
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Invalid data passed to update user' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};
