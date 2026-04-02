"""
Test the login API endpoint directly
"""
import requests
import json

API_URL = "http://localhost:8000"

print("=" * 60)
print("Testing Login API Endpoint")
print("=" * 60)

# Test credentials
email = input("\nEnter email: ").strip()
password = input("Enter password: ").strip()

print(f"\nTesting login with:")
print(f"  Email/Username: {email}")
print(f"  Password: {'*' * len(password)}")

# Make login request
try:
    print(f"\nSending POST request to {API_URL}/api/auth/login")
    response = requests.post(
        f"{API_URL}/api/auth/login",
        json={"username": email, "password": password},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\nResponse Status: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        print("\n✅ LOGIN SUCCESSFUL!")
        data = response.json()
        print(f"\nAccess Token: {data.get('access_token', 'N/A')[:50]}...")
        print(f"User ID: {data.get('user', {}).get('id')}")
        print(f"Username: {data.get('user', {}).get('username')}")
        print(f"Email: {data.get('user', {}).get('email')}")
    else:
        print("\n❌ LOGIN FAILED!")
        try:
            error_data = response.json()
            print(f"Error: {json.dumps(error_data, indent=2)}")
        except:
            print(f"Error: {response.text}")
            
except requests.exceptions.ConnectionError:
    print("\n❌ CONNECTION ERROR!")
    print("Backend server is not running.")
    print("\nPlease start the backend server:")
    print("  cd backend")
    print("  python -m uvicorn main:app --reload")
    
except Exception as e:
    print(f"\n❌ UNEXPECTED ERROR!")
    print(f"Error: {str(e)}")

print("\n" + "=" * 60)
