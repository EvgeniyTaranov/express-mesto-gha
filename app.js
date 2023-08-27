const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64eb5cb6c738cce165f40a8d',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: err.message });
  }
  return next(err);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports.createCard = (req) => {
  console.log(req.user._id);
};
