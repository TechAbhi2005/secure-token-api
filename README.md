# SecureTokenAPI – JWT-Based Authentication System

A web-based authentication application built using **Python, Flask, and JSON Web Tokens (JWT)**. The project demonstrates secure user registration, login, token generation, protected API access, and token expiration through an interactive web dashboard.

## 🌐 Live Demo

**Live Website:** https://secure-token-api-vfjn.onrender.com

**GitHub Repository:** https://github.com/TechAbhi2005/secure-token-api

> Note: The hosted application may take a little time to respond after being inactive on a free hosting plan.

## 📌 Project Overview

SecureTokenAPI demonstrates how token-based authentication works in a web application. Users can register with a username and password, log in to receive a JWT access token, and use that token to access protected endpoints.

The application includes a web interface that allows users to interact with authentication features without requiring a separate API testing tool.

## ✨ Features

- **User Registration:** Create an account using a username and password.
- **User Login:** Authenticate registered users.
- **JWT Authentication:** Generate an access token after successful login.
- **Protected API Endpoint:** Allow access to authorized users with a valid token.
- **Token Expiration:** Configure access tokens with a limited lifetime.
- **Live Expiry Countdown:** Display the remaining token lifetime on the dashboard.
- **Interactive Dashboard:** Test authentication features through a web interface.
- **Password Security:** Store passwords using password hashing.
- **Automated Testing:** Verify authentication functionality using pytest.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | Web application and API framework |
| Flask-JWT-Extended | JWT-based authentication |
| Flask-SQLAlchemy | Database integration |
| SQLite | Local database |
| HTML5 | Web page structure |
| CSS3 | Styling and animations |
| JavaScript | Dashboard interactions and countdown |
| Pytest | Automated testing |
| Git and GitHub | Version control and source code hosting |
| Render | Application deployment |


## 🔐 Authentication Workflow

1. A user registers with a username and password.
2. The application validates the submitted credentials.
3. The user logs in with the registered credentials.
4. The backend generates a JWT access token.
5. The client sends the token when requesting a protected endpoint.
6. The backend validates the token before granting access.
7. Expired or invalid tokens are rejected.

## 🔗 API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Display the web dashboard |
| `/register` | POST | Register a new user |
| `/login` | POST | Authenticate a user and obtain a JWT |
| `/protected` | GET | Access a protected resource using a valid JWT |
| `/profile` | GET | Access the authenticated user's profile, if available in the current implementation |

**Authentication requirement:** Protected endpoints require a valid access token in the format expected by Flask-JWT-Extended, typically:

`Authorization: Bearer <access_token>`

The token's expiration is enforced by the backend, not just by the dashboard countdown.

## 💻 Run the Project Locally

### Prerequisites

- Python 3.10 or later
- Git
- A code editor such as Visual Studio Code

### Step 1: Clone the repository

```bash
git clone https://github.com/TechAbhi2005/secure-token-api.git
cd secure-token-api
```

### Step 2: Create a virtual environment

**Windows:**

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use the appropriate execution-policy configuration for your environment or activate the environment from Command Prompt instead.

### Step 3: Install dependencies

```bash
python -m pip install -r requirements.txt
```

### Step 4: Configure environment variables

Set a unique JWT secret before running the application.

**PowerShell:**

```powershell
$env:JWT_SECRET_KEY = python -c "import secrets; print(secrets.token_hex(32))"
```

For repeated local development, you may use a local `.env` file if the application is configured to load it. Never commit secrets to GitHub.

### Step 5: Start the application

```bash
python app.py
```

Open the following address in your browser:

http://127.0.0.1:5000

## 🧪 Run Automated Tests

Run the test suite with:

```bash
python -m pytest -q
```

The current test suite previously reported **3 passed**. Run the command again to verify the result against your latest code.

## 🚀 Deployment

The application is hosted on Render.

**Deployment configuration:**

- **Repository:** `TechAbhi2005/secure-token-api`
- **Branch:** `main`
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `gunicorn app:app`
- **Environment variable:** `JWT_SECRET_KEY`

The JWT secret should be configured privately in Render's environment-variable settings.

### Database Considerations

The local application uses SQLite. The default filesystem of a hosted service may be ephemeral, so the database may not persist across restarts or redeployments unless persistent storage is configured. For a production deployment, consider using managed PostgreSQL and configuring appropriate database backups.

## 🔒 Security Considerations

- Never commit `.env` files or production secrets.
- Use a strong, randomly generated JWT signing key.
- Store passwords as secure hashes rather than plaintext.
- Validate tokens on the server for every protected request.
- Enforce token expiration on the backend.
- Use HTTPS for the deployed website.
- Use a persistent, appropriately secured database for production.
- Avoid logging passwords, access tokens, or other sensitive credentials.

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

- REST API development using Flask.
- User registration and authentication.
- JWT creation, validation, and expiration.
- Protected resources and authorization headers.
- Frontend-to-backend integration.
- Database integration.
- Automated testing with pytest.
- GitHub version control and cloud deployment.

## 🔮 Future Enhancements

- Migrate from SQLite to PostgreSQL for persistent hosted data.
- Add password-strength validation and login rate limiting.
- Add refresh-token support and token revocation.
- Expand automated security and integration tests.
- Improve monitoring and production error handling.
- Add email verification and password reset functionality.

## 👨‍💻 Author

**Abhishek G V**

GitHub: [TechAbhi2005](https://github.com/TechAbhi2005)

