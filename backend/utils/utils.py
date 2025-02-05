from flask_jwt_extended import get_jwt
from functools import wraps
from flask import jsonify

def role_required(required_role):
    """Décorateur pour restreindre l'accès aux utilisateurs avec un rôle spécifique"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()  # Récupérer les données du token
            user_role = claims.get("role", "user")  # Par défaut "user"
            if user_role != required_role:
                return jsonify({"error": "Access forbidden"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
