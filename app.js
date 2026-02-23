const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingItems');
const { NOT_FOUND_ERROR } = require('./utils/errors'); // Add this import

const app = express();
const { PORT = 3001 } = process.env;

// Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

// Parse JSON bodies
app.use(express.json());

// Temporary mock user middleware
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // your test user id
  };
  next();
});

// Routes
app.use('/users', usersRouter);
app.use('/items', clothingItemsRouter);

// 404 handler (only once, after routes)
app.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
