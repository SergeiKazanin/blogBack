const bcrypt = require("bcrypt");

const userSchema = require("../models/User");
const uuid = require("uuid");
const mailService = require("../service/mail-service");
const tokenService = require("../service/token-servise");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exeptions/api-error");
class UserService {
  async registration(email, password, fullName) {
    const findEmail = await userSchema.findOne({ email });
    if (findEmail) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const salt = await bcrypt.genSalt(10);
    const Hash = await bcrypt.hash(password, salt);
    const activationLink = uuid.v4();
    const user = await userSchema.create({
      email,
      fullName,
      passwordHash: Hash,
      activationLink,
    });
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/auth/activate/${activationLink}`
    );
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
  async activate(activationLink) {
    const user = await userSchema.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Неверная ссылка активации");
    }
    user.isActivated = true;
    await user.save();
  }
  async login(email, password) {
    const user = await userSchema.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }
    const isPassEquals = await bcrypt.compare(password, user.passwordHash);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный логин или пароль");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UserService();
