import { Terminal } from './terminal.js';
import { setupThreeScene } from './three-scene.js';
import { registerCommands } from './commands.js';

const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const promptSymbol = document.getElementById('prompt-symbol');
const crtContainer = document.getElementById('crt-container');
const canvas = document.getElementById('three-canvas');

let terminal;

// --- Boot Sequence ---
async function bootSequence() {
    terminal = new Terminal(terminalOutput, terminalInput, promptSymbol);
    await terminal.boot();

    registerCommands(terminal); // Register commands after boot
    setupThreeScene(canvas, terminal); // Setup Three.js scene

    // Apply CRT effects and initial styles after boot
    document.body.classList.add('loaded');
    terminal.focusInput();
}

// --- Event Listeners ---
window.addEventListener('load', bootSequence);

// Optional: Handle window resizing for Three.js canvas
window.addEventListener('resize', () => {
    if (terminal && terminal.threeScene) {
        terminal.threeScene.resizeCanvas();
    }
});

// Allow typing directly onto the page when terminal is not focused, but input is active
document.addEventListener('keydown', (event) => {
    if (!terminalInput.matches(':focus') && event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
        terminal.focusInput();
        terminalInput.value += event.key;
        event.preventDefault();
    } else if (event.key === 'Tab') {
        event.preventDefault(); // Prevent default tab behavior
        terminal.handleTabCompletion();
    }
});
