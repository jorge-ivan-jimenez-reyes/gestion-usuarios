const userService = require('../services/userService');
const { validationResult } = require('express-validator');

class UserController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;
      const userId = await userService.registerUser(username, email, password);
      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      if (error.code === 11000) { // MongoDB duplicate key error
        res.status(400).json({ error: 'Email already in use' });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const { token, userId } = await userService.authenticateUser(email, password);
      res.json({ token, userId });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;
      const updatedFields = req.body;
      const updatedUser = await userService.updateUserProfile(userId, updatedFields);
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      if (error.code === 11000) { // MongoDB duplicate key error
        res.status(400).json({ error: 'Email already in use' });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}

module.exports = new UserController();
