import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:5000/users")
            .then(response => setUsers(response.data))
            .catch(error => console.error("Erreur lors de la récupération des utilisateurs :", error));
    }, []);

    return (
        <div>
            <h2>Liste des utilisateurs</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
