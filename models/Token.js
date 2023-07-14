const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
