import { Terminal } from './terminal.js'; // Not strictly needed here, but good for context
import { setupThreeScene } from './three-scene.js'; // Assuming this is imported elsewhere

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
// This object will be populated by registerCommands function
export const commands = {};

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
        // Store data for Three.js cubes
        projectElements.push({
            mesh: null, // Placeholder, will be created by three-scene.js
            ...project,
            id: `project-${index}`
        });
    });

    // Trigger Three.js to create cubes
    if (terminal.threeScene && terminal.threeScene.createProjectCubes) {
        terminal.threeScene.createProjectCubes(); // This populates terminal.threeScene.projectCubes
        // We need to link our projectElements to the actual THREE meshes
        // This assumes createProjectCubes populates it in the same order
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

    // Make email clickable and add copy functionality
    const emailElement = content.querySelector('a[href^="mailto:"]'); // Find mailto link placeholder
    if (emailElement) {
        const emailAddress = "mugaggamozes@gmail.com"; // Hardcoded from content
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

    // Make social links clickable
    content.querySelectorAll('.output-line a').forEach(link => {
        link.classList.add('output-link');
        link.target = '_blank'; // Open in new tab
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
        <div class="output-line">Tech Stack: Vanilla JS, Three.js, Tailwind CSS, Vite.</div>
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

// --- Command Implementation ---
function registerCommands(terminal) {
    // Override commands object to register actual handlers
    commands.help = (term, args) => {
        const helpContent = renderHelp();
        term.outputElement.appendChild(helpContent);
        term.scrollToBottom();
    };
    commands.clear = (term, args) => {
        term.outputElement.innerHTML = '';
        if (term.threeScene) {
            term.threeScene.deactivateMatrixRain(); // Ensure matrix is off when clearing
            term.threeScene.commandHandlers.clearCommandElements(); // Clear any 3D elements
        }
        // Re-add prompt if necessary, but terminal handles it
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

        // Trigger Three.js skill icons animation
        if (term.threeScene && term.threeScene.createSkillIcons) {
            term.threeScene.createSkillIcons();
            term.threeScene.commandHandlers.activateCommandElements(term.threeScene.skillIcons); // Activate them in the scene
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
        term.log("🥪", 'output-highlight'); // Simple sandwich emoji
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

    // Register all commands to the terminal instance
    Object.keys(commands).forEach(commandName => {
        terminal.registerCommand(commandName, commands[commandName]);
    });

    // Add aliases
    terminal.registerCommand('?', commands.help);
    terminal.registerCommand('ls', commands.projects);
    terminal.registerCommand('man', commands.help); // Simple alias
    terminal.registerCommand('pwd', (term, args) => term.log('/home/user')); // Mock pwd
    terminal.registerCommand('date', (term, args) => term.log(new Date().toLocaleString())); // Mock date
}
