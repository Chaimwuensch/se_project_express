const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingItems');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/wtwr_db');


app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133"
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/items', clothingItemsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
