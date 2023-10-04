const postService = require("../service/post-service");
const ApiError = require("../exeptions/api-error");

class PostController {
  async createPost(req, res, next) {
    try {
      const { title, text, tags, imageId } = req.body;
      const user = req.user;
      const post = await postService.createPost(
        title,
        text,
        tags,
        imageId,
        user
      );
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
  async getAll(req, res, next) {
    try {
      const posts = await postService.getAll();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }
  async getOne(req, res, next) {
    try {
      const id = req.params.id;
      const post = await postService.getOne(id);
      if (!post) {
        return next(ApiError.BadRequest("Пост не найден"));
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
  async delPost(req, res, next) {
    try {
      const id = req.params.id;
      const post = await postService.delPost(id);
      if (!post) {
        return next(ApiError.BadRequest("Пост не найден"));
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
  async updatePost(req, res, next) {
    const id = req.params.id;
    const { title, text, tags, imageId } = req.body;
    const user = req.user;
    const post = await postService.updatePost(
      id,
      title,
      text,
      tags,
      imageId,
      user
    );
    if (!post) {
      return next(ApiError.BadRequest("Пост не найден"));
    }
    res.json(post);
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
