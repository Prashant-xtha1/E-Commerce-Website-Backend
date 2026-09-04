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

  async getSingleUserByFilter(filter){
    try {
      const user = await UserModel.findOne(filter);
      return user;
    } catch (exception) {
      throw exception;
    }
  }

  async getAllUsersByFilter (filter, config) {
    try {
      const skip = (config.page - 1) * config.limit;
      const data = await UserModel.find(filter)
      .sort({"name": "asc"})
      .skip(skip)
      .limit(config.limit)

      const total = await UserModel.countDocuments(filter);

      return {
        data: data.map(user => this.getPublicProfileOfUser(user)),
        pagination: {
          page: +config.page,
          limit: +config.limit,
          total: total,
          noOfPages: Math.ceil(total/config.limit)
        }
      }

    } catch (exception) {
      throw exception;
    }
  }

  async updateSingleRowByFilter(filter, data){
    try {
      const update = await UserModel.findOneAndUpdate(filter, {$set: data}, {new: true})
      return update;
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
