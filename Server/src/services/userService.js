const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

class UserService {
  async registerUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await userModel.createUser(username, email, hashedPassword);
  }

  async authenticateUser(email, password) {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, userId: user.id };
  }

  async updateUserProfile(userId, updatedFields) {
    if (updatedFields.password) {
      updatedFields.password = await bcrypt.hash(updatedFields.password, 10);
    }
    return await userModel.updateUser(userId, updatedFields);
  }
}

module.exports = new UserService();
