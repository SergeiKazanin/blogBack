const jwt = require("jsonwebtoken");
const tokenSchema = require("../models/Token");
class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "10d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await tokenSchema.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = tokenSchema.create({ user: userId, refreshToken });
    return token;
  }
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  async removeToken(refreshToken) {
    const tokenData = tokenSchema.deleteOne({ refreshToken });
    return tokenData;
  }
  async findToken(refreshToken) {
    const tokenData = tokenSchema.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
