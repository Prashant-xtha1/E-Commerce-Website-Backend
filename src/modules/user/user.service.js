const UserModel = require("./user.model");

class UserService {
  async storeUser(data) {
    try {
      const user = new UserModel(data);
      return await user.save();
    } catch (exception) {
      throw exception;
    }
  }

  getPublicProfileOfUser(user) {
    const userObj = {
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      status: user.status,
      _id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return userObj;
  }
}

const userService = new UserService();
module.exports = userService;
