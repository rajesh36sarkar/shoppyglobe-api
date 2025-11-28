
const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Protect all cart routes
router.use(auth);

// POST /api/cart - add product to cart
router.post('/',
  body('productId').isMongoId(),
  body('quantity').isInt({ min: 1 }).optional().toInt(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { productId, quantity = 1 } = req.body;
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      if (product.stock < quantity) return res.status(400).json({ error: 'Not enough stock' });

      let item = await CartItem.findOne({ user: req.user.userId, product: productId });
      if (item) {
        item.quantity += quantity;
      } else {
        item = new CartItem({ user: req.user.userId, product: productId, quantity });
      }
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      // duplicate key (unique index) handled
      if (err.code === 11000) return res.status(409).json({ error: 'Item already exists in cart' });
      next(err);
    }
  });

// PUT /api/cart/:id - update quantity
router.put('/:id',
  param('id').isMongoId(),
  body('quantity').isInt({ min: 0 }).toInt(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { quantity } = req.body;
      const item = await CartItem.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Cart item not found' });
      if (item.user.toString() !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });

      if (quantity === 0) {
        await item.remove();
        return res.json({ message: 'Item removed' });
      }

      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      if (product.stock < quantity) return res.status(400).json({ error: 'Not enough stock' });

      item.quantity = quantity;
      await item.save();
      res.json(item);
    } catch (err) {
      next(err);
    }
  });

// DELETE /api/cart/:id - remove
router.delete('/:id', param('id').isMongoId(), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });
    if (item.user.toString() !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });
    await item.remove();
    res.json({ message: 'Removed' });
  } catch (err) {
    next(err);
  }
});

// GET /api/cart - list user's cart items
router.get('/', async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user.userId }).populate('product');
    res.json(items);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
