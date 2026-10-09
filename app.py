from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from dotenv import load_dotenv
import os


# Load environment variables
load_dotenv()


# Create Flask application
app = Flask(__name__)


# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY",
    "development-secret-key"
)

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)


# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)


# User database model
class User(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.String(80),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )


# Create database tables
with app.app_context():
    db.create_all()


# Home endpoint
# Home endpoint - display the webpage
@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")


# Register endpoint
@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:

        return jsonify({
            "error": "Username and password are required"
        }), 400

    existing_user = User.query.filter_by(
        username=username
    ).first()

    if existing_user:

        return jsonify({
            "error": "Username already exists"
        }), 409

    hashed_password = generate_password_hash(password)

    user = User(
        username=username,
        password=hashed_password
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201


# Login endpoint
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(
        username=username
    ).first()

    if not user or not check_password_hash(
        user.password,
        password
    ):

        return jsonify({
            "error": "Invalid username or password"
        }), 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "Bearer",
        "expires_in": "15 minutes"
    }), 200


# Protected endpoint
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    return jsonify({
        "message": "You have accessed a protected endpoint",
        "user_id": user.id,
        "username": user.username
    }), 200


# Profile endpoint
@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    return jsonify({
        "id": user.id,
        "username": user.username
    }), 200


# Run application
if __name__ == "__main__":
    app.run(debug=True)