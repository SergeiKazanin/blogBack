const postSchema = require("../models/Post");
const ApiError = require("../exeptions/api-error");

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
    const posts = await postSchema
      .find()
      .sort({ createdAt: -1 })
      .populate("user", ["email", "fullName"])
      .exec();
    return posts;
  }
  async getOne(id) {
    const post = await postSchema
      .findOneAndUpdate(
        { _id: id },
        { $inc: { viewsCount: 1 } },
        { returnDocument: "after" }
      )
      .populate("user", ["email", "fullName"])
      .exec();
    return post;
  }
  async delPost(id) {
    const post = await postSchema.findOneAndDelete({ _id: id });
    return post;
  }
  async updatePost(id, title, text, tags, imageUrl, user) {
    const post = await postSchema.updateOne(
      { _id: id },
      {
        title,
        text,
        tags,
        user: user.id,
        imageUrl,
      }
    );
    return post;
  }
}

module.exports = new PostService();
