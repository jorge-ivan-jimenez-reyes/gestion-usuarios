const userService = require('../services/userService');

class UserController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const userId = await userService.registerUser(username, email, password);
      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, userId } = await userService.authenticateUser(email, password);
      res.json({ token, userId });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id; // Assuming we have middleware to extract user from token
      const updatedFields = req.body;
      const updatedUser = await userService.updateUserProfile(userId, updatedFields);
      res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
