import React from "react";
import { useNavigate } from "react-router-dom";
import Typical from "react-typical";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Subtle Gradient Background */}
      <div className="binary-background">
        {Array.from({ length: 50 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="home-content">
        <h1>
          <Typical
            steps={[
              "HackSec Dashboard",
              1000,
              "Secure Your World",
              1000,
              "Protect Your Data",
              1000,
            ]}
            loop={Infinity}
            wrapper="span"
          />
        </h1>
        <p>
          Bienvenue sur votre tableau de bord sécurisé. Gérez vos utilisateurs et
          protégez votre système.
        </p>
        <div className="home-buttons">
          <button onClick={() => navigate("/login")}>Connexion</button>
          <button onClick={() => navigate("/register")}>Inscription</button>
        </div>
      </div>
    </div>
  );
}

export default Home;