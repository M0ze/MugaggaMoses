```markdown
# 🚀 Moses' Terminal Portfolio

**`whoami` → A futuristic command-line portfolio from Uganda. Built to feel like you just SSH'd into my digital mind.**

[![Three.js Powered](https://img.shields.io/badge/Three.js-0x000000?style=flat&logo=three.js&logoColor=white)](https://threejs.org)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Available_Soon-ff0077?style=flat&logo=githubpages&logoColor=white)](https://mugaggamoses.github.io/terminal-portfolio/) <!-- Placeholder, update with actual URL -->

A fully interactive, retro-futuristic **terminal-themed portfolio website** that looks and behaves like a real hacker terminal — complete with blinking cursor, command history, tab autocomplete, and **stunning Three.js 3D animations** that react to your inputs.

This is not just a portfolio. It’s an *experience*. Type commands. Watch the matrix come alive. Explore my work in a sci-fi interface that screams “developer who actually ships cool stuff.”

---

## ✨ Vision & Core Experience

Imagine booting into a 90s CRT terminal… but it’s 2026, running on Three.js via CDN, and every command triggers beautiful 3D animations in the background.

- **Full-screen immersive terminal** (with subtle bezel and scanline effects)
- **Real-time interactive 3D canvas** layered behind the terminal (particles, floating code orbs, reactive effects)
- **Zero friction navigation** — no clicking menus, just type like a pro
- **Blazing fast, mobile-friendly**, and feels premium on every device
- **Static site**, easily deployable to GitHub Pages, Netlify, Vercel, etc.

---

## 🎮 Features (The 5-Star Stuff)

### Terminal Core
- Blinking green cursor with realistic typing animation
- Command history (`↑` / `↓` arrows)
- Tab autocomplete for all commands
- `clear` command + auto-scroll
- Fake boot sequence on page load (with progress bar and “SYSTEM ONLINE” message)
- Subtle CRT effects: scanlines, glow, slight flicker (toggleable)

### Three.js Animations (The Wow Factor)
- **Background Scene**: Infinite 3D particle field of glowing code fragments / floating hexagons that react to mouse movement and terminal commands.
- **Command Triggers**:
  - `projects` → 3D rotating cubes fly in, each representing a project (clickable in 3D space)
  - `skills` → Skill icons orbit the camera in a beautiful ring
  - `matrix` → Full-screen Matrix digital rain (Three.js powered)
  - `about` / `contact` → Gentle particle explosion + camera shake
- Post-processing: bloom, glitch effect on command errors
- Smooth 60fps with performance fallbacks
- Responsive canvas that resizes perfectly

### Available Commands

| Command          | Description                              | What Happens Visually                  |
|------------------|------------------------------------------|----------------------------------------|
| `help` / `?`     | List all commands                        | Clean formatted list                   |
| `about`          | My story                                 | Bio card + particle burst              |
| `skills`         | Tech stack with levels                   | 3D orbiting icons                      |
| `experience`     | Work & education timeline                | Timeline with fade-ins                 |
| `projects`       | My best work                             | 3D project cubes fly in                |
| `contact`        | Reach me                                 | Social links + email copy button       |
| `whoami`         | Quick identity                           | Terminal-style system info             |
| `matrix`         | Activate digital rain                    | Full Matrix mode (toggle with `exit`)  |
| `clear`          | Clear screen                             | Instant wipe                           |
| `ls`             | Alias for projects                       | Same as `projects`                     |
| `cat README.md`  | Easter egg — shows this README summary   | Formatted text                         |
| `theme glitch`   | Toggle glitch mode                       | Instant Three.js post-processing       |

Easter eggs included (`sudo make me a sandwich`, `neofetch`, etc.).

---

## 🧬 Tech Stack

-   **HTML5 + CSS3** (Custom monospace font: `VT323` via Google Fonts)
-   **Vanilla JavaScript** (ES6+)
-   **Three.js** (latest stable, included via CDN)
-   **No build tools (like Vite/Webpack) or package managers (like npm)** due to environment restrictions.

**Project Structure:**

```
├── index.html
├── style.css
├── script.js
└── public/
    └── fonts/  (Note: Font is now loaded via Google Fonts CDN, this dir may be redundant)
```

---

## 📋 Content (Copy-Paste Ready)

**Name**: Mugagga Moses  
**Location**: Uganda 🇺🇬  
**Tagline**: Turning coffee into interactive 3D experiences.

**About** (use this exact text):
```
Hi, I'm Moses Lyn— a creative developer from Uganda obsessed with making the web feel alive.

I build terminal-style portfolios, Three.js worlds, and AI-powered tools just for fun. 
When I'm not coding, I'm probably exploring Gemini CLI or contributing to open-source projects.

Currently hacking on the next generation of immersive developer experiences.
```

**Skills** (with levels for visual progress bars):
- JavaScript / TypeScript — 95%
- Three.js — 90%
- React / Next.js — 85%
- Node.js — 80%
- Tailwind + CSS Art — 95%
- AI Tooling & Prompt Engineering — 88%

**Projects** (replace links with yours):
1. **Terminal Portfolio** — This very site
2. **Gemini CLI Experiments** — Collection of AI-powered terminal tools
3. **3D Portfolio Engine** — Reusable Three.js template (open source)

**Contact**:
- X: [@MozesMugagga](https://x.com/MozesMugagga)
- Email: [mugaggamozes@gmail.com] (Click to copy)
- GitHub: [M0ze](https://github.com/M0ze)

---

## 🚀 Development & Deployment

This project is designed for simple static deployment.

**To run locally:**
1.  Serve the files using a simple HTTP server. For example, if you have Python 3 installed, navigate to the project directory in your terminal and run:
    `python -m http.server`
2.  Open your browser to `http://localhost:8000` (or the port specified by your server).

**To deploy to GitHub Pages:**
1.  Ensure your project is pushed to a GitHub repository.
2.  Configure your GitHub repository's Pages settings to deploy from the `main` branch (or a specific `gh-pages` branch if you prefer to push builds there).
3.  Alternatively, set up a GitHub Actions workflow to build and deploy to the `gh-pages` branch automatically on push to `main`.

**Success Criteria**:
- Typing `help` feels magical
- Background animations are smooth and never lag
- It looks good and feels interactive
- Deployable to static hosting platforms.
---

## 🎨 Design References (Mood Board)

- Retro CRT terminals (green text, black screen, scanlines)
- Sci-fi interfaces

---

**Made with 🔥 in Uganda  by Mugagga Moses.**
```