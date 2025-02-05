from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if data.get("role"):
        return jsonify({"error": "You are not allowed to modify this !"}), 410

    if not username or not email or not password:
        return jsonify({"error": "Tous les champs sont obligatoires"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)  # Hash du mot de passe
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Utilisateur créé avec succès"}), 201
    except IntegrityError as e:
        # Convertir l'erreur en string pour l'analyser
        error_message = str(e.orig)
        if "user.username" in error_message:
            return jsonify({"error": "Username already exists"}), 409
        elif "user.email" in error_message:
            return jsonify({"error": "Email already exists"}), 409
        else:
            return jsonify({"error": "Database error"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401

    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return jsonify({"access_token": access_token}), 200

# Route pour obtenir les informations de l'utilisateur actuel
@auth_bp.route("/me", methods=["GET"])
@jwt_required()  # Assurez-vous que l'utilisateur est authentifié
def get_user_info():
    current_user_id = get_jwt_identity()  # Récupère l'ID de l'utilisateur depuis le JWT
    user = User.query.get(current_user_id)  # Récupère l'utilisateur à partir de la base de données
    print(f"User is: {user}")
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404 
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role  # Inclut le rôle dans la réponse
    })

@auth_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"message": f"Bienvenue, {user.username}"}), 200
