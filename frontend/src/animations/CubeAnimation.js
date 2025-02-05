import React, { useEffect, useState } from "react";
import "../styles/home.css"; // Import du fichier CSS

const Cube3D = () => {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [velocity, setVelocity] = useState({ x: 4, y: 4 });

    useEffect(() => {
        const updatePosition = () => {
            setPosition((prev) => {
                let newX = prev.x + velocity.x;
                let newY = prev.y + velocity.y;

                // Collision avec les bords de la fenêtre
                if (newX <= 0 || newX >= window.innerWidth - 100) {
                    setVelocity((prevVel) => ({ ...prevVel, x: -prevVel.x })); // Inverse la direction X
                }
                if (newY <= 0 || newY >= window.innerHeight - 100) {
                    setVelocity((prevVel) => ({ ...prevVel, y: -prevVel.y })); // Inverse la direction Y
                }

                return { x: newX, y: newY };
            });
        };

        const interval = setInterval(updatePosition, 20); // Déplacement fluide
        return () => clearInterval(interval);
    }, [velocity]);

    return (
        <div className="cube-container" style={{ left: position.x, top: position.y }}>
            <div className="cube">
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face left"></div>
                <div className="face right"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
            </div>
        </div>
    );
};

export default Cube3D;
