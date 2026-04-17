import { commands } from './commands.js'; // Commands will be registered here

const TYPE_SPEED = 20; // Milliseconds per character
const BOOT_DELAY = 50; // Milliseconds between boot sequence steps
const CURSOR_BLINK_RATE = 500; // Milliseconds for cursor blink

export class Terminal {
    constructor(outputElement, inputElement, promptSymbolElement) {
        this.outputElement = outputElement;
        this.inputElement = inputElement;
        this.promptSymbolElement = promptSymbolElement;
        this.history = [];
        this.historyIndex = -1;
        this.commandQueue = [];
        this.isBooting = true;
        this.isTyping = false;
        this.currentLine = '';
        this.commandRegistry = {}; // Will be populated by registerCommands
        this.commandHistory = [];
        this.commandHistoryIndex = -1;

        // Store reference to threeScene for later use
        this.threeScene = null;

        // Event listeners for input
        this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.inputElement.addEventListener('input', this.handleInput.bind(this));

        // Cursor blinking
        this.cursorInterval = null;
        this.isCursorVisible = true;
    }

    // --- Boot Sequence ---
    async boot() {
        this.log("Initializing system...");
        await this.typeString("Initializing system...", BOOT_DELAY);
        this.log("Verifying hardware...");
        await this.typeString("Verifying hardware...", BOOT_DELAY);
        this.log("Loading kernel modules...");
        await this.typeString("Loading kernel modules...", BOOT_DELAY);
        this.log("Mounting file system...");
        await this.typeString("Mounting file system...", BOOT_DELAY);

        // Simulate a boot progress bar (optional)
        this.outputElement.innerHTML += '<div class="output-line">Boot Progress: [==========] 100%</div>';
        await new Promise(resolve => setTimeout(resolve, 300));

        this.log("System online. Type 'help' for a list of commands.");
        await this.typeString("System online. Type 'help' for a list of commands.", BOOT_DELAY * 2);
        this.isBooting = false;
        this.startCursorBlinking();
        this.inputElement.disabled = false;
        this.focusInput();
    }

    // --- Logging and Typing ---
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
        this.inputElement.disabled = true; // Disable input while typing

        for (let i = 0; i < text.length; i++) {
            this.outputElement.lastChild.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        this.isTyping = false;
        this.inputElement.disabled = false;
        this.focusInput();
        this.scrollToBottom();
    }

    // --- Input Handling ---
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
                    event.preventDefault(); // Prevent default if value is empty
                }
                break;
            // Allow other keys to be handled by 'input' event
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
            this.log(`> ${commandLine}`, 'output-command'); // Log the command as typed
            this.commandHistory.push(commandLine);
            this.commandHistoryIndex = this.commandHistory.length; // Reset history index
            this.inputElement.value = ''; // Clear input
            this.currentLine = '';
            this.updateCursor();

            const [command, ...args] = commandLine.split(' ');
            const handler = this.commandRegistry[command];

            if (handler) {
                try {
                    handler(this, args); // Pass terminal instance and args to handler
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
            // If Enter is pressed on empty input, just clear the line and reset prompt
            this.inputElement.value = '';
            this.currentLine = '';
            this.updateCursor();
            this.log(""); // Add a blank line to maintain spacing if needed
        }
        this.focusInput(); // Ensure focus after execution
    }

    // --- History Navigation ---
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.commandHistoryIndex += direction;

        if (this.commandHistoryIndex < 0) {
            this.commandHistoryIndex = 0;
        } else if (this.commandHistoryIndex >= this.commandHistory.length) {
            this.commandHistoryIndex = this.commandHistory.length -1;
            // If we go past the last command, clear the input to show empty prompt
            if (direction === 1) {
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

    // --- Tab Completion ---
    handleTabCompletion() {
        const currentInput = this.inputElement.value.toLowerCase();
        const availableCommands = Object.keys(this.commandRegistry);
        const matches = availableCommands.filter(cmd => cmd.startsWith(currentInput));

        if (matches.length === 1) {
            this.inputElement.value = matches[0];
            this.currentLine = matches[0];
        } else if (matches.length > 1) {
            this.log(matches.join('  '), 'output-info'); // Show possible commands
            // Optionally, we could try to complete the common prefix if any
        }
        this.updateCursor();
    }

    // --- Cursor Management ---
    startCursorBlinking() {
        if (this.cursorInterval) clearInterval(this.cursorInterval);
        this.cursorInterval = setInterval(() => {
            this.isCursorVisible = !this.isCursorVisible;
            this.updateCursor();
        }, CURSOR_BLINK_RATE);
    }

    stopCursorBlinking() {
        if (this.cursorInterval) clearInterval(this.cursorInterval);
        this.isCursorVisible = true; // Ensure cursor is visible when stopped
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
        this.inputElement.disabled = false; // Ensure it's enabled
        this.startCursorBlinking(); // Restart blinking on focus
    }

    blurInput() {
        this.inputElement.blur();
        this.stopCursorBlinking();
    }

    // --- Utility ---
    scrollToBottom() {
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    // --- For Three.js Integration ---
    setThreeScene(scene) {
        this.threeScene = scene;
    }

    // Helper to get command registry
    getCommandRegistry() {
        return this.commandRegistry;
    }

     // Helper to register commands
    registerCommand(commandName, handler) {
        this.commandRegistry[commandName] = handler;
    }
}
