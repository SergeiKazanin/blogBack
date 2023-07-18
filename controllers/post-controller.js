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
}

module.exports = new PostController();
