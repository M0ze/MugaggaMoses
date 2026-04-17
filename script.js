// script.js - Consolidated JavaScript for Terminal Portfolio

// --- Global Checks ---
// Ensure THREE is available from CDN. This check happens early.
if (typeof THREE === 'undefined') {
    console.error("Three.js is not loaded. Please ensure it's included via CDN in index.html.");
    // Display an error message to the user on the page if Three.js is missing
    document.addEventListener('DOMContentLoaded', () => { // Use DOMContentLoaded to ensure body exists
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.marginTop = '50px';
        errorDiv.textContent = 'Error: Three.js library not found. Please check your internet connection or CDN link.';
        document.body.appendChild(errorDiv);
        console.error("Three.js library not found.");
    });
    // Prevent further execution if Three.js is missing
    throw new Error("Three.js not loaded.");
}

// --- Constants ---
const TYPE_SPEED = 20; // Milliseconds per character
const BOOT_DELAY = 50; // Milliseconds between boot sequence steps
const CURSOR_BLINK_RATE = 500; // Milliseconds for cursor blink

// Three.js related constants - these might be used if Three.js is enabled
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
const developerShortName = "Moses";

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
                    <div class1="skill-bar" style="width: ${skill.level}%;"></div>
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

    // Attempt to create project cubes if Three.js is available and functions exist
    if (terminal.threeScene && terminal.threeScene.createProjectCubes) {
        try {
            terminal.threeScene.createProjectCubes();
            // Ensure projectCubes array is populated and matches expected length
            if (terminal.threeScene.projectCubes && terminal.threeScene.projectCubes.length === projectElements.length) {
                projectElements.forEach((el, i) => {
                    el.mesh = terminal.threeScene.projectCubes[i].mesh;
                });
                terminal.threeScene.commandHandlers.activateCommandElements(projectElements);
            } else {
                console.warn("Mismatch in project cube data and Three.js scene data.");
            }
        } catch (e) {
            console.error("Error creating project cubes:", e);
            terminal.log("Error displaying project 3D elements.", "output-error");
        }
    } else {
        console.warn("Three.js scene or createProjectCubes function not available for project cubes.");
        terminal.log("Note: 3D project elements are not available.", "output-info");
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

        // Add event listeners
        this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.inputElement.addEventListener('input', this.handleInput.bind(this));

        this.cursorInterval = null;
        this.isCursorVisible = true;
    }

    async boot() {
        console.log("Terminal booting...");
        this.outputElement.innerHTML = ''; // Clear previous content
        
        this.log("Initializing system...");
        await this.typeString("Initializing system...", BOOT_DELAY);
        this.log("Verifying hardware...");
        await this.typeString("Verifying hardware...", BOOT_DELAY);
        this.log("Loading kernel modules...");
        await this.typeString("Loading kernel modules...", BOOT_DELAY);
        this.log("Mounting file system...");
        await this.typeString("Mounting file system...", BOOT_DELAY);

        // Simulate a boot progress bar
        const progressDiv = document.createElement('div');
        progressDiv.className = 'output-line';
        progressDiv.innerHTML = 'Boot Progress: [<span class="progress-bar-fill">[==========]</span>] 100%';
        this.outputElement.appendChild(progressDiv);
        await new Promise(resolve => setTimeout(resolve, 300));

        this.log("System online. Type 'help' for a list of commands.");
        await this.typeString("System online. Type 'help' for a list of commands.", BOOT_DELAY * 2);
        
        this.isBooting = false;
        this.startCursorBlinking();
        this.inputElement.disabled = false;
        this.focusInput();
        console.log("Terminal boot sequence complete.");
    }

    log(message, type = 'output-line') {
        console.log(`Logging: "${message}" with type: ${type}`);
        const line = document.createElement('div');
        line.className = type;
        line.textContent = message; // Use textContent to prevent HTML injection
        this.outputElement.appendChild(line);
        this.scrollToBottom();
        return line;
    }

    async typeString(text, delay = TYPE_SPEED) {
        console.log(`Typing: "${text}"`);
        this.isTyping = true;
        this.inputElement.disabled = true;

        for (let i = 0; i < text.length; i++) {
            if (!this.outputElement.lastChild) { // Ensure there's a line to type on
                this.log("", 'output-line');
            }
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
                // Allow backspace to work naturally
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
                    console.log(`Executing command: ${command} with args:`, args);
                    handler(this, args);
                } catch (error) {
                    console.error(`Error executing command "${command}":`, error);
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
            this.log(""); // Add a blank line to maintain spacing if needed
        }
        this.focusInput();
    }

    navigateHistory(direction) {
        console.log("Navigating history", direction);
        if (this.commandHistory.length === 0) return;

        this.commandHistoryIndex += direction;

        if (this.commandHistoryIndex < 0) {
            this.commandHistoryIndex = 0;
        } else if (this.commandHistoryIndex >= this.commandHistory.length) {
            this.commandHistoryIndex = this.commandHistory.length - 1; // Stay on last item
             if (direction === 1) { // If moving down past the end
                 this.inputElement.value = '';
                 this.currentLine = '';
                 this.updateCursor();
                 return;
            }
        }

        this.inputElement.value = this.commandHistory[this.commandHistoryIndex];
        this.currentLine = this.inputElement.value;
        this.inputElement.setSelectionRange(this.currentLine.length, this.currentLine.length); // Move cursor to end
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
        console.log("Starting cursor blinking");
        if (this.cursorInterval) clearInterval(this.cursorInterval);
        this.cursorInterval = setInterval(() => {
            this.isCursorVisible = !this.isCursorVisible;
            this.updateCursor();
        }, CURSOR_BLINK_RATE);
    }

    stopCursorBlinking() {
        console.log("Stopping cursor blinking");
        if (this.cursorInterval) clearInterval(this.cursorInterval);
        this.isCursorVisible = true;
        this.updateCursor();
    }

    updateCursor() {
        const cursorElement = document.getElementById('cursor');
        if (!cursorElement) {
            console.warn("Cursor element not found.");
            return;
        }

        if (this.inputElement.disabled) {
            cursorElement.style.visibility = 'hidden';
        } else {
            cursorElement.style.visibility = this.isCursorVisible ? 'visible' : 'hidden';
        }
    }

    focusInput() {
        console.log("Focusing input");
        this.inputElement.focus();
        this.inputElement.disabled = false;
        this.startCursorBlinking();
    }

    blurInput() {
        console.log("Blurring input");
        this.inputElement.blur();
        this.stopCursorBlinking();
    }

    scrollToBottom() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    setThreeScene(scene) {
        this.threeScene = scene;
        console.log("Three.js scene set on terminal instance.");
    }
}

// --- Three.js Scene Setup ---
// This function is now conditionally executed and includes error handling.
// It will be called only if the canvas element is found.
function setupThreeScene(canvas, terminal) {
    console.log("Attempting to set up Three.js scene...");
    // Check if Three.js is loaded globally
    if (typeof THREE === 'undefined') {
        console.error("Three.js is not loaded. Please ensure it's included via CDN in index.html.");
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.marginTop = '50px';
        errorDiv.textContent = 'Error: Three.js library not found. Please check your internet connection or CDN link.';
        // Use optional chaining for safety, in case crt-container is also missing
        document.getElementById('crt-container')?.appendChild(errorDiv); 
        return null; // Indicate failure
    }

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0); // Transparent background

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 1.5;

        camera.position.z = 5;

        // Post-processing (conditionally initialize)
        let composer, bloomPass, glitchPass;
        try {
            console.log("Initializing EffectComposer...");
            composer = new THREE.EffectComposer(renderer);
            const renderPass = new THREE.RenderPass(scene, camera);
            composer.addPass(renderPass);

            bloomPass = new THREE.BloomPass(1, 25, 4, 256);
            bloomPass.threshold = 0.1;
            bloomPass.strength = 1.5;
            bloomPass.radius = 0.5;
            composer.addPass(bloomPass);

            glitchPass = new THREE.GlitchPass();
            glitchPass.goWild = false;
            composer.addPass(glitchPass);
            console.log("Post-processing initialized successfully.");
        } catch (e) {
            console.error("Failed to initialize post-processing effects:", e);
            composer = null; // Ensure composer is null if it fails
        }
        const postProcessing = { composer, bloom: bloomPass, glitch: glitchPass };

        // Particle Field
        console.log("Creating particle field...");
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

        const particleSystem = {
            mesh: particles, geometry: particlesGeometry, material: particlesMaterial,
            positions: positions, velocities: new Float32Array(PARTICLE_COUNT * 3).fill(0)
        };
        console.log("Particle field created.");

        // Matrix Rain (Only if matrixContainer is available)
        let matrixContainer = document.getElementById('matrix-rain-container');
        if (!matrixContainer) {
            matrixContainer = document.createElement('div');
            matrixContainer.id = 'matrix-rain-container';
            matrixContainer.style.position = 'absolute'; matrixContainer.style.top = '0'; matrixContainer.style.left = '0';
            matrixContainer.style.width = '100%'; matrixContainer.style.height = '100%';
            matrixContainer.style.pointerEvents = 'none'; matrixContainer.style.overflow = 'hidden';
            matrixContainer.style.zIndex = '5';
            document.getElementById('crt-container')?.appendChild(matrixContainer); // Append if crt-container exists
        }

        const matrixChars = []; // Ensure matrixChars is accessible within its functions

        function activateMatrixRain() {
            console.log("Activating Matrix Rain");
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
            console.log("Deactivating Matrix Rain");
            matrixContainer.style.display = 'none';
            matrixChars.forEach(charData => {
                if (charData.element.parentNode) charData.element.parentNode.removeChild(charData.element);
            });
            matrixChars.length = 0; // Clear the array
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

        // Dynamic Elements (for commands like projects, skills)
        let projectCubes = [];
        let skillIcons = [];
        let activeCommandElements = null;

        function createProjectCubes() {
            console.log("Creating project cubes...");
            const projectsData = [
                { title: "Terminal Portfolio", link: "#", description: "This site!" },
                { title: "Gemini CLI Experiments", link: "#", description: "AI-powered tools." },
                { title: "3D Portfolio Engine", link: "#", description: "Reusable Three.js template." },
                { title: "Personal Blog", link: "#", description: "Thoughts and musings." },
                { title: "Open Source Contrib", link: "#", description: "Giving back to the community." },
            ];

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, shininess: 100 });

            projectCubes = []; // Clear previous cubes if any
            for (let i = 0; i < Math.min(projectsData.length, PROJECT_CUBE_COUNT); i++) {
                const mesh = new THREE.Mesh(geometry, material.clone());
                mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 10);
                mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                scene.add(mesh);
                projectCubes.push({ mesh, ...projectsData[i] });
            }
            console.log("Project cubes created.");
        }

        function createSkillIcons() {
            console.log("Creating skill icons...");
            const skillData = [
                { name: "JS" }, { name: "TS" }, { name: "Three.js" }, { name: "React" }, { name: "Tailwind" }
            ];

            const geometry = new THREE.SphereGeometry(0.5, 16, 16);
            const material = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 100 });

            skillIcons = []; // Clear previous icons
            const radius = 4;
            for (let i = 0; i < Math.min(skillData.length, SKILL_ICON_COUNT); i++) {
                const mesh = new THREE.Mesh(geometry, material.clone());
                const angle = (i / SKILL_ICON_COUNT) * Math.PI * 2;
                mesh.position.set(radius * Math.cos(angle), 1, radius * Math.sin(angle));
                scene.add(mesh);
                skillIcons.push({ mesh, ...skillData[i] });
            }
            console.log("Skill icons created.");
        }

        const commandHandlers = {
            activateCommandElements: (elements) => {
                console.log("Activating command elements in scene");
                if (activeCommandElements) {
                    activeCommandElements.forEach(obj => scene.remove(obj.mesh));
                }
                activeCommandElements = elements;
                elements.forEach(obj => scene.add(obj.mesh));
            },
            clearCommandElements: () => {
                console.log("Clearing command elements from scene");
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
                if (dist > 15) { // Keep particles within a certain radius
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

            if (composer) { // Only render if composer was successfully initialized
                composer.render();
            } else {
                renderer.render(scene, camera); // Fallback render without post-processing
            }
        };

        const resizeCanvas = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            console.log(`Resizing canvas to: ${width}x${height}`);
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            if (composer) {
                composer.setSize(width, height);
            }
        };

        // Public API for Terminal
        const threeSceneApi = {
            scene, camera, renderer, controls, composer, postProcessing,
            particleSystem, projectCubes, skillIcons, commandHandlers,
            createProjectCubes, createSkillIcons, activateMatrixRain, deactivateMatrixRain,
            resizeCanvas,
            dispose: () => {
                console.log("Disposing Three.js objects...");
                disposeThreeObject(scene); renderer.dispose();
                if (composer) composer.dispose();
                if (bloomPass) bloomPass.dispose();
                if (glitchPass) glitchPass.dispose();
                if (matrixContainer.parentNode) matrixContainer.parentNode.removeChild(matrixContainer);
                console.log("Three.js disposed.");
            }
        };

        resizeCanvas();
        animate();

        return threeSceneApi;
    } catch (e) {
        console.error("Error during Three.js setup:", e);
        terminal.log("Error initializing 3D effects. Continuing with text-only mode.", "output-error");
        return null; // Return null if Three.js setup fails
    }
}

// --- Command Implementation ---
function registerCommands(terminal) {
    console.log("Registering commands...");
    commands.help = (term, args) => {
        console.log("Executing help command");
        const helpContent = renderHelp();
        term.outputElement.appendChild(helpContent);
        term.scrollToBottom();
    };
    commands.clear = (term, args) => {
        console.log("Executing clear command");
        term.outputElement.innerHTML = '';
        if (term.threeScene) {
            term.threeScene.deactivateMatrixRain();
            term.threeScene.commandHandlers.clearCommandElements();
        }
    };
    commands.about = (term, args) => {
        console.log("Executing about command");
        const aboutContentElement = renderAbout();
        term.outputElement.appendChild(aboutContentElement);
        term.scrollToBottom();
    };
    commands.skills = (term, args) => {
        console.log("Executing skills command");
        const skillsContentElement = renderSkills();
        term.outputElement.appendChild(skillsContentElement);
        term.scrollToBottom();

        // Conditionally call Three.js functions if scene is initialized
        if (term.threeScene && term.threeScene.createSkillIcons) {
            term.threeScene.createSkillIcons();
            term.threeScene.commandHandlers.activateCommandElements(term.threeScene.skillIcons);
        }
    };
    commands.projects = (term, args) => {
        console.log("Executing projects command");
        const projectsContentElement = renderProjects(term);
        term.outputElement.appendChild(projectsContentElement);
        term.scrollToBottom();
    };
    commands.experience = (term, args) => {
        console.log("Executing experience command");
        const experienceContentElement = renderExperience();
        term.outputElement.appendChild(experienceContentElement);
        term.scrollToBottom();
    };
    commands.contact = (term, args) => {
        console.log("Executing contact command");
        const contactContentElement = renderContact(term);
        term.outputElement.appendChild(contactContentElement);
        term.scrollToBottom();
    };
    commands.whoami = (term, args) => {
        console.log("Executing whoami command");
        const whoamiContentElement = renderWhoami();
        term.outputElement.appendChild(whoamiContentElement);
        term.scrollToBottom();
    };
    commands.matrix = (term, args) => {
        console.log("Executing matrix command");
        if (term.threeScene && term.threeScene.activateMatrixRain) {
            term.threeScene.activateMatrixRain();
            term.log("Matrix mode activated. Type 'exit' or 'clear' to deactivate.");
        } else {
            term.log("Matrix effect not available.", "output-error");
        }
    };
    commands.exit = (term, args) => {
        console.log("Executing exit command");
        if (term.threeScene && term.threeScene.deactivateMatrixRain) {
            term.threeScene.deactivateMatrixRain();
            term.log("Matrix mode deactivated.");
        } else {
            term.log("No active matrix mode to exit.");
        }
    };
    commands['theme glitch'] = (term, args) => {
        console.log("Executing theme glitch command");
        if (term.threeScene && term.threeScene.postProcessing && term.threeScene.postProcessing.glitch) {
            term.threeScene.postProcessing.glitch.goWild = !term.threeScene.postProcessing.glitch.goWild;
            const status = term.threeScene.postProcessing.glitch.goWild ? "activated" : "deactivated";
            term.log(`Glitch effect ${status}.`);
        } else {
            term.log("Glitch effect not available.", "output-error");
        }
    };
    commands['cat README.md'] = (term, args) => {
        console.log("Executing cat README.md command");
        const readmeContentElement = renderReadme();
        term.outputElement.appendChild(readmeContentElement);
        term.scrollToBottom();
    };

    // Easter Eggs
    commands['sudo make me a sandwich'] = (term, args) => {
        console.log("Executing sudo make me a sandwich command");
        term.log("...Okay, here you go:", 'output-info');
        term.log("🥪", 'output-highlight');
    };

    commands.neofetch = (term, args) => {
        console.log("Executing neofetch command");
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
        console.log(`Registering command: ${commandName}`);
        terminal.registerCommand(commandName, commands[commandName]);
    });

    // Add aliases
    terminal.registerCommand('?', commands.help);
    terminal.registerCommand('ls', commands.projects);
    terminal.registerCommand('man', commands.help);
    terminal.registerCommand('pwd', (term, args) => { console.log("Executing pwd command"); term.log('/home/user'); });
    terminal.registerCommand('date', (term, args) => { console.log("Executing date command"); term.log(new Date().toLocaleString()); });
    console.log("Commands registered.");
}

// --- Main Execution Flow ---
// Use window.load to ensure all resources (like CDN Three.js, fonts) are loaded.
window.addEventListener('load', async () => {
    console.log("Window loaded. Initializing application...");
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const promptSymbol = document.getElementById('prompt-symbol');
    const canvas = document.getElementById('three-canvas'); // Still get canvas, even if Three.js setup might fail

    let terminal;

    // Check for essential DOM elements first
    if (!terminalOutput || !terminalInput || !promptSymbol) { // Canvas might be null if Three.js fails, but terminal needs others.
        console.error("Essential DOM elements (terminal output, input, prompt) not found. Please check index.html.");
        document.body.innerHTML = '<div style="color: red; text-align: center; margin-top: 50px;">Error: Essential page elements (terminal output, input, prompt) are missing. Please check index.html for correctness.</div>';
        return; // Stop execution if essential elements are missing
    }

    try {
        console.log("Starting Terminal initialization...");
        terminal = new Terminal(terminalOutput, terminalInput, promptSymbol);
        // Use await for boot sequence
        await terminal.boot(); 
        console.log("Terminal boot complete.");

        console.log("Registering commands...");
        registerCommands(terminal);
        console.log("Commands registered.");

        // Only attempt Three.js setup if canvas exists and is usable
        if (canvas) {
            console.log("Setting up Three.js scene...");
            const threeSceneApi = setupThreeScene(canvas, terminal); 
            if (threeSceneApi) {
                terminal.setThreeScene(threeSceneApi);
                console.log("Three.js scene setup successful.");
            } else {
                console.warn("Three.js scene setup failed. 3D effects might be disabled.");
                // Terminal.log is available here, so we can inform the user.
                terminal.log("Warning: 3D effects could not be initialized. Continuing with text-only mode.", "output-info");
            }
        } else {
            console.warn("Canvas element not found for Three.js. 3D effects will be disabled.");
            terminal.log("Warning: 3D canvas not found. 3D effects are disabled.", "output-info");
        }

        document.body.classList.add('loaded');
        terminal.focusInput();
        console.log("Application initialized successfully.");
    } catch (error) {
        console.error("Error during application initialization:", error);
        // Display a user-friendly error message if initialization fails
        if(terminalOutput) { // Ensure terminalOutput exists before trying to modify it
             terminalOutput.innerHTML = `<div class="output-error">Initialization failed: ${error.message}. Check console for details.</div>`;
        } else {
            document.body.innerHTML = `<div style="color: red; text-align: center; margin-top: 50px;">Error: Critical initialization failed: ${error.message}. Check console for details.</div>`;
        }
        // Disable input if initialization fails critically
        if(terminalInput) {
            terminalInput.disabled = true;
        }
    }
});
