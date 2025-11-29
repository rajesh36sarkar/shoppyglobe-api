import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    // store one valid refresh token (rotate on refresh)
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.userId) {
    this.userId = "USER-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
  }
  next();
});

export default mongoose.model("User", userSchema);
