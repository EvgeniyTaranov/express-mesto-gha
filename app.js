const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth'); // Импорт мидлвэра для авторизации
const { login, createUser } = require('./controllers/users'); // Импорт контроллеров

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use('/users', userRouter);
app.use('/cards', cardRouter);

// Обработчики для /signin и /signup
app.post('/signin', login);
app.post('/signup', createUser);

// Мидлвэр для авторизации
app.use(auth);

app.use(errorHandler);

app.listen(PORT, () => {
});
