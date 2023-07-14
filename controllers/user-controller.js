const userService = require("../service/user-service");
class UserController {
  async registration(req, res) {
    try {
      const { email, password, fullName } = req.body;
      const userData = await userService.registration(
        email,
        password,
        fullName
      );
      res.cookie("refreshToken", userData?.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (error) {
      console.log(error);
    }
  }
  async login(req, res) {
    try {
    } catch (error) {}
  }
  async logout(req, res) {
    try {
    } catch (error) {}
  }
  async activate(req, res) {
    try {
    } catch (error) {}
  }
  async refresh(req, res) {
    try {
    } catch (error) {}
  }
}

module.exports = new UserController();
