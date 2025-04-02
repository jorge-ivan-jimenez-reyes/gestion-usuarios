const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const logger = require('../config/logger');

class UserService {
  async registerUser(username, email, password) {
    logger.info(`Attempting to register new user: ${username}`);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userModel.createUser(username, email, hashedPassword);
      logger.info(`User registered successfully: ${username}`);
      return newUser;
    } catch (error) {
      logger.error(`Error registering user ${username}:`, error);
      throw error;
    }
  }

  async authenticateUser(email, password) {
    logger.info(`Attempting to authenticate user: ${email}`);
    try {
      const user = await userModel.getUserByEmail(email);
      if (!user) {
        logger.warn(`Authentication failed: User not found for email ${email}`);
        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        logger.warn(`Authentication failed: Invalid password for user ${email}`);
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      logger.info(`User authenticated successfully: ${email}`);
      return { token, userId: user.id };
    } catch (error) {
      logger.error(`Error authenticating user ${email}:`, error);
      throw error;
    }
  }

  async updateUserProfile(userId, updatedFields) {
    logger.info(`Attempting to update profile for user ID: ${userId}`);
    try {
      if (updatedFields.password) {
        updatedFields.password = await bcrypt.hash(updatedFields.password, 10);
      }
      const updatedUser = await userModel.updateUser(userId, updatedFields);
      logger.info(`Profile updated successfully for user ID: ${userId}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating profile for user ID ${userId}:`, error);
      throw error;
    }
  }
}

module.exports = new UserService();
