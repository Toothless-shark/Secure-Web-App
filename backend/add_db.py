from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'  # Base SQLite locale
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Désactiver les avertissements inutiles

db.init_app(app)

if __name__ == '__main__':
    with app.app_context():
        # Ajouter un utilisateur
        user = User(username="TestUser", email="test@example.com", password="hashed_password", role="user")
        db.session.add(user)  # Ajouter l'utilisateur à la session
        db.session.commit()   # Valider l'ajout dans la base

        print(f"Utilisateur {user.username} ajouté avec succès !")

