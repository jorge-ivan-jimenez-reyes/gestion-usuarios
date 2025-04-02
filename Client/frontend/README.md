# Frontend Application

This is the frontend application for the user management system.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Getting Started

1. Navigate to the frontend directory:
   ```
   cd Client/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`. You should see the login page.

## Testing the Login Functionality

1. Ensure that the backend server is running on `http://localhost:3000`.

2. On the login page, enter a valid email and password for a user that exists in your backend database.

3. Click the "Login" button.

4. If the login is successful, you should be redirected to the home page (which we haven't implemented yet, so you might see a blank page or a "page not found" error).

5. If the login fails, you should see an error message displayed on the login page.

## Next Steps

- Implement a home page or dashboard to redirect to after successful login
- Add user registration functionality
- Implement logout functionality
- Create protected routes that require authentication
