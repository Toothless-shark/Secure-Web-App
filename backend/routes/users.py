from flask import Blueprint, request, jsonify
from models import db, User
from utils.utils import role_required
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

# Création d'un Blueprint pour les routes utilisateurs
users_bp = Blueprint('users', __name__)

# Route pour récupérer tous les utilisateurs
@users_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    claims = get_jwt()  # Récupérer les claims du JWT
    # Vérifier si c'est un admin
    if claims.get("role") == "admin":
        users = User.query.all()
    else:
        # Filtrer pour exclure les admins
        users = User.query.filter(User.role != "admin").all()

    return jsonify([{"id": u.id, "username": u.username, "email": u.email, "role": u.role} for u in users])

# Route pour récupérer un utilisateur spécifique par ID
@users_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()  # ID de l'utilisateur connecté
    claims = get_jwt()  # Récupérer les claims JWT

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Un admin peut voir tout le monde
    if claims.get("role") == "admin":
        return jsonify({"id": user.id, "username": user.username, "email": user.email, "role": user.role})

    # Un utilisateur normal peut seulement voir son propre profil
    if str(user.id) == str(current_user_id):
        return jsonify({"id": user.id, "username": user.username, "email": user.email, "role": user.role})

    return jsonify({"error": "Access forbidden"}), 403

# Route pour créer un nouvel utilisateur
@users_bp.route("/users", methods=["POST"])
@jwt_required()
@role_required("admin")  # Seuls les admins peuvent voir tous les utilisateurs
def create_user():
    data = request.json
#    hashed_password = generate_password_hash(data["password"])  # Hashage du mot de passe
#    new_user = User(username=data["username"], email=data["email"], password_hash=hashed_password)
    new_user = User(username=data["username"], email=data["email"])
    new_user.set_password(data["password"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

# Route pour mettre à jour un utilisateur existant
@users_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Un admin peut modifier n'importe qui, mais un user ne peut modifier que lui-même
    if claims.get("role") != "admin" and str(user.id) != str(current_user_id):
        return jsonify({"error": "Access forbidden"}), 403

    data = request.json

    # Empêcher un utilisateur normal de changer son rôle
    if "role" in data and claims.get("role") != "admin":
        return jsonify({"error": "Unauthorized to change role"}), 403

    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    db.session.commit()
    return jsonify({"message": "User updated"})

# Route pour supprimer un utilisateur
@users_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")  # Seuls les admins peuvent voir tous les utilisateurs
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})
