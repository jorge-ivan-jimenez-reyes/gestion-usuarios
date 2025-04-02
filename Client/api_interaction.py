import requests
import json

BASE_URL = "http://localhost:3000/api"  # Adjust this if your API is hosted elsewhere

def register_user(username, email, password):
    url = f"{BASE_URL}/users/register"
    data = {
        "username": username,
        "email": email,
        "password": password
    }
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error registering user: {e}")
        return None

def login_user(email, password):
    url = f"{BASE_URL}/users/login"
    data = {
        "email": email,
        "password": password
    }
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error logging in: {e}")
        return None

def get_user_profile(user_id, token):
    url = f"{BASE_URL}/users/{user_id}"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user profile: {e}")
        return None

def main():
    while True:
        print("\n1. Register a new user")
        print("2. Login")
        print("3. Get user profile")
        print("4. Exit")
        choice = input("Enter your choice (1-4): ")

        if choice == "1":
            username = input("Enter username: ")
            email = input("Enter email: ")
            password = input("Enter password: ")
            result = register_user(username, email, password)
            if result:
                print("User registered successfully:", json.dumps(result, indent=2))
            else:
                print("Failed to register user.")

        elif choice == "2":
            email = input("Enter email: ")
            password = input("Enter password: ")
            result = login_user(email, password)
            if result:
                print("Login successful:", json.dumps(result, indent=2))
            else:
                print("Login failed.")

        elif choice == "3":
            user_id = input("Enter user ID: ")
            token = input("Enter authentication token: ")
            result = get_user_profile(user_id, token)
            if result:
                print("User profile:", json.dumps(result, indent=2))
            else:
                print("Failed to fetch user profile.")

        elif choice == "4":
            print("Exiting...")
            break

        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
