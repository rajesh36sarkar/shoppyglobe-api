
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { body, param, validationResult } = require('express-validator');

// GET /api/products - list products (with optional ?q & ?limit)
router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q ? { name: new RegExp(req.query.q, 'i') } : {};
    const limit = parseInt(req.query.limit) || 100;
    const products = await Product.find(q).limit(limit);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - get product by ID
router.get('/:id', param('id').isMongoId(), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
