# 🔐 SecureToken API

A Flask-based REST API demonstrating secure user authentication using password hashing and JSON Web Tokens (JWT).

📌 Features

- User registration
- Secure password hashing
- User login
- JWT token generation
- Protected API endpoints
- JWT token expiration
- Duplicate username prevention
- Invalid login handling
- SQLite database
- Automated testing with pytest
- Postman API testing

## 🛠️ Technologies Used

- Python
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- SQLite
- Werkzeug
- python-dotenv
- pytest
- Postman

## 🔄 Authentication Flow

   text
User
  ↓
Register
  ↓
Password Hashed
  ↓
Login
  ↓
JWT Token Generated
  ↓
Send Token
  ↓
Protected Endpoint
  ↓
Valid Token → 200 OK
Expired/Invalid Token → 401 Unauthorized
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate user and generate JWT |
| GET | `/protected` | Access protected resource |
| GET | `/profile` | View authenticated user profile |

## 🔑 Example Registration

```json
{
    "username": "abhi",
    "password": "mypassword123"
}
```

## 🔐 Authentication

After successful login, the API generates a JWT access token.

The token is sent using:

```text
Authorization: Bearer <access_token>
```

Protected endpoints require a valid JWT.

## ⏱️ JWT Expiration

JWT tokens are configured to expire after a fixed period.

The project uses a normal expiration period of:

```text
15 minutes
```

Token expiration was also tested using a temporary 30-second expiration.

After expiration, the protected endpoint returns:

```text
401 Unauthorized
```

## 🧪 Automated Testing

Run:

```bash
pytest
```

Current test result:

```text
3 passed
```

The tests verify:

- API status
- User registration
- User login
- JWT token generation

## ▶️ How to Run

### 1. Create virtual environment

```powershell
python -m venv venv
```

### 2. Activate virtual environment

```powershell
venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
pip install -r requirements.txt
```

### 4. Create `.env`

Add:

```text
JWT_SECRET_KEY=your-secret-key
```

Do not upload `.env` to GitHub.

### 5. Run the application

```powershell
python app.py
```

The API will run at:

```text
http://127.0.0.1:5000
```

## 📂 Project Structure

```text
SecureTokenAPI/
│
├── app.py
├── requirements.txt
├── README.md
├── .env
├── .gitignore
│
├── tests/
│   └── test_auth.py
│
├── instance/
│   └── users.db
│
└── venv/
```

## 🚀 Future Improvements

- Refresh tokens
- Role-based authorization
- Rate limiting
- Password reset
- Email verification
- OAuth2 authentication
- PostgreSQL support
- Docker deployment
- Swagger/OpenAPI documentation

## 👨‍💻 Author

**Abhishek G V**

Built as a learning project to understand REST APIs, authentication, JWT, password security, databases, and automated testing.