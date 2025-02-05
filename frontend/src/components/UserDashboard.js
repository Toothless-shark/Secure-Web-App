import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/userDashboard.css';
import { getUsers, getUserById, createUser, updateUser, deleteUser, getUserInfo } from "../services/api";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);  // Users List for admin
  const [message, setMessage] = useState(""); // Confirmation message
  const [error, setError] = useState(null);  // Error message
  const [showUsers,setShowUsers] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token
        return;
      }
      try {
        const data = await getUserInfo(); // Call the API function
        setUser(data); // Set the username
        setRole(data.role); // Set the role
      } catch (error) {
        setError("Erreur lors du chargement des informations utilisateur.");
        console.error("Erreur", error);
      }
    };
    fetchUserInfo(); // Call the async function
  }, [navigate]);


  // Fetch all users (if admin)
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erreur récupération utilisateurs", error);
    }
  };

  // Créer un nouvel utilisateur (admin)
  const handleCreateUser = async () => {
    const username = prompt("Nom d'utilisateur :");
    const email = prompt("Email :");
    const password = prompt("Mot de passe :");

    if (username && email && password) {
      try {
        await createUser(username, email, password);
        setMessage("Utilisateur créé avec succès !");
        fetchUsers(); // Mettre à jour la liste
      } catch (error) {
        setMessage("Échec de la création de l'utilisateur.");
        console.error(error);
      }
    }
  };

  // Mettre à jour un utilisateur (admin)
  const handleUpdateUser = async (userId) => {
    const newUsername = prompt("Nouveau nom d'utilisateur :");
    if (newUsername) {
      try {
        await updateUser(userId, { username: newUsername });
        setMessage("Utilisateur mis à jour !");
        fetchUsers();
      } catch (error) {
        setMessage("Erreur mise à jour.");
        console.error(error);
      }
    }
  };

  // Supprimer un utilisateur (admin)
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Confirmer la suppression de cet utilisateur ?")) {
      try {
        await deleteUser(userId);
        setMessage("Utilisateur supprimé !");
        fetchUsers();
      } catch (error) {
        setMessage("Erreur suppression.");
        console.error(error);
      }
    }
  };

  const handleToggleUsers = () => {
    setShowUsers((prevState) => !prevState);
  };
  
  // Fetch users when showUsers changes
  useEffect(() => {
    if (showUsers) {
      console.log("Fetching users...");
      fetchUsers();
    }
  }, [showUsers]);  // The effect will always run on every render if showUsers changes
  

  // Rediriger en fonction du rôle
  const handleNavigation = (route) => {
    navigate(route);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Bienvenue, {user ? user.username : "Utilisateur"} !</h2>
        {message && <p className={`message ${message.includes("Erreur") ? "error" : "success"}`}>{message}</p>}
        <ul className="menu">
          {/*{role === "admin" ? (
            <li onClick={ setShowUsers(!showUsers)}>Gérer les utilisateurs</li>
          ) : (
            <li onClick={ setShowUser(!showUser)}>Informations personnelles</li>
          )
          }*/}
          {role === "admin" ? (
            <li onClick={handleToggleUsers}>Gérer les utilisateurs</li>
          ):(
            <li onClick={handleToggleUsers}>Informations personnelles</li>
          )
          }
          
          {role === "admin" && <li onClick={() => {setShowForm(!showForm)} }>Créer un utilisateur</li>}
        </ul>
      </div>

      {/* Affichage du formulaire si showForm est actif */}
      {showForm && (
        <div className="form-container">
          <h3>Créer un utilisateur</h3>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button className="small-button" onClick={handleCreateUser}>Créer</button>
        </div>
      )}

      {showUsers && (

        
      
        role === "admin" ? (
          users.length > 0 && (
          <div className="user-list">
            {users.map((u) => (
              <li key={u.id}>{u.username} <button className="small-button" onClick={() => handleDeleteUser(u.id)}>Supprimer</button></li>
            ))}
          </div>
          )
        ):(
          
          
          <div className="user-list">
            {users.map((u) => (
              <li key={u.id}>{u.username} <button className="small-button" onClick={() => handleDeleteUser(u.id)}>Supprimer</button></li>
            ))}
          <ul>
              <li key={user.id}>
                <strong>Nom :</strong> {user.username} | 
                <strong> Email :</strong> {user.email} | 
                <strong> Rôle :</strong> {user.role}
              </li>
          </ul>
        </div>
        )
      )}

    </div>
  );
}

export default UserDashboard;
