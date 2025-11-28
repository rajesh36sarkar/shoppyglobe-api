
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const authRouter = require('./routes/auth');

app.use(express.json());

// routes
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/auth', authRouter);

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shoppyglobe';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
