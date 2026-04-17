// script.js - Consolidated JavaScript for Terminal Portfolio

// --- Three.js CDN ---
// This script will be included directly in index.html via CDN.
// For this consolidated file, we assume THREE is available globally.
// If running locally without CDN, you'd need to include Three.js loader scripts.

// --- Constants ---
const TYPE_SPEED = 20; // Milliseconds per character
const BOOT_DELAY = 50; // Milliseconds between boot sequence steps
const CURSOR_BLINK_RATE = 500; // Milliseconds for cursor blink

const PARTICLE_COUNT = 1000;
const PROJECT_CUBE_COUNT = 5; // Number of project cubes to display
const SKILL_ICON_COUNT = 5;
const MATRIX_MAX_CHARS = 300;
const MATRIX_CHAR_INTERVAL = 70;
const MATRIX_SPEED = 0.1;

// --- Utility Functions ---
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\[').replace(/[\]]/, '\]');
    const regex = new RegExp('[\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
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

// --- Content Data (from README) ---
const developerName = "Mugagga Moses";
const developerLocation = "Uganda";
const developerShortName = "Moses"; // As per override

const aboutContent = `
Hi, I'm ${developerShortName} Lyn— a creative developer from ${developerLocation} obsessed with making the web feel alive.

I build terminal-style portfolios, Three.js worlds, and AI-powered tools just for fun.
When I'm not coding, I'm probably exploring Gemini CLI or contributing to open-source projects.

Currently hacking on the next generation of immersive developer experiences.
`;

const skillsData = [
    { name: "JavaScript / TypeScript", level: 95 },
    { name: "Three.js", level: 90 },
    { name: "React / Next.js", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Tailwind + CSS Art", level: 95 },
    { name: "AI Tooling & Prompt Engineering", level: 88 },
];

const projectsData = [
    { title: "Terminal Portfolio", link: "#", description: "This site!" },
    { title: "Gemini CLI Experiments", link: "#", description: "AI-powered tools." },
    { title: "3D Portfolio Engine", link: "#", description: "Reusable Three.js template." },
    { title: "Personal Blog", link: "#", description: "Thoughts and musings." },
    { title: "Open Source Contrib", link: "#", description: "Giving back to the community." },
];

const experienceData = [
    { title: "Software Engineer", company: "Tech Innovations Inc.", duration: "2023 - Present", description: "Developing cutting-edge web applications." },
    { title: "Full-Stack Developer", company: "Creative Solutions Ltd.", duration: "2021 - 2023", description: "Built and maintained client-facing platforms." },
    { title: "Junior Developer", company: "Startup Hub", duration: "2020 - 2021", description: "Gained foundational experience in web development." },
    { title: "Computer Science Student", company: "University of Uganda", duration: "2016 - 2020", description: "Studied core computer science principles." },
];

const contactContent = `
X: [@MozesMugagga](https://x.com/MozesMugagga)
Email: [mugaggamozes@gmail.com] (Click to copy)
GitHub: [M0ze](https://github.com/M0ze)
`;

// --- Command Registry ---
export const commands = {}; // Will be populated by registerCommands function

// --- Helper Functions for Rendering ---
function renderAbout() {
    const content = document.createElement('div');
    content.id = 'about-content';
    content.innerHTML = `
        <div class="output-line"><strong>Name:</strong> ${developerName}</div>
        <div class="output-line"><strong>Location:</strong> ${developerLocation} 🇺🇬</div>
        <div class="output-line output-highlight"><strong>Tagline:</strong> Turning coffee into interactive 3D experiences.</div>
        <div class="output-line"></div>
        <div class="output-line">${aboutContent.split('
').map(line => line.trim() ? `<span>${line.trim()}</span>` : '').join('<br>')}</div>
    `;
    return content;
}

function renderSkills() {
    const content = document.createElement('div');
    content.id = 'skills-content';
    skillsData.forEach(skill => {
        content.innerHTML += `
            <div class="output-line">
                <span class="skill-label">${skill.name}</span>
                <div class="skill-bar-container">
                    <div class="skill-bar" style="width: ${skill.level}%;"></div>
                </div>
            </div>
        `;
    });
    return content;
}

function renderProjects(terminal) {
    const content = document.createElement('div');
    content.id = 'projects-content';

    const projectElements = [];
    projectsData.forEach((project, index) => {
        content.innerHTML += `
            <div class="output-line">
                <span class="project-cube-title">${project.title}</span>
            </div>
            <div class="output-line">
                <span class="project-cube-description">${project.description}</span>
            </div>
            <div class="output-line"></div>
        `;
        projectElements.push({
            mesh: null, // Placeholder, will be created by Three.js scene setup
            ...project,
            id: `project-${index}`
        });
    });

    // Trigger Three.js to create cubes if available
    if (terminal.threeScene && terminal.threeScene.createProjectCubes) {
        terminal.threeScene.createProjectCubes(); // This populates terminal.threeScene.projectCubes
        if (terminal.threeScene.projectCubes.length === projectElements.length) {
            projectElements.forEach((el, i) => {
                el.mesh = terminal.threeScene.projectCubes[i].mesh;
            });
            terminal.threeScene.commandHandlers.activateCommandElements(projectElements);
        }
    } else {
        console.warn("Three.js scene not available for project cubes.");
    }
    return content;
}

function renderExperience() {
    const content = document.createElement('div');
    content.id = 'experience-content';
    experienceData.forEach(exp => {
        content.innerHTML += `
            <div class="output-line"><strong>${exp.title}</strong> - ${exp.company}</div>
            <div class="output-line output-highlight">${exp.duration}</div>
            <div class="output-line">${exp.description}</div>
            <div class="output-line"></div>
        `;
    });
    return content;
}

function renderContact(terminal) {
    const content = document.createElement('div');
    content.id = 'contact-content';
    content.innerHTML = contactContent;

    const emailElement = content.querySelector('a[href^="mailto:"]');
    if (emailElement) {
        const emailAddress = "mugaggamozes@gmail.com";
        emailElement.href = `mailto:${emailAddress}`;
        emailElement.textContent = `[${emailAddress}]`;
        emailElement.classList.add('output-link');

        emailElement.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(emailAddress).then(() => {
                terminal.log(`Email copied to clipboard: ${emailAddress}`, 'output-info');
            }).catch(err => {
                terminal.log(`Failed to copy email: ${err}`, 'output-error');
            });
        });
    }

    content.querySelectorAll('.output-line a').forEach(link => {
        link.classList.add('output-link');
        link.target = '_blank';
    });

    return content;
}

function renderWhoami() {
    const content = document.createElement('div');
    content.id = 'whoami-content';
    content.innerHTML = `
        <div class="output-line"><strong>User:</strong> ${developerName}</div>
        <div class="output-line"><strong>Host:</strong> ${window.location.hostname || 'localhost'}</div>
        <div class="output-line"><strong>OS:</strong> ${navigator.platform}</div>
        <div class="output-line"><strong>Location:</strong> ${developerLocation}</div>
        <div class="output-line"><strong>Shell:</strong> Bash (simulated)</div>
        <div class="output-line"><strong>Uptime:</strong> Calculating...</div>
    `;
    return content;
}

function renderReadme() {
    const content = document.createElement('div');
    content.id = 'readme-content';
    content.innerHTML = `
        <div class="output-line"><strong>README.md Summary:</strong></div>
        <div class="output-line"></div>
        <div class="output-line">This is a terminal-themed portfolio built with Vanilla JS and Three.js.</div>
        <div class="output-line">Features include a functional command parser, realistic typing, tab completion, Three.js animations (particles, project cubes, orbiting skills), and CRT effects.</div>
        <div class="output-line">Commands: help, about, skills, projects, experience, contact, whoami, matrix, clear, theme glitch, etc.</div>
        <div class="output-line">Tech Stack: Vanilla JS, Three.js (CDN), CSS.</div>
        <div class="output-line">Built by ${developerName} from ${developerLocation}.</div>
    `;
    return content;
}

function renderHelp() {
    const content = document.createElement('div');
    content.id = 'help-content';
    content.innerHTML = `<div class="output-line"><strong>Available Commands:</strong></div>`;

    const commandList = Object.keys(commands).sort();
    commandList.forEach(cmd => {
        content.innerHTML += `<div class="output-line output-command"><strong>${cmd}</strong></div>`;
    });
    content.innerHTML += `<div class="output-line"></div>`;
    content.innerHTML += `<div class="output-line">Type a command name for more details (if available).</div>`;

    return content;
}

// --- Terminal Class ---
class Terminal {
    constructor(outputElement, inputElement, promptSymbolElement) {
        this.outputElement = outputElement;
        this.inputElement = inputElement;
        this.promptSymbolElement = promptSymbolElement;
        this.commandRegistry = {};
        this.commandHistory = [];
        this.commandHistoryIndex = -1;
        this.isBooting = true;
        this.isTyping = false;
        this.currentLine = '';
        this.threeScene = null; // To hold the Three.js scene API

        this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.inputElement.addEventListener('input', this.handleInput.bind(this));

        this.cursorInterval = null;
        this.isCursorVisible = true;
    }

    async boot() {
        this.log("Initializing system...");
        await this.typeString("Initializing system...", BOOT_DELAY);
        this.log("Verifying hardware...");
        await this.typeString("Verifying hardware...", BOOT_DELAY);
        this.log("Loading kernel modules...");
        await this.typeString("Loading kernel modules...", BOOT_DELAY);
        this.log("Mounting file system...");
        await this.typeString("Mounting file system...", BOOT_DELAY);

        this.outputElement.innerHTML += '<div class="output-line">Boot Progress: [==========] 100%</div>';
        await new Promise(resolve => setTimeout(resolve, 300));

        this.log("System online. Type 'help' for a list of commands.");
        await this.typeString("System online. Type 'help' for a list of commands.", BOOT_DELAY * 2);
        this.isBooting = false;
        this.startCursorBlinking();
        this.inputElement.disabled = false;
        this.focusInput();
    }

    log(message, type = 'output-line') {
        const line = document.createElement('div');
        line.className = type;
        line.textContent = message;
        this.outputElement.appendChild(line);
        this.scrollToBottom();
        return line;
    }

    async typeString(text, delay = TYPE_SPEED) {
        this.isTyping = true;
        this.inputElement.disabled = true;

        for (let i = 0; i < text.length; i++) {
            this.outputElement.lastChild.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        this.isTyping = false;
        this.inputElement.disabled = false;
        this.focusInput();
        this.scrollToBottom();
    }

    handleKeyDown(event) {
        if (this.isBooting) {
            event.preventDefault();
            return;
        }

        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                this.executeCommand();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                event.preventDefault();
                this.handleTabCompletion();
                break;
            case 'Backspace':
                if (this.inputElement.value === '') {
                    event.preventDefault();
                }
                break;
        }
    }

    handleInput() {
        if (!this.isBooting) {
            this.currentLine = this.inputElement.value;
            this.updateCursor();
        }
    }

    executeCommand() {
        const commandLine = this.inputElement.value.trim();
        if (commandLine) {
            this.log(`> ${commandLine}`, 'output-command');
            this.commandHistory.push(commandLine);
            this.commandHistoryIndex = this.commandHistory.length;
            this.inputElement.value = '';
            this.currentLine = '';
            this.updateCursor();

            const [command, ...args] = commandLine.split(' ');
            const handler = this.commandRegistry[command];

            if (handler) {
                try {
                    handler(this, args);
                } catch (error) {
                    this.log(`Error executing command: ${error.message}`, 'output-error');
                    if (this.threeScene && this.threeScene.postProcessing && this.threeScene.postProcessing.glitch) {
                        this.threeScene.postProcessing.glitch.activate();
                    }
                }
            } else {
                this.log(`Command not found: ${command}. Type 'help' for assistance.`, 'output-error');
                 if (this.threeScene && this.threeScene.postProcessing && this.threeScene.postProcessing.glitch) {
                    this.threeScene.postProcessing.glitch.activate();
                }
            }
        } else {
            this.inputElement.value = '';
            this.currentLine = '';
            this.updateCursor();
            this.log("");
        }
        this.focusInput();
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.commandHistoryIndex += direction;

        if (this.commandHistoryIndex < 0) {
            this.commandHistoryIndex = 0;
        } else if (this.commandHistoryIndex >= this.commandHistory.length) {
            this.commandHistoryIndex = this.commandHistory.length -1;
            if (direction === 1) {
                 this.inputElement.value = '';
                 this.currentLine = '';
                 this.updateCursor();
                 return;
            }
        }

        this.inputElement.value = this.commandHistory[this.commandHistoryIndex];
        this.currentLine = this.inputElement.value;
        this.inputElement.setSelectionRange(this.currentLine.length, this.currentLine.length);
        this.updateCursor();
    }

    handleTabCompletion() {
        const currentInput = this.inputElement.value.toLowerCase();
        const availableCommands = Object.keys(this.commandRegistry);
        const matches = availableCommands.filter(cmd => cmd.startsWith(currentInput));

        if (matches.length === 1) {
            this.inputElement.value = matches[0];
            this.currentLine = matches[0];
        } else if (matches.length > 1) {
            this.log(matches.join('  '), 'output-info');
        }
        this.updateCursor();
    }

    startCursorBlinking() {
        if (this.cursorInterval) clearInterval(this.cursorInterval);
        this.cursorInterval = setInterval(() => {
            this.isCursorVisible = !this.isCursorVisible;
            this.updateCursor();
        }, CURSOR_BLINK_RATE);
    }

    stopCursorBlinking() {
        if (this.cursorInterval) clearInterval(this.cursorInterval);
        this.isCursorVisible = true;
        this.updateCursor();
    }

    updateCursor() {
        const cursorElement = document.getElementById('cursor');
        if (!cursorElement) return;

        if (this.inputElement.disabled) {
            cursorElement.style.visibility = 'hidden';
        } else {
            cursorElement.style.visibility = this.isCursorVisible ? 'visible' : 'hidden';
        }
    }

    focusInput() {
        this.inputElement.focus();
        this.inputElement.disabled = false;
        this.startCursorBlinking();
    }

    blurInput() {
        this.inputElement.blur();
        this.stopCursorBlinking();
    }

    scrollToBottom() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    setThreeScene(scene) {
        this.threeScene = scene;
    }
}

// --- Three.js Scene Setup ---
// This function will be called from main execution flow
function setupThreeScene(canvas, terminal) {
    // Ensure THREE is available globally (from CDN)
    if (typeof THREE === 'undefined') {
        console.error("Three.js is not loaded. Please include it via CDN.");
        return null;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 1.5;

    camera.position.z = 5;

    // Post-processing
    const composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new THREE.BloomPass(1, 25, 4, 256);
    bloomPass.threshold = 0.1;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.5;
    composer.addPass(bloomPass);

    const glitchPass = new THREE.GlitchPass();
    glitchPass.goWild = false;
    composer.addPass(glitchPass);

    const postProcessing = { composer, bloom: bloomPass, glitch: glitchPass };

    // Particle Field
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ff00,
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

    const particleSystem = {
        mesh: particles, geometry: particlesGeometry, material: particlesMaterial,
        positions: positions, velocities: new Float32Array(PARTICLE_COUNT * 3).fill(0)
    };

    // Matrix Rain
    const matrixChars = [];
    const matrixContainer = document.createElement('div');
    matrixContainer.id = 'matrix-rain-container';
    matrixContainer.style.position = 'absolute'; matrixContainer.style.top = '0'; matrixContainer.style.left = '0';
    matrixContainer.style.width = '100%'; matrixContainer.style.height = '100%';
    matrixContainer.style.pointerEvents = 'none'; matrixContainer.style.overflow = 'hidden';
    matrixContainer.style.zIndex = '5';
    document.getElementById('crt-container').appendChild(matrixContainer);

    function activateMatrixRain() {
        matrixContainer.style.display = 'block';
        for (let i = 0; i < MATRIX_MAX_CHARS; i++) {
            const charElement = document.createElement('span');
            charElement.className = 'matrix-code';
            charElement.style.position = 'absolute'; charElement.style.opacity = '0';
            charElement.innerText = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
            matrixContainer.appendChild(charElement);
            matrixChars.push({ element: charElement, x: 0, y: 0, speed: MATRIX_SPEED + Math.random() * 0.1 });
        }
        matrixRainAnimation();
    }

    function deactivateMatrixRain() {
        matrixContainer.style.display = 'none';
        matrixChars.forEach(charData => {
            if (charData.element.parentNode) charData.element.parentNode.removeChild(charData.element);
        });
        matrixChars.length = 0;
    }

    function matrixRainAnimation() {
        const containerWidth = matrixContainer.offsetWidth;
        const containerHeight = matrixContainer.offsetHeight;

        matrixChars.forEach(charData => {
            charData.y += charData.speed;
            if (charData.y > containerHeight + 20) { // Reset if off screen
                charData.y = -20;
                charData.x = Math.random() * containerWidth;
                charData.element.innerText = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
                charData.element.style.color = '#00ff00';
            }
            charData.element.style.left = `${charData.x}px`;
            charData.element.style.top = `${charData.y}px`;
            charData.element.style.opacity = Math.max(0, 1 - (charData.y / (containerHeight + 20))).toString();

            if (Math.random() < 0.02) charData.element.style.color = '#00ff00';
            else if (Math.random() < 0.05) charData.element.style.color = '#90ee90';
        });
        requestAnimationFrame(matrixRainAnimation);
    }

    // Dynamic Elements
    let projectCubes = [];
    let skillIcons = [];
    let activeCommandElements = null;

    function createProjectCubes() {
        const projectsData = [
            { title: "Terminal Portfolio", link: "#", description: "This site!" },
            { title: "Gemini CLI Experiments", link: "#", description: "AI-powered tools." },
            { title: "3D Portfolio Engine", link: "#", description: "Reusable Three.js template." },
            { title: "Personal Blog", link: "#", description: "Thoughts and musings." },
            { title: "Open Source Contrib", link: "#", description: "Giving back to the community." },
        ];

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, shininess: 100 });

        projectCubes = [];
        for (let i = 0; i < Math.min(projectsData.length, PROJECT_CUBE_COUNT); i++) {
            const mesh = new THREE.Mesh(geometry, material.clone());
            mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 10);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            scene.add(mesh);
            projectCubes.push({ mesh, ...projectsData[i] });
        }
    }

    function createSkillIcons() {
        const skillData = [
            { name: "JS" }, { name: "TS" }, { name: "Three.js" }, { name: "React" }, { name: "Tailwind" }
        ];

        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 100 });

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

    const commandHandlers = {
        activateCommandElements: (elements) => {
            if (activeCommandElements) {
                activeCommandElements.forEach(obj => scene.remove(obj.mesh));
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

    const animate = () => {
        requestAnimationFrame(animate);

        controls.update();

        // Animate particles
        const positions = particleSystem.positions;
        const velocities = particleSystem.velocities;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const dx = -positions[i3] * 0.001;
            const dy = -positions[i3 + 1] * 0.001;
            const dz = -positions[i3 + 2] * 0.001;

            velocities[i3] += dx + (Math.random() - 0.5) * 0.01;
            velocities[i3 + 1] += dy + (Math.random() - 0.5) * 0.01;
            velocities[i3 + 2] += dz + (Math.random() - 0.5) * 0.01;

            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];

            const dist = Math.sqrt(positions[i3]**2 + positions[i3+1]**2 + positions[i3+2]**2);
            if (dist > 15) {
                positions[i3] = (Math.random() - 0.5) * 5;
                positions[i3 + 1] = (Math.random() - 0.5) * 5;
                positions[i3 + 2] = (Math.random() - 0.5) * 5;
                velocities[i3] = 0; velocities[i3+1] = 0; velocities[i3+2] = 0;
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

        composer.render();
    };

    const resizeCanvas = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        composer.setSize(width, height);
    };

    // Public API for Terminal
    const threeSceneApi = {
        scene, camera, renderer, controls, composer, postProcessing,
        particleSystem, projectCubes, skillIcons, commandHandlers,
        createProjectCubes, createSkillIcons, activateMatrixRain, deactivateMatrixRain,
        resizeCanvas,
        dispose: () => {
            disposeThreeObject(scene); renderer.dispose(); composer.dispose();
            bloomPass.dispose(); glitchPass.dispose();
            if (matrixContainer.parentNode) matrixContainer.parentNode.removeChild(matrixContainer);
        }
    };

    resizeCanvas();
    animate();

    return threeSceneApi;
}

// --- Command Implementation ---
function registerCommands(terminal) {
    commands.help = (term, args) => {
        const helpContent = renderHelp();
        term.outputElement.appendChild(helpContent);
        term.scrollToBottom();
    };
    commands.clear = (term, args) => {
        term.outputElement.innerHTML = '';
        if (term.threeScene) {
            term.threeScene.deactivateMatrixRain();
            term.threeScene.commandHandlers.clearCommandElements();
        }
    };
    commands.about = (term, args) => {
        const aboutContentElement = renderAbout();
        term.outputElement.appendChild(aboutContentElement);
        term.scrollToBottom();
    };
    commands.skills = (term, args) => {
        const skillsContentElement = renderSkills();
        term.outputElement.appendChild(skillsContentElement);
        term.scrollToBottom();

        if (term.threeScene && term.threeScene.createSkillIcons) {
            term.threeScene.createSkillIcons();
            term.threeScene.commandHandlers.activateCommandElements(term.threeScene.skillIcons);
        }
    };
    commands.projects = (term, args) => {
        const projectsContentElement = renderProjects(term);
        term.outputElement.appendChild(projectsContentElement);
        term.scrollToBottom();
    };
    commands.experience = (term, args) => {
        const experienceContentElement = renderExperience();
        term.outputElement.appendChild(experienceContentElement);
        term.scrollToBottom();
    };
    commands.contact = (term, args) => {
        const contactContentElement = renderContact(term);
        term.outputElement.appendChild(contactContentElement);
        term.scrollToBottom();
    };
    commands.whoami = (term, args) => {
        const whoamiContentElement = renderWhoami();
        term.outputElement.appendChild(whoamiContentElement);
        term.scrollToBottom();
    };
    commands.matrix = (term, args) => {
        if (term.threeScene && term.threeScene.activateMatrixRain) {
            term.threeScene.activateMatrixRain();
            term.log("Matrix mode activated. Type 'exit' or 'clear' to deactivate.");
        } else {
            term.log("Matrix effect not available.", "output-error");
        }
    };
    commands.exit = (term, args) => {
        if (term.threeScene && term.threeScene.deactivateMatrixRain) {
            term.threeScene.deactivateMatrixRain();
            term.log("Matrix mode deactivated.");
        } else {
            term.log("No active matrix mode to exit.");
        }
    };
    commands['theme glitch'] = (term, args) => {
        if (term.threeScene && term.threeScene.postProcessing && term.threeScene.postProcessing.glitch) {
            term.threeScene.postProcessing.glitch.goWild = !term.threeScene.postProcessing.glitch.goWild;
            const status = term.threeScene.postProcessing.glitch.goWild ? "activated" : "deactivated";
            term.log(`Glitch effect ${status}.`);
        } else {
            term.log("Glitch effect not available.", "output-error");
        }
    };
    commands['cat README.md'] = (term, args) => {
        const readmeContentElement = renderReadme();
        term.outputElement.appendChild(readmeContentElement);
        term.scrollToBottom();
    };

    // Easter Eggs
    commands['sudo make me a sandwich'] = (term, args) => {
        term.log("...Okay, here you go:", 'output-info');
        term.log("🥪", 'output-highlight');
    };

    commands.neofetch = (term, args) => {
        term.log(`
 _,-'
---
${developerName} @ ${window.location.hostname || 'localhost'}
--------------------------------------------------
OS: ${navigator.platform}
Host: ${window.navigator.userAgent}
Uptime: Calculating...
Shell: Bash (simulated)
--------------------------------------------------
        `, 'output-info');
    };

    // Register commands
    Object.keys(commands).forEach(commandName => {
        terminal.registerCommand(commandName, commands[commandName]);
    });

    // Add aliases
    terminal.registerCommand('?', commands.help);
    terminal.registerCommand('ls', commands.projects);
    terminal.registerCommand('man', commands.help);
    terminal.registerCommand('pwd', (term, args) => term.log('/home/user'));
    terminal.registerCommand('date', (term, args) => term.log(new Date().toLocaleString()));
}

// --- Main Execution Flow ---
document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const promptSymbol = document.getElementById('prompt-symbol');
    const canvas = document.getElementById('three-canvas');

    let terminal;

    async function initializeApp() {
        terminal = new Terminal(terminalOutput, terminalInput, promptSymbol);
        await terminal.boot();

        // Register commands after terminal is ready
        registerCommands(terminal);

        // Setup Three.js scene
        if (canvas) {
            const threeSceneApi = setupThreeScene(canvas, terminal);
            terminal.setThreeScene(threeSceneApi);
        } else {
            console.warn("Canvas element not found. Three.js scene will not be initialized.");
        }

        document.body.classList.add('loaded');
        terminal.focusInput();
    }

    window.addEventListener('load', initializeApp);

    window.addEventListener('resize', () => {
        if (terminal && terminal.threeScene) {
            terminal.threeScene.resizeCanvas();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!terminalInput.matches(':focus') && event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
            terminal.focusInput();
            terminalInput.value += event.key;
            event.preventDefault();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            terminal.handleTabCompletion();
        }
    });
});
