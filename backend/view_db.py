import os
from models import db, User
from flask import Flask

# Créer l'application Flask
app = Flask(__name__)

# Configurer la base de données (ici SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser la base de données avec l'application Flask
db.init_app(app)

# Cette fonction s'assure de récupérer et d'afficher le contenu de la table User
def create_tables():
    with app.app_context():
        db.create_all()  # Crée toutes les tables définies dans les modèles

def add_user():
    with app.app_context():
        # Ajouter un utilisateur
        user = User(username="TestUser", email="test@example.com", password_hash="hashed_password", role="user")
        db.session.add(user)  # Ajouter l'utilisateur à la session
        db.session.commit()   # Valider l'ajout dans la base

        print(f"Utilisateur {user.username} ajouté avec succès !")

def view_users():
    with app.app_context():
        # Récupérer tous les utilisateurs
        users = User.query.all()

        if users:
            print(f"{'ID':<5} {'Username':<20} {'Email':<30} {'Role'} {'Password_hash'}")
            print("-" * 70)
            for user in users:
                print(f"{user.id:<5} {user.username:<20} {user.email:<30} {user.role} {user.password_hash}")
        else:
            print("Aucun utilisateur trouvé.")

# Appeler la fonction pour créer les tables si nécessaire
if __name__ == "__main__":
    create_tables()  # Assurez-vous que les tables sont créées
#    add_user()
    view_users()  # Ensuite, afficher les utilisateurs
