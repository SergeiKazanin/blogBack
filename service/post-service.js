const postSchema = require("../models/Post");

class PostService {
  async createPost(title, text, tags, imageUrl, user) {
    const post = await postSchema.create({
      title,
      text,
      tags,
      user: user.id,
      imageUrl,
    });
    return post;
  }
  async getAll() {
    const post = await postSchema.find();
    return post;
  }
  async getOne() {}
  async delPost() {}
  async updatePost() {}
}

module.exports = new PostService();
