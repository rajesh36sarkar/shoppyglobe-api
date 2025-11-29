
/**
 * Simple seed script to create sample products and an example user.
 * Run with: npm run seed
 */
require('dotenv').config();
import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shoppyglobe';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  await Product.deleteMany({});
  await User.deleteMany({});

  const products = [
    { name: 'Wireless Mouse', price: 499, description: 'Ergonomic wireless mouse', stock: 50 },
    { name: 'Mechanical Keyboard', price: 2499, description: 'RGB mechanical keyboard', stock: 30 },
    { name: 'Noise-cancelling Headphones', price: 5999, description: 'Over-ear ANC headphones', stock: 15 }
  ];

  await Product.insertMany(products);
  console.log('Inserted products');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const user = new User({ name: 'Test User', email: 'test@example.com', passwordHash });
  await user.save();
  console.log('Created test user: test@example.com / password123');

  await mongoose.disconnect();
  console.log('Seed finished');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
