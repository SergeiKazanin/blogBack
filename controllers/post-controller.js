const { validationResult } = require("express-validator");
const postService = require("../service/post-service");

class PostController {
  async createPost(req, res, next) {
    try {
      const { title, text, tags, imageUrl } = req.body;
      const user = req.user;
      const post = await postService.createPost(
        title,
        text,
        tags,
        imageUrl,
        user
      );
      res.json(post);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const post = await postService.getAll();
      res.json(post);
    } catch (error) {}
  }
  async getOne(req, res, next) {
    try {
    } catch (error) {}
  }
  async delPost(req, res, next) {
    try {
    } catch (error) {}
  }
  async updatePost(req, res, next) {
    try {
    } catch (error) {}
  }
}

module.exports = new PostController();
