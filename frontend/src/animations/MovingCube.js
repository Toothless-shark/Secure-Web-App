import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const MovingCube = () => {
    const mountRef = useRef(null);
    const velocity = useRef({ x: Math.random() * 2 + 1, y: Math.random() * 2 + 1 });

useEffect(() => {
    const mount = mountRef.current; // Stocker la référence actuelle

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement); // Utiliser `mount`

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5);
    scene.add(light);

    let position = { x: 0, y: 0 };
    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);

        position.x += velocity.current.x * 0.05;
        position.y += velocity.current.y * 0.05;

        if (position.x >= 2 || position.x <= -2) {
            velocity.current.x *= -1;
        }
        if (position.y >= 2 || position.y <= -2) {
            velocity.current.y *= -1;
        }

        cube.position.x = position.x;
        cube.position.y = position.y;

        renderer.render(scene, camera);
    };

    animate();

    // Nettoyage propre du canvas
    return () => {
        mount.removeChild(renderer.domElement); // Utiliser `mount`
    };
}, []);
    return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default MovingCube;
