import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  image: String,
});

// Create model
const Product = mongoose.model("Product", productSchema);

// Export default (only one export)
export default Product;
