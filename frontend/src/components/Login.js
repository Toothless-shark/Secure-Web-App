import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/login.css'; //Importation du fichier CSS
import { login } from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fonction de gestion de l'envoi du formulaire
    const handleLogin = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        try {
           const data = await login(email, password);
           localStorage.setItem("token", data.access_token); // Stocke le token dans le localStorage
           navigate("/dashboard"); // Redirige l'utilisateur après la connexion
        } catch (error) {
        // Vérification des erreurs spécifiques
           if (!error.response) {
            // Si aucune réponse du serveur, problème de connexion réseau
               setError("Impossible de se connecter au serveur. Vérifie ta connexion ou si l'API est bien démarrée.");
           } else if (error.response.status === 401) {
            // Si la réponse est un code 401, erreur d'authentification
               setError("Email ou mot de passe incorrect");
           } else {
            // Autres erreurs (ex : 500, 404)
               setError("Une erreur est survenue. Veuillez réessayer plus tard.");
           }
               console.error("Erreur de connexion", error);
           }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                {/* Logo de l'application */}
                <img src="logo192.png" alt="Logo" className="logo" />
                <form onSubmit={handleLogin}>
                    <div>
                        <label>Email :</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Mot de passe :</label>
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
