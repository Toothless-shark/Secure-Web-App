from flask import Flask
from models import db, bcrypt, User
from routes.users import users_bp  # Importer le Blueprint des utilisateurs
from routes.auth import auth_bp  # Importer le Blueprint d'authentification
from flask_jwt_extended import JWTManager
from flask_cors import CORS
#from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app) # Autorise toutes les origines
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change cette clé en production

db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)

# Enregistrer le Blueprint
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(users_bp)

with app.app_context():
    db.create_all()  # Crée les tables si elles n'existent pas

    # Vérifier si un admin existe déjà
    admin = User.query.filter_by(role="admin").first()
    if not admin:
#        hashed_password = generate_password_hash("SuperSecurePass123")  # Mot de passe fort
#        admin_user = User(username="admin", email="admin@example.com", password_hash=hashed_password, role="admin")
        admin_user = User(username="admin", email="admin@example.com", role="admin")
        admin_user.set_password("SuperSecurePass123")
        db.session.add(admin_user)
        db.session.commit()
        print("✅ Admin créé avec succès")

if __name__ == "__main__":
    app.run(debug=True)
