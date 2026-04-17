import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

// --- Constants ---
const PARTICLE_COUNT = 1000;
const PROJECT_CUBE_COUNT = 5; // Number of project cubes to display
const SKILL_ICON_COUNT = 5;
const MATRIX_MAX_CHARS = 300;
const MATRIX_CHAR_INTERVAL = 70;
const MATRIX_SPEED = 0.1;

// --- Utility Functions ---
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function disposeThreeObject(obj) {
    if (!obj) return;
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
        if (Array.isArray(obj.material)) {
            obj.material.forEach(material => material.dispose());
        } else {
            obj.material.dispose();
        }
    }
    if (obj.texture) obj.texture.dispose();
    if (obj.children) {
        obj.children.forEach(disposeThreeObject);
    }
    if (obj.parent) {
        obj.parent.remove(obj);
    }
}

// --- Scene Setup ---
export function setupThreeScene(canvas, terminal) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background

    // Controls (optional, for debugging or specific interactions)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 1.5; // Limit vertical rotation

    camera.position.z = 5;

    // --- Post-processing ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom Pass (for glow effects)
    const bloomPass = new BloomPass(
        1, // strength
        25, // kernelSize
        4, // sigma
        256, // resolution
    );
    bloomPass.threshold = 0.1; // Adjust to control bloom intensity
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.5;
    composer.addPass(bloomPass);

    // Glitch Pass (for errors)
    const glitchPass = new GlitchPass();
    glitchPass.goWild = false; // Controlled activation
    composer.addPass(glitchPass);

    const postProcessing = {
        composer,
        bloom: bloomPass,
        glitch: glitchPass
    };

    // --- Background Elements ---

    // 1. Particle Field
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ff00, // Green
        size: 0.05,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
    });

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Store particles for animation
    const particleSystem = {
        mesh: particles,
        geometry: particlesGeometry,
        material: particlesMaterial,
        positions: positions, // Keep original positions for reset
        velocities: new Float32Array(PARTICLE_COUNT * 3).fill(0)
    };

    // 2. Matrix Rain (Placeholder - actual implementation will be dynamic)
    const matrixChars = [];
    const matrixContainer = document.createElement('div');
    matrixContainer.id = 'matrix-rain-container';
    matrixContainer.style.position = 'absolute';
    matrixContainer.style.top = '0';
    matrixContainer.style.left = '0';
    matrixContainer.style.width = '100%';
    matrixContainer.style.height = '100%';
    matrixContainer.style.pointerEvents = 'none';
    matrixContainer.style.overflow = 'hidden';
    matrixContainer.style.zIndex = '5'; // Above canvas, below terminal
    document.getElementById('crt-container').appendChild(matrixContainer);

    function activateMatrixRain() {
        matrixContainer.style.display = 'block';
        for (let i = 0; i < MATRIX_MAX_CHARS; i++) {
            const charElement = document.createElement('span');
            charElement.className = 'matrix-code';
            charElement.style.position = 'absolute';
            charElement.style.opacity = '0';
            charElement.innerText = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)); // Katakana range
            matrixContainer.appendChild(charElement);
            matrixChars.push({ element: charElement, x: 0, y: 0, speed: MATRIX_SPEED + Math.random() * 0.1 });
        }
        matrixRainAnimation();
    }

    function deactivateMatrixRain() {
        matrixContainer.style.display = 'none';
        matrixChars.forEach(charData => {
            if (charData.element.parentNode) {
                charData.element.parentNode.removeChild(charData.element);
            }
        });
        matrixChars.length = 0; // Clear the array
    }

    function matrixRainAnimation() {
        const containerWidth = matrixContainer.offsetWidth;
        const containerHeight = matrixContainer.offsetHeight;
        const charWidth = 20; // Approximate width of a matrix character
        const charHeight = 20; // Approximate height of a matrix character

        matrixChars.forEach(charData => {
            charData.y += charData.speed;

            // Reset if it goes off screen
            if (charData.y > containerHeight + charHeight) {
                charData.y = -charHeight;
                charData.x = Math.random() * containerWidth;
                charData.element.innerText = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
                charData.element.style.color = '#00ff00'; // Reset color
            }

            charData.element.style.left = `${charData.x}px`;
            charData.element.style.top = `${charData.y}px`;
            charData.element.style.opacity = Math.max(0, 1 - (charData.y / (containerHeight + charHeight))).toString();

            // Fading tail effect (optional)
            if (Math.random() < 0.02) { // Randomly change color to green
                charData.element.style.color = '#00ff00';
            } else if (Math.random() < 0.05) { // Randomly change color to a lighter green
                 charData.element.style.color = '#90ee90';
            }
        });
        requestAnimationFrame(matrixRainAnimation);
    }

    // --- Dynamic Elements ---
    let projectCubes = [];
    let skillIcons = [];
    let activeCommandElements = null; // To hold elements generated by commands

    // Function to create project cubes
    function createProjectCubes() {
        const projectsData = [
            { title: "Terminal Portfolio", link: "#", description: "This site!" },
            { title: "Gemini CLI Experiments", link: "#", description: "AI-powered tools." },
            { title: "3D Portfolio Engine", link: "#", description: "Reusable Three.js template." },
            { title: "Personal Blog", link: "#", description: "Thoughts and musings." },
            { title: "Open Source Contrib", link: "#", description: "Giving back to the community." },
        ]; // Placeholder data

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, shininess: 100 }); // Cyan

        projectCubes = [];
        for (let i = 0; i < Math.min(projectsData.length, PROJECT_CUBE_COUNT); i++) {
            const mesh = new THREE.Mesh(geometry, material.clone()); // Clone material to have individual colors if needed
            mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 10);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            scene.add(mesh);
            projectCubes.push({ mesh, ...projectsData[i] });
        }
    }

    // Function to create skill icons (using simple spheres for now)
    function createSkillIcons() {
        const skillData = [
            { name: "JS" }, { name: "TS" }, { name: "Three.js" }, { name: "React" }, { name: "Tailwind" }
        ]; // Placeholder data

        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 100 }); // Yellow

        skillIcons = [];
        const radius = 4;
        for (let i = 0; i < Math.min(skillData.length, SKILL_ICON_COUNT); i++) {
            const mesh = new THREE.Mesh(geometry, material.clone());
            const angle = (i / SKILL_ICON_COUNT) * Math.PI * 2;
            mesh.position.set(radius * Math.cos(angle), 1, radius * Math.sin(angle));
            scene.add(mesh);
            skillIcons.push({ mesh, ...skillData[i] });
        }
    }

    // --- Command Handlers ---
    // These will be called by the Terminal class when commands are executed
    const commandHandlers = {
        activateCommandElements: (elements) => {
            // Remove previous command elements if any
            if (activeCommandElements) {
                activeCommandElements.forEach(obj => scene.remove(obj.mesh));
                activeCommandElements = null;
            }
            activeCommandElements = elements;
            elements.forEach(obj => scene.add(obj.mesh));
        },
        clearCommandElements: () => {
            if (activeCommandElements) {
                activeCommandElements.forEach(obj => disposeThreeObject(obj.mesh));
                activeCommandElements = null;
            }
        },
        activateMatrix: activateMatrixRain,
        deactivateMatrix: deactivateMatrixRain
    };

    // --- Animation Loop ---
    const animate = () => {
        requestAnimationFrame(animate);

        // Update controls
        controls.update();

        // Animate particles
        const positions = particleSystem.positions;
        const velocities = particleSystem.velocities;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Basic physics: attract to origin, random drift
            const dx = -positions[i3] * 0.001;
            const dy = -positions[i3 + 1] * 0.001;
            const dz = -positions[i3 + 2] * 0.001;

            velocities[i3] += dx + (Math.random() - 0.5) * 0.01;
            velocities[i3 + 1] += dy + (Math.random() - 0.5) * 0.01;
            velocities[i3 + 2] += dz + (Math.random() - 0.5) * 0.01;

            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];

            // Keep particles within a certain radius
            const dist = Math.sqrt(positions[i3]**2 + positions[i3+1]**2 + positions[i3+2]**2);
            if (dist > 15) { // Reset if too far
                positions[i3] = (Math.random() - 0.5) * 5;
                positions[i3 + 1] = (Math.random() - 0.5) * 5;
                positions[i3 + 2] = (Math.random() - 0.5) * 5;
                velocities[i3] = 0;
                velocities[i3+1] = 0;
                velocities[i3+2] = 0;
            }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Animate project cubes
        if (projectCubes) {
            projectCubes.forEach((cube, index) => {
                cube.mesh.rotation.x += 0.005 * (index + 1);
                cube.mesh.rotation.y += 0.003 * (index + 1);
            });
        }

        // Animate skill icons
        if (skillIcons) {
            const elapsedTime = performance.now() * 0.001;
            const orbitRadius = 4;
            const orbitSpeed = 0.5;
            skillIcons.forEach((icon, index) => {
                const angle = orbitSpeed * elapsedTime + (index / SKILL_ICON_COUNT) * Math.PI * 2;
                icon.mesh.position.x = orbitRadius * Math.cos(angle);
                icon.mesh.position.z = orbitRadius * Math.sin(angle);
                icon.mesh.rotation.y += 0.01;
            });
        }

        // Render using composer for post-processing
        composer.render();
    };

    // --- Resize Handler ---
    const resizeCanvas = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        composer.setSize(width, height); // Update composer size for post-processing
    };

    // --- Public API for Terminal ---
    const threeSceneApi = {
        scene,
        camera,
        renderer,
        controls,
        composer,
        postProcessing,
        particleSystem,
        projectCubes,
        skillIcons,
        commandHandlers,
        createProjectCubes,
        createSkillIcons,
        activateMatrixRain,
        deactivateMatrixRain,
        resizeCanvas,
        dispose: () => {
            disposeThreeObject(scene);
            renderer.dispose();
            // dispose composer and its passes
            composer.dispose();
            bloomPass.dispose();
            glitchPass.dispose();

            // Clean up DOM elements
            if (matrixContainer.parentNode) {
                matrixContainer.parentNode.removeChild(matrixContainer);
            }
        }
    };

    // Initial setup
    resizeCanvas();
    animate();

    return threeSceneApi;
}
