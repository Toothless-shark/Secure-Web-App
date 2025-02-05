import sys
import os

# Ajouter le répertoire parent au chemin de recherche des modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from app import app
from models import db
from routes.users import users_bp  # Importer le Blueprint

# Créer un client Flask pour tester
@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_db.sqlite'  # Base de données test
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    with app.app_context():
        db.create_all()  # Crée les tables avant chaque test
    with app.test_client() as client:
        yield client
    with app.app_context():
        db.drop_all()  # Supprime les tables après les tests

# Test pour créer un utilisateur
def test_create_user(client):
    response = client.post("/users", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    })
    assert response.status_code == 201
    assert b"User created" in response.data

# Test pour récupérer tous les utilisateurs
def test_get_users(client):
    # Créer un utilisateur d'abord
    client.post("/users", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    })
    response = client.get("/users")
    assert response.status_code == 200
    assert b"testuser" in response.data

# Test pour récupérer un utilisateur spécifique
def test_get_user(client):
    # Créer un utilisateur d'abord
    response_create = client.post("/users", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    })
    user_id = 1
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert b"testuser" in response.data

# Test pour mettre à jour un utilisateur
def test_update_user(client):
    # Créer un utilisateur d'abord
    response_create = client.post("/users", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    })
    user_id = 1
    response = client.put(f"/users/{user_id}", json={
        "username": "updateduser",
        "email": "updateduser@example.com"
    })
    assert response.status_code == 200
    assert b"User updated" in response.data

    # Vérifier la mise à jour
    response = client.get(f"/users/{user_id}")
    assert b"updateduser" in response.data

# Test pour supprimer un utilisateur
def test_delete_user(client):
    # Créer un utilisateur d'abord
    response_create = client.post("/users", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    })
    user_id = 1
    response = client.delete(f"/users/{user_id}")
    assert response.status_code == 200
    assert b"User deleted" in response.data

    # Vérifier que l'utilisateur a été supprimé
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 404
    assert b"User not found" in response.data
