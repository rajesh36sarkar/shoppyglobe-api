
# ShoppyGlobe API

Backend API for ShoppyGlobe built with Node.js, Express, MongoDB and JWT authentication.

git repo - https://github.com/rajesh36sarkar/shoppyglobe-api

## Features
- Products endpoints:
  - GET /api/products
  - GET /api/products/:id
- Cart endpoints (protected — require Authorization Bearer token):
  - POST /api/cart  { productId, quantity }
  - PUT /api/cart/:id  { quantity } (set to 0 to remove)
  - DELETE /api/cart/:id
  - GET /api/cart
- Authentication:
  - POST /api/auth/register { name, email, password }
  - POST /api/auth/login { email, password } -> returns JWT token

## Setup (local)
1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and edit `MONGO_URI` and `JWT_SECRET`.
3. Start MongoDB (e.g., `mongod` or use MongoDB Atlas).
4. Seed sample data:
   ```
   npm run seed
   ```
5. Start the server:
   ```
   npm run dev
   ```
6. Use ThunderClient / Postman to test endpoints. See `thunder_collection.json` for sample requests.

## ThunderClient testing (example)
- Register: POST /api/auth/register
- Login: POST /api/auth/login -> copy token
- Use Header: Authorization: Bearer <token> to call cart endpoints.

## Notes about submission requirements
- Include screenshots of your MongoDB collections: use MongoDB Compass or Atlas UI, take screenshots of `products` and `cart` collections after seeding.
- The project contains comments in the source files and basic validation/error handling.
