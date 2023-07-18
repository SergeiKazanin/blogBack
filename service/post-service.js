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
}

module.exports = new PostService();
