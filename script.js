// script.js - Simplified Vanilla JS for Terminal Portfolio

// --- Content Data ---
const developerName = "Mugagga Moses";
const developerLocation = "Uganda";
const developerShortName = "Moses";

const aboutContent = `
Hi, I'm ${developerShortName} Lyn— a creative developer from ${developerLocation} obsessed with making the web feel alive.
I build terminal-style portfolios and work on web experiences. When I'm not coding, I'm exploring new technologies.
`;

const skillsData = {
    languages: [
        { name: "JavaScript", level: 95, icon: "💻" },
        { name: "TypeScript", level: 90, icon: "🔷" },
        { name: "Python", level: 80, icon: "🐍" },
        { name: "HTML", level: 98, icon: "📄" },
        { name: "CSS", level: 95, icon: "🎨" },
    ],
    frameworks: [
        { name: "React", level: 85, icon: "⚛️" },
        { name: "Node.js", level: 80, icon: "💡" },
        { name: "Express.js", level: 75, icon: "🚀" },
        { name: "Tailwind CSS", level: 95, icon: "💨" },
    ],
    tools: [
        { name: "Git", level: 90, icon: "🐙" },
        { name: "Docker", level: 70, icon: "🐳" },
        { name: "VS Code", level: 90, icon: "💻" },
        { name: "Vim", level: 99, icon: "✍️" },
    ],
    concepts: [
        { name: "Performance Optimization", level: 90, icon: "⚡" },
        { name: "Responsive Design", level: 95, icon: "📱" },
        { name: "API Design", level: 80, icon: "🔗" },
        { name: "Problem Solving", level: 98, icon: "🧠" },
    ]
};

const projectsData = [
    { title: "Terminal Portfolio", description: "This very site! A retro-futuristic developer portfolio.", tech: ["HTML", "CSS", "Vanilla JS"], link: "#", github: "#" },
    { title: "Gemini CLI Experiments", description: "AI-powered command-line tools.", tech: ["Node.js", "Python", "AI"], link: "#", github: "#" },
    { title: "3D Portfolio Engine", description: "Reusable Three.js template for 3D portfolio experiences.", tech: ["Three.js", "JavaScript", "GLSL"], link: "#", github: "#" },
    { title: "Personal Blog", description: "A space for sharing thoughts and tutorials.", tech: ["Markdown", "Static Site"], link: "#", github: "#" },
    { title: "Open Source Contributions", description: "Contributing to various impactful open-source projects.", tech: ["Various"], link: "#", github: "#" }
];

const experienceData = [
    { title: "Senior Software Engineer", company: "Tech Innovations Inc.", duration: "2023 - Present", description: "Leading development of advanced web applications." },
    { title: "Full-Stack Developer", company: "Creative Solutions Ltd.", duration: "2021 - 2023", description: "Built and maintained scalable client-facing platforms." },
    { title: "Junior Developer", company: "Startup Hub", duration: "2020 - 2021", description: "Gained foundational experience in web development." },
    { title: "Computer Science Student", company: "University of Uganda", duration: "2016 - 2020", description: "Studied core computer science principles." },
];

const contactLinks = [
    { name: "GitHub", url: "https://github.com/M0ze", icon: "🐙" },
    { name: "X (Twitter)", url: "https://x.com/MozesMugagga", icon: "❌" },
    { name: "LinkedIn", url: "#", icon: "👔" },
    { name: "Twitch", url: "#", icon: "▶️" }
];

// --- DOM Elements ---
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const promptSymbol = document.getElementById('prompt-symbol');
const crtContainer = document.getElementById('crt-container'); // For theme switching

// --- Terminal Core Logic (Simplified) ---
class Terminal {
    constructor(outputEl, inputEl, promptEl) {
        this.outputElement = outputEl;
        this.inputElement = inputEl;
        this.promptSymbol = promptEl;
        this.commands = {}; // Command registry
        this.commandHistory = [];
        this.commandHistoryIndex = -1;
        this.currentSection = 'home'; // Track current displayed section
        this.isThemeDark = true; // Default to dark mode

        this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.inputElement.addEventListener('input', this.handleInput.bind(this));
        
        this.cursorInterval = null;
        this.isCursorVisible = true;
    }

    init() {
        console.log("Initializing Terminal...");
        this.outputElement.innerHTML = ''; // Clear any previous content
        this.logLine("Welcome to Mugagga Moses' Portfolio!");
        this.log("Type 'help' for available commands.");
        this.setTheme(this.isThemeDark ? 'dark-mode' : 'bright-mode'); // Ensure initial theme is set
        this.startCursorBlinking();
        this.inputElement.disabled = false;
        this.focusInput();
        console.log("Terminal initialized.");
    }

    logLine(message, type = 'output-line') {
        console.log(`Logging: "${message}" with type: ${type}`);
        const line = document.createElement('div');
        line.className = type;
        line.textContent = message; // Use textContent for safety
        this.outputElement.appendChild(line);
        this.scrollToBottom();
        return line;
    }

    // Simplified typing for initial messages or confirmations if needed
    async typeString(text, delay = 20) {
        console.log(`Typing: "${text}"`);
        this.isTyping = true;
        this.inputElement.disabled = true;

        for (let i = 0; i < text.length; i++) {
            if (!this.outputElement.lastChild) {
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
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                this.executeCommand();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault();
                this.navigateHistory(event.key === 'ArrowUp' ? -1 : 1);
                break;
            case 'Tab':
                event.preventDefault();
                this.handleTabCompletion();
                break;
        }
    }

    handleInput() {
        this.currentLine = this.inputElement.value;
        this.updateCursor();
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
            const handler = this.commands[command];

            if (handler) {
                try {
                    console.log(`Executing command: ${command}`);
                    handler(this, args);
                } catch (error) {
                    console.error(`Error executing command "${command}":`, error);
                    this.log(`Error: ${error.message}`, 'output-error');
                }
            } else {
                thisd.log(`Command not found: ${command}. Type 'help' for assistance.`, 'output-error');
            }
        } else {
            this.inputElement.value = '';
            this.currentLine = '';
            this.updateCursor();
            this.log(""); // Add a blank line
        }
        this.focusInput();
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        this.commandHistoryIndex += direction;
        if (this.commandHistoryIndex < 0) this.commandHistoryIndex = 0;
        else if (this.commandHistoryIndex >= this.commandHistory.length) {
            this.commandHistoryIndex = this.commandHistory.length - 1;
             if (direction === 1) { // Moving down past the end clears input
                 this.inputElement.value = ''; this.currentLine = ''; this.updateCursor(); return;
            }
        }
        this.inputElement.value = this.commandHistory[this.commandHistoryIndex];
        this.currentLine = this.inputElement.value;
        this.inputElement.setSelectionRange(this.currentLine.length, this.currentLine.length);
        this.updateCursor();
    }

    handleTabCompletion() {
        const currentInput = this.inputElement.value.toLowerCase();
        const availableCommands = Object.keys(this.commands);
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
        if (!cursorElement) return;
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
        console.index.html
    };
    commands.theme = (term, args) => {
        console.log("Executing theme command");
        const newTheme = args[0] === 'light' ? 'bright-mode' : 'dark-mode';
        document.body.className = newTheme; // Directly set class on body
        crtContainer.className = newTheme; // Also apply to container for bezel/scanlines
        term.log(`Theme set to: ${newTheme === 'bright-mode' ? 'Bright' : 'Dark'}`);
        // Update cursor color based on theme
        const promptSymbol = document.getElementById('prompt-symbol');
        const terminalInput = document.getElementById('terminal-input');
        if (promptSymbol) promptSymbol.style.color = newTheme === 'bright-mode' ? '#000000' : '#00ff00';
        if (terminalInput) terminalInput.style.caretColor = newTheme === 'bright-mode' ? '#000000' : '#00ff00';
    };
    commands.whoami = (term, args) => {
        console.log("Executing whoami command");
        term.log(`User: ${developerName}`);
        term.log(`Host: ${window.location.hostname || 'localhost'}`);
        term.log(`OS: ${navigator.platform}`);
        term.log(`Location: ${developerLocation}`);
        term.log(`Shell: Bash (simulated)`);
        term.log(`Uptime: Calculating...`);
    };
    commands.skills = (term, args) => {
        console.log("Executing skills command");
        const skillsContent = document.createElement('div');
        skillsContent.id = 'skills-content';
        skillsContent.innerHTML = '<div class="output-line"><strong>Skills:</strong></div>';
        Object.keys(skillsData).forEach(category => {
            skillsContent.innerHTML += `<div class="output-line font-roboto-mono" style="font-weight: bold;">${category.charAt(0).toUpperCase() + category.slice(1)}:</div>`;
            skillsData[category].forEach(skill => {
                skillsContent.innerHTML += `
                    <div class="output-line">
                        <span class="skill-label">${skill.name}</span>
                        <div class="skill-bar-container">
                            <div class="skill-bar" style="width: ${skill.level}%;"></div>
                        </div>
                    </div>
                `;
            });
        });
        term.outputElement.appendChild(skillsContent);
        term.scrollToBottom();
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
// Use window.load to ensure all resources (like CDN, fonts) are loaded.
window.addEventListener('load', async () => {
    console.log("Window loaded. Initializing application...");
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const promptSymbol = document.getElementById('prompt-symbol');
    const crtContainer = document.getElementById('crt-container'); // For theme switching

    let terminal;

    // Check for essential DOM elements first
    if (!terminalOutput || !terminalInput || !promptSymbol || !crtContainer) {
        console.error("Essential DOM elements (terminal output, input, prompt, crt-container) not found. Please check index.html.");
        document.body.innerHTML = '<div style="color: red; text-align: center; margin-top: 50px;">Error: Essential page elements are missing. Please check index.html for correctness.</div>';
        return; // Stop execution if essential elements are missing
    }

    try {
        console.log("Starting Terminal initialization...");
        terminal = new Terminal(terminalOutput, terminalInput, promptSymbol);
        
        // Initialize terminal and boot sequence
        await terminal.boot(); 
        console.log("Terminal boot complete.");

        console.log("Registering commands...");
        registerCommands(terminal);
        console.log("Commands registered.");

        // Theme toggle logic
        const themeToggle = document.getElementById('theme-toggle'); // Assuming a toggle element exists or will be added
        const applyTheme = (isDark) => {
            document.body.classList.toggle('dark-mode', isDark);
            crtContainer.classList.toggle('dark-mode', isDark);
            if (promptSymbol) promptSymbol.style.color = isDark ? '#00ff00' : '#000000';
            if (terminalInput) terminalInput.style.caretColor = isDark ? '#00ff00' : '#000000';
            // Update prompt symbol text if needed
            promptSymbol.textContent = isDark ? '>' : '>'; // Can be changed for different themes
            terminal.isThemeDark = isDark;
            console.log(`Theme set to: ${isDark ? 'Dark' : 'Bright'}`);
        };
        
        // Initial theme setting based on crtContainer class (from HTML)
        terminal.isThemeDark = crtContainer.classList.contains('dark-mode');
        applyTheme(terminal.isThemeDark);

        // Command for theme toggle
        terminal.commands.theme = (term, args) => {
            const newTheme = args[0] === 'light' ? 'bright-mode' : 'dark-mode';
            const isDark = newTheme === 'dark-mode';
            applyTheme(isDark);
            term.log(`Theme set to: ${isDark ? 'Dark' : 'Bright'}`);
        };
        terminal.registerCommand('theme', terminal.commands.theme);
        terminal.registerCommand('light', (term) => terminal.commands.theme(term, ['light']));
        terminal.registerCommand('dark', (term) => terminal.commands.theme(term, ['dark']));


        document.body.classList.add('loaded');
        terminal.focusInput();
        console.log("Application initialized successfully.");
    } catch (error) {
        console.error("Error during application initialization:", error);
        if(terminalOutput) {
             terminalOutput.innerHTML = `<div class="output-error">Initialization failed: ${error.message}. Check console for details.</div>`;
        } else {
            document.body.innerHTML = `<div style="color: red; text-align: center; margin-top: 50px;">Error: Critical initialization failed: ${error.message}. Check console for details.</div>`;
        }
        if(terminalInput) {
            terminalInput.disabled = true;
        }
    }
});
