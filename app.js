const input = document.getElementById('input');
const output = document.getElementById('output');
const terminal = document.getElementById('terminal');

const commands = {
    help: '
Available commands:\n  help      - Display this help message\n  about     - Show information about me\n  projects  - List my projects\n  contact   - Show contact information\n  clear     - Clear the terminal screen\n  welcome   - Display the welcome message again',
    about: 'I am a [Your Name/Alias], a [Your Role, e.g., Software Developer, Security Enthusiast]. I love coding and building cool things.',
    projects: '
My Projects:\n  Project 1 - [Brief Description]. Link: [Link if available]\n  Project 2 - [Brief Description]. Link: [Link if available]\n  Project 3 - [Brief Description]. Link: [Link if available]',
    contact: 'You can reach me at: \n  Email: [your.email@example.com]\n  GitHub: [your.github.username]\n  LinkedIn: [your.linkedin.profile]',
    welcome: 'Welcome to my Hacker Portfolio!\nType `help` to see available commands.'
};

function displayOutput(text, type = 'output-line') {
    const p = document.createElement('p');
    p.textContent = text;
    p.classList.add(type);
    output.appendChild(p);
    // Scroll to the bottom
    terminal.scrollTop = terminal.scrollHeight;
}

function handleCommand(command) {
    // Echo the command
    displayOutput(`> ${command}`, 'command-echo');

    command = command.trim().toLowerCase();

    if (command === 'clear') {
        output.innerHTML = '';
    } else if (commands[command]) {
        displayOutput(commands[command]);
    } else {
        displayOutput(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
    }
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value;
        handleCommand(command);
        input.value = ''; // Clear input field
    }
});

// Initial welcome message
displayOutput(commands.welcome);

// Keep input focused
terminal.addEventListener('click', () => {
    input.focus();
});

// Initial focus
input.focus(); 