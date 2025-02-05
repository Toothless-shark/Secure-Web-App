from models import db, User, app

# Tester la connexion à la base de données
with app.app_context():
    print("Connexion réussie à la base de données !")
    db.create_all()  # S'assurer que les tables existent

    # Ajouter un utilisateur test
    new_user = User(username="Alice", email="alice@example.com")
    db.session.add(new_user)
    db.session.commit()
    print("Utilisateur ajouté avec succès !")

    # Vérifier l'ajout
    user = User.query.first()
    print(f"Utilisateur récupéré : {user.username} - {user.email}")
