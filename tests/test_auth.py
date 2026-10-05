import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app, db


@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

    with app.test_client() as client:
        with app.app_context():
            db.drop_all()
            db.create_all()

        yield client


def test_home(client):
    response = client.get("/")
    assert response.status_code == 200


def test_register(client):
    response = client.post(
        "/register",
        json={
            "username": "testuser",
            "password": "password123"
        }
    )

    assert response.status_code == 201


def test_login(client):
    client.post(
        "/register",
        json={
            "username": "testuser",
            "password": "password123"
        }
    )

    response = client.post(
        "/login",
        json={
            "username": "testuser",
            "password": "password123"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "access_token" in data