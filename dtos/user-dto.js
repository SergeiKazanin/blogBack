module.exports = class UserDto {
  email;
  id;
  isActivated;
  fullName;
  createdAt;
  updatedAt;
  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.fullName = model.fullName;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
};
