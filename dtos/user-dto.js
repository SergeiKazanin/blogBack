module.exports = class UserDto {
  email;
  id;
  isActivated;
  user;
  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.user = model.user;
  }
};
