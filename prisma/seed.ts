import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const curriculum = [
  // ────────────────────────────────────────────────────────────────────
  // Day 0 — Setup. Run before Wednesday "housework" session.
  // Cohort path: Setup (Wed) → History of AI (Wk 1) → Claude API → Agents
  // (Wks 2–5). Self-paced reference courses sort after.
  // ────────────────────────────────────────────────────────────────────
  {
    title: "Day 0: Set Up Your Computer",
    slug: "setup",
    description:
      "Before your first class, get every tool installed and working — Git, Node.js, Python, VS Code, and Claude Code. Step-by-step instructions for Mac, Windows, and Linux. No prior experience required.",
    published: true,
    order: -1,
    modules: [
      {
        title: "Welcome — Read This First",
        order: 0,
        lessons: [
          {
            title: "What You'll Install and Why",
            slug: "what-you-will-install",
            order: 0,
            duration: 5,
            content: `<h2>Welcome — Let's Get Your Computer Ready</h2>
<p>Before your first class, we want to make sure your computer has everything you need. This is what we call <strong>"housework"</strong> — boring but important. Once it's done, you won't have to think about it again.</p>

<p>This course works for <strong>any computer</strong>: Mac, Windows, or Linux. Pick the module below that matches your computer and follow it from top to bottom. Don't skip steps.</p>

<h3>What You'll Install</h3>
<ul>
<li><strong>A Package Manager</strong> — A tool that installs other tools. Homebrew on Mac, winget on Windows, apt on Linux.</li>
<li><strong>Git + GitHub</strong> — How developers save and share code. Like Google Drive for code.</li>
<li><strong>Node.js</strong> — Lets your computer run JavaScript. Most modern web tools need it.</li>
<li><strong>Python</strong> — A programming language used heavily in AI and data science.</li>
<li><strong>VS Code</strong> — The text editor where you'll write code. Free, made by Microsoft.</li>
<li><strong>Claude Code</strong> — Anthropic's AI coding assistant. The reason you're here.</li>
</ul>

<h3>How Long Will This Take?</h3>
<p>Plan for <strong>30 to 60 minutes</strong>. Some installs take a few minutes to download. Be patient.</p>

<h3>What You'll Need</h3>
<ul>
<li>Your computer (admin access — you must be able to install things)</li>
<li>A reliable internet connection</li>
<li>A Claude account — sign up free at <a href="https://claude.ai" target="_blank" rel="noopener">claude.ai</a> if you haven't yet</li>
</ul>

<h3>Pick Your Path</h3>
<p>Go to the module that matches your computer:</p>
<ul>
<li><strong>Mac</strong> — Module 2</li>
<li><strong>Windows</strong> — Module 3</li>
<li><strong>Linux</strong> (Ubuntu/Debian) — Module 4</li>
</ul>

<h3>If You Get Stuck</h3>
<p>That's normal. Read the error message out loud. Copy and paste it into Claude or Google. Or message us in the cohort chat. Don't give up — every developer has been exactly where you are right now.</p>`,
          },
        ],
      },
      {
        title: "Mac Setup",
        order: 1,
        lessons: [
          {
            title: "Mac — Install Everything",
            slug: "mac-install-everything",
            order: 0,
            duration: 30,
            content: `<h2>Mac — Install Everything</h2>
<p>Follow these steps in order. After each install, the command in the next step might say "command not found" — close your Terminal window and open a new one to refresh it.</p>

<h3>Step 1 — Open the Terminal</h3>
<p>Press <kbd>Cmd</kbd>+<kbd>Space</kbd>, type <code>Terminal</code>, hit Enter. A window with a blinking cursor opens. This is where you'll paste commands.</p>

<h3>Step 2 — Install Xcode Command Line Tools</h3>
<p>This gives you the basic developer tools Apple ships. Paste this into Terminal and press Enter:</p>
<pre><code>xcode-select --install</code></pre>
<p>A pop-up will appear. Click <strong>Install</strong>. It takes a few minutes. Wait for it to finish before continuing.</p>

<h3>Step 3 — Install Homebrew</h3>
<p>Homebrew is a package manager — it installs other tools for you. Paste this whole line:</p>
<pre><code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code></pre>
<p>It will ask for your Mac password. Type it (you won't see the letters — that's normal) and press Enter.</p>
<p>When it finishes, it usually prints two more commands at the bottom asking you to run them to "add Homebrew to your PATH". <strong>Copy and paste those commands and run them.</strong> Then close Terminal and open it again.</p>
<p>Verify it worked:</p>
<pre><code>brew --version</code></pre>
<p>You should see something like <code>Homebrew 4.x.x</code>.</p>

<h3>Step 4 — Install Git</h3>
<pre><code>brew install git</code></pre>
<p>Verify:</p>
<pre><code>git --version</code></pre>

<h3>Step 5 — Connect Git to Your Name and Email</h3>
<p>Replace the values with your real name and the email you use on GitHub:</p>
<pre><code>git config --global user.name "Your Name"
git config --global user.email "you@example.com"</code></pre>

<h3>Step 6 — Install Node.js</h3>
<pre><code>brew install node</code></pre>
<p>Verify:</p>
<pre><code>node --version
npm --version</code></pre>
<p>Node should be v22 or higher. <code>npm</code> comes with Node — no separate install.</p>

<h3>Step 7 — Install Python</h3>
<pre><code>brew install python</code></pre>
<p>Verify:</p>
<pre><code>python3 --version
pip3 --version</code></pre>

<h3>Step 8 — Install VS Code</h3>
<pre><code>brew install --cask visual-studio-code</code></pre>
<p>VS Code now appears in your Applications folder. Open it once to make sure it works, then close it.</p>

<h3>Step 9 — Install Claude Code</h3>
<p>This is the one you're here for. Anthropic's official installer:</p>
<pre><code>curl -fsSL https://claude.ai/install.sh | bash</code></pre>
<p>Close Terminal and open it again.</p>
<p>Now run:</p>
<pre><code>claude</code></pre>
<p>It will open your browser to log in. Use the same email as your Claude account. Once you're logged in, you'll see Claude Code's welcome screen in the Terminal. Type <code>/exit</code> to quit for now.</p>

<h3>You're Done with Installs</h3>
<p>Move to the next lesson — <strong>Mac — Verify Everything Works</strong> — to confirm everything is installed correctly.</p>`,
          },
          {
            title: "Mac — Verify Everything Works",
            slug: "mac-verify",
            order: 1,
            duration: 5,
            content: `<h2>Mac — Verify Everything Works</h2>
<p>Open a fresh Terminal window. Run each command below. The number after each tool's name might be different — that's fine. What matters is that you don't see <strong>"command not found"</strong>.</p>

<h3>Run These One at a Time</h3>
<pre><code>brew --version</code></pre>
<p>Expected: <code>Homebrew 4.x.x</code></p>

<pre><code>git --version</code></pre>
<p>Expected: <code>git version 2.x.x</code></p>

<pre><code>node --version</code></pre>
<p>Expected: <code>v22.x.x</code> or higher</p>

<pre><code>npm --version</code></pre>
<p>Expected: <code>10.x.x</code> or higher</p>

<pre><code>python3 --version</code></pre>
<p>Expected: <code>Python 3.12.x</code> or higher</p>

<pre><code>code --version</code></pre>
<p>Expected: a version number on the first line. If you see <code>command not found</code>, open VS Code, press <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>, type <code>shell command</code>, and pick <strong>Install 'code' command in PATH</strong>. Then re-run.</p>

<pre><code>claude --version</code></pre>
<p>Expected: a version number.</p>

<h3>If Something Failed</h3>
<p>Read the error carefully — it usually tells you what's missing. Common fixes:</p>
<ul>
<li><strong>"command not found"</strong> — close Terminal and open a new one. If still missing, the install didn't finish. Re-run the install command for that tool.</li>
<li><strong>"permission denied"</strong> — you skipped a <code>brew</code> setup step. Re-read the Homebrew section.</li>
</ul>

<h3>All Green?</h3>
<p>You're ready for class. 🎉 Skip Modules 3 and 4 — those are for Windows and Linux.</p>`,
          },
        ],
      },
      {
        title: "Windows Setup",
        order: 2,
        lessons: [
          {
            title: "Windows — Install Everything",
            slug: "windows-install-everything",
            order: 0,
            duration: 35,
            content: `<h2>Windows — Install Everything</h2>
<p>You'll use <strong>winget</strong>, Windows' built-in package manager, to install most things. It comes with Windows 10 and 11 — no separate install needed.</p>

<h3>Step 1 — Open PowerShell as Administrator</h3>
<p>Click the Windows Start menu, type <code>PowerShell</code>, then <strong>right-click</strong> "Windows PowerShell" and pick <strong>Run as administrator</strong>. A blue window opens. Click "Yes" if Windows asks for permission.</p>
<p>Quick check — when you see <code>PS C:\\WINDOWS\\system32&gt;</code> at the start of the line, you're good.</p>

<h3>Step 2 — Verify winget Works</h3>
<pre><code>winget --version</code></pre>
<p>You should see something like <code>v1.x.x</code>. If you see "command not found", install <strong>App Installer</strong> from the Microsoft Store, then close and reopen PowerShell.</p>

<h3>Step 3 — Install Git</h3>
<pre><code>winget install --id Git.Git -e</code></pre>
<p>Close PowerShell and reopen it as Administrator (so the new tool is in your PATH). Then verify:</p>
<pre><code>git --version</code></pre>

<h3>Step 4 — Connect Git to Your Name and Email</h3>
<p>Replace with your real name and the email you use on GitHub:</p>
<pre><code>git config --global user.name "Your Name"
git config --global user.email "you@example.com"</code></pre>

<h3>Step 5 — Install Node.js</h3>
<pre><code>winget install --id OpenJS.NodeJS.LTS -e</code></pre>
<p>Close and reopen PowerShell, then verify:</p>
<pre><code>node --version
npm --version</code></pre>

<h3>Step 6 — Install Python</h3>
<pre><code>winget install --id Python.Python.3.12 -e</code></pre>
<p>Close and reopen PowerShell, then verify:</p>
<pre><code>python --version
pip --version</code></pre>

<h3>Step 7 — Install VS Code</h3>
<pre><code>winget install --id Microsoft.VisualStudioCode -e</code></pre>
<p>VS Code is now in your Start menu. Open it once and close it.</p>

<h3>Step 8 — Install Claude Code</h3>
<p>Anthropic's official installer for Windows. In PowerShell, paste:</p>
<pre><code>irm https://claude.ai/install.ps1 | iex</code></pre>
<p>If PowerShell blocks the script with an "execution policy" error, run this first and try again:</p>
<pre><code>Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned</code></pre>
<p>Close PowerShell and open a new (non-admin) window. Then run:</p>
<pre><code>claude</code></pre>
<p>Your browser opens to log in. Use the same email as your Claude account. When you see Claude Code's welcome screen, type <code>/exit</code> to quit for now.</p>

<h3>You're Done with Installs</h3>
<p>Move to the next lesson — <strong>Windows — Verify Everything Works</strong>.</p>`,
          },
          {
            title: "Windows — Verify Everything Works",
            slug: "windows-verify",
            order: 1,
            duration: 5,
            content: `<h2>Windows — Verify Everything Works</h2>
<p>Open a fresh PowerShell window (no need for admin). Run each command below. Versions might differ — what matters is no <strong>"is not recognized"</strong> errors.</p>

<h3>Run These One at a Time</h3>
<pre><code>winget --version</code></pre>
<p>Expected: <code>v1.x.x</code></p>

<pre><code>git --version</code></pre>
<p>Expected: <code>git version 2.x.x</code></p>

<pre><code>node --version</code></pre>
<p>Expected: <code>v22.x.x</code> or higher</p>

<pre><code>npm --version</code></pre>
<p>Expected: <code>10.x.x</code> or higher</p>

<pre><code>python --version</code></pre>
<p>Expected: <code>Python 3.12.x</code> or higher</p>

<pre><code>code --version</code></pre>
<p>Expected: a version number. If "not recognized", open VS Code, press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>, type <code>shell command</code>, pick <strong>Install 'code' command in PATH</strong>, then close and reopen PowerShell.</p>

<pre><code>claude --version</code></pre>
<p>Expected: a version number.</p>

<h3>If Something Failed</h3>
<ul>
<li><strong>"is not recognized as the name of a cmdlet"</strong> — close PowerShell completely and open a brand new window. Windows only sees newly-installed tools after a fresh shell.</li>
<li><strong>winget asks you to accept a license</strong> — type <code>Y</code> and press Enter.</li>
<li><strong>Claude Code script blocked</strong> — run the <code>Set-ExecutionPolicy</code> command from the install lesson, then retry.</li>
</ul>

<h3>All Green?</h3>
<p>You're ready for class. 🎉 You can skip Module 4 — that's for Linux only.</p>`,
          },
        ],
      },
      {
        title: "Linux Setup (Ubuntu / Debian)",
        order: 3,
        lessons: [
          {
            title: "Linux — Install Everything",
            slug: "linux-install-everything",
            order: 0,
            duration: 30,
            content: `<h2>Linux — Install Everything (Ubuntu / Debian)</h2>
<p>These instructions work for <strong>Ubuntu</strong>, <strong>Debian</strong>, and other Debian-based distributions (like Linux Mint, Pop!_OS, Elementary). If you're on Fedora, Arch, or another distro, the package names are similar but use your own package manager (<code>dnf</code>, <code>pacman</code>, etc.).</p>

<h3>Step 1 — Open a Terminal</h3>
<p>Press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd>. A window with a blinking cursor opens.</p>

<h3>Step 2 — Update the Package Index</h3>
<p>Always do this before installing anything new on Linux:</p>
<pre><code>sudo apt update &amp;&amp; sudo apt upgrade -y</code></pre>
<p>It will ask for your password. Type it (you won't see the letters — that's normal) and press Enter.</p>

<h3>Step 3 — Install Build Essentials</h3>
<p>This bundle gives you compilers and basic build tools that other installs may need:</p>
<pre><code>sudo apt install -y build-essential curl wget</code></pre>

<h3>Step 4 — Install Git</h3>
<pre><code>sudo apt install -y git</code></pre>
<p>Verify:</p>
<pre><code>git --version</code></pre>

<h3>Step 5 — Connect Git to Your Name and Email</h3>
<pre><code>git config --global user.name "Your Name"
git config --global user.email "you@example.com"</code></pre>

<h3>Step 6 — Install Node.js (v22)</h3>
<p>Ubuntu's default <code>nodejs</code> package is usually outdated. Use NodeSource for the current version:</p>
<pre><code>curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs</code></pre>
<p>Verify:</p>
<pre><code>node --version
npm --version</code></pre>

<h3>Step 7 — Install Python</h3>
<p>Most Linux systems already have Python 3 installed. Make sure <code>pip</code> and <code>venv</code> are too:</p>
<pre><code>sudo apt install -y python3 python3-pip python3-venv</code></pre>
<p>Verify:</p>
<pre><code>python3 --version
pip3 --version</code></pre>

<h3>Step 8 — Install VS Code</h3>
<p>Download the official Microsoft <code>.deb</code> package and install it:</p>
<pre><code>wget -O vscode.deb "https://code.visualstudio.com/sha/download?build=stable&amp;os=linux-deb-x64"
sudo apt install -y ./vscode.deb
rm vscode.deb</code></pre>
<p>Open VS Code from your applications menu once to confirm it works, then close it.</p>

<h3>Step 9 — Install Claude Code</h3>
<p>Anthropic's official installer:</p>
<pre><code>curl -fsSL https://claude.ai/install.sh | bash</code></pre>
<p>Close the Terminal and open a new one. Then run:</p>
<pre><code>claude</code></pre>
<p>Your browser opens to log in. Use the same email as your Claude account. When you see Claude Code's welcome screen, type <code>/exit</code> to quit for now.</p>

<h3>You're Done with Installs</h3>
<p>Move to the next lesson — <strong>Linux — Verify Everything Works</strong>.</p>`,
          },
          {
            title: "Linux — Verify Everything Works",
            slug: "linux-verify",
            order: 1,
            duration: 5,
            content: `<h2>Linux — Verify Everything Works</h2>
<p>Open a fresh Terminal window. Run each command below.</p>

<h3>Run These One at a Time</h3>
<pre><code>git --version</code></pre>
<p>Expected: <code>git version 2.x.x</code></p>

<pre><code>node --version</code></pre>
<p>Expected: <code>v22.x.x</code> or higher</p>

<pre><code>npm --version</code></pre>
<p>Expected: <code>10.x.x</code> or higher</p>

<pre><code>python3 --version</code></pre>
<p>Expected: <code>Python 3.10.x</code> or higher</p>

<pre><code>pip3 --version</code></pre>
<p>Expected: a version number.</p>

<pre><code>code --version</code></pre>
<p>Expected: a version number.</p>

<pre><code>claude --version</code></pre>
<p>Expected: a version number.</p>

<h3>If Something Failed</h3>
<ul>
<li><strong>"command not found"</strong> — close Terminal and open a new one. If still missing, the install didn't finish. Re-run that step.</li>
<li><strong>"permission denied"</strong> — you forgot <code>sudo</code> on a step that needed it. Re-read that step.</li>
<li><strong>NodeSource script failed</strong> — make sure <code>curl</code> is installed (<code>sudo apt install curl</code>) and try again.</li>
</ul>

<h3>All Green?</h3>
<p>You're ready for class. 🎉</p>`,
          },
        ],
      },
    ],
  },
  {
    title: "Command AI with Claude Code",
    slug: "command-ai-with-claude-code",
    description:
      "Master Anthropic's agentic coding CLI — the #1 most-loved AI coding tool. Build real projects from your terminal with voice mode, 1M token context, and the Agent SDK. No coding experience needed.",
    published: true,
    order: 10,
    modules: [
      {
        title: "Getting Started",
        order: 0,
        lessons: [
          {
            title: "What is Claude Code?",
            slug: "what-is-claude-code",
            order: 0,
            duration: 10,
            content: `<h2>Welcome to Claude Code Mastery</h2>
<p>Claude Code is Anthropic's agentic coding CLI — rated the <strong>#1 most-loved AI coding tool</strong> with a 46% developer approval rating. It lives in your terminal, understands entire codebases, and can read files, write code, run commands, and ship complete projects autonomously.</p>
<h3>What You'll Learn</h3>
<ul>
<li>How Claude Code works — agentic workflows, tools, and context</li>
<li>Voice mode — talk to Claude Code with push-to-talk (supports 20 languages)</li>
<li>The Agent SDK — build your own autonomous AI agents</li>
<li>1M token context — Claude Code can understand massive codebases at once</li>
<li>MCP integrations — connect Claude Code to Google Drive, Jira, Slack, and more</li>
</ul>
<h3>Why Claude Code?</h3>
<p>Unlike code completion tools (Copilot) or AI IDEs (Cursor), Claude Code is <strong>agentic</strong> — it doesn't just suggest code, it <em>takes action</em>. It reads your project, plans changes, edits multiple files, runs tests, and submits pull requests. You command, it builds.</p>
<h3>Free Learning Resources</h3>
<p>Anthropic Academy offers 13 free courses with certificates. We'll reference these throughout the course for deeper dives into specific topics.</p>`,
          },
          {
            title: "Installation and Setup",
            slug: "installation-and-setup",
            order: 1,
            duration: 15,
            content: `<h2>Installing Claude Code</h2>
<p>Getting Claude Code up and running takes just a few minutes.</p>
<h3>Prerequisites</h3>
<ul>
<li>macOS 10.15+, Ubuntu 20.04+, or Windows 10+ (Windows requires WSL)</li>
<li>A Claude Pro ($20/mo), Max ($100/mo), or API account</li>
</ul>
<h3>Installation (Native Installer — Recommended)</h3>
<p>Claude Code now has a native installer that requires no dependencies and auto-updates:</p>
<pre><code>curl -fsSL https://claude.ai/install.sh | sh</code></pre>
<h3>First Run</h3>
<p>Navigate to any project directory and run:</p>
<pre><code>claude</code></pre>
<p>Claude Code will prompt you to authenticate. Once connected, you're ready to start.</p>
<h3>Try Voice Mode</h3>
<p>Press <strong>spacebar</strong> to activate push-to-talk voice mode. Speak your instructions naturally — Claude Code supports 20 languages. This is the fastest way to command AI.</p>
<h3>Configuration</h3>
<p>Claude Code reads configuration from <code>.claude/</code> directories and <code>CLAUDE.md</code> files in your project. These are like instruction manuals that tell Claude Code about your project's standards and preferences.</p>`,
          },
          {
            title: "Your First Prompt",
            slug: "your-first-prompt",
            order: 2,
            duration: 15,
            content: `<h2>Writing Your First Prompt</h2>
<p>Let's start using Claude Code with a real task. The key to getting great results is writing clear, specific prompts.</p>
<h3>Example: Creating a Utility Function</h3>
<p>Try this prompt in your project:</p>
<pre><code>Create a utility function that validates email addresses using a regex pattern. Put it in src/utils/validation.ts</code></pre>
<h3>What Happens Next</h3>
<p>Claude Code will:</p>
<ol>
<li>Check if the directory exists (creating it if needed)</li>
<li>Write the function with proper TypeScript types</li>
<li>Include common edge cases in the validation</li>
<li>Show you the changes for approval</li>
</ol>
<h3>Tips for Good Prompts</h3>
<ul>
<li><strong>Be specific</strong> about what you want and where</li>
<li><strong>Mention the file path</strong> when you know it</li>
<li><strong>Describe the behavior</strong> you expect</li>
<li><strong>Include constraints</strong> like "don't use external dependencies"</li>
</ul>`,
          },
          {
            title: "Understanding the CLI Interface",
            slug: "understanding-cli-interface",
            order: 3,
            duration: 12,
            content: `<h2>Navigating the Claude Code Interface</h2>
<p>Claude Code's terminal interface is packed with features. Here are the essentials.</p>
<h3>Slash Commands</h3>
<ul>
<li><code>/help</code> — Get help and see available commands</li>
<li><code>/clear</code> — Clear conversation history</li>
<li><code>/compact</code> — Summarize conversation to save context</li>
<li><code>/cost</code> — See token usage and costs</li>
<li><code>/loop 5m /command</code> — Run a command on a recurring interval</li>
</ul>
<h3>Voice Mode</h3>
<p>Press <strong>spacebar</strong> for push-to-talk. Speak naturally in any of 20 supported languages. Claude Code transcribes and executes your instructions. This is a game-changer for speed.</p>
<h3>Permission System</h3>
<p>Claude Code asks for permission before making changes. You can configure this with different permission modes to balance safety and speed. In "accept all" mode, Claude Code works fully autonomously.</p>
<h3>Context Window</h3>
<p>Claude Code uses a <strong>1M token context window</strong> on Max plans — it can hold your entire codebase in memory at once. When context fills up, it automatically compacts (summarizes) the conversation to keep working.</p>
<h3>Keyboard Shortcuts</h3>
<ul>
<li><code>Spacebar</code> — Push-to-talk voice mode</li>
<li><code>Ctrl+C</code> — Cancel current operation</li>
<li><code>Escape</code> — Go back / cancel</li>
<li><code>Tab</code> — Accept suggestion</li>
</ul>`,
          },
        ],
      },
      {
        title: "Your First AI Build",
        order: 1,
        lessons: [
          {
            title: "File Reading and Navigation",
            slug: "file-reading-navigation",
            order: 0,
            duration: 15,
            content: `<h2>Working with Files</h2>
<p>One of Claude Code's strongest capabilities is reading and understanding your codebase. Let's explore how to leverage this effectively.</p>
<h3>Reading Files</h3>
<p>Claude Code can read any file in your project. Simply reference it:</p>
<pre><code>Read src/components/Header.tsx and explain what it does</code></pre>
<h3>Searching the Codebase</h3>
<p>Ask Claude Code to find things across your project:</p>
<pre><code>Find all files that import the useAuth hook</code></pre>
<h3>Understanding Architecture</h3>
<p>Claude Code can reason about your entire project structure:</p>
<pre><code>Explain the data flow from the login form to the API</code></pre>`,
          },
          {
            title: "Code Generation Patterns",
            slug: "code-generation-patterns",
            order: 1,
            duration: 20,
            content: `<h2>Generating Code Effectively</h2>
<p>Claude Code excels at generating code that fits your existing patterns. Here's how to get the best results.</p>
<h3>Pattern Matching</h3>
<p>Reference existing code to maintain consistency:</p>
<pre><code>Create a new API route for /api/users following the same pattern as /api/posts</code></pre>
<h3>Component Generation</h3>
<p>Generate complete components with proper structure:</p>
<pre><code>Create a UserCard component that displays avatar, name, and role. Follow the same patterns as the existing CourseCard component.</code></pre>
<h3>Test Generation</h3>
<p>Claude Code can generate comprehensive tests:</p>
<pre><code>Write tests for the validateEmail function covering edge cases like empty strings, missing @ symbol, and valid addresses</code></pre>`,
          },
          {
            title: "Editing Existing Code",
            slug: "editing-existing-code",
            order: 2,
            duration: 15,
            content: `<h2>Modifying Existing Code</h2>
<p>Most real development work involves changing existing code, not writing from scratch. Claude Code handles this elegantly.</p>
<h3>Targeted Edits</h3>
<p>Be specific about what to change:</p>
<pre><code>In the UserProfile component, add a loading skeleton that shows while data is being fetched</code></pre>
<h3>Refactoring</h3>
<p>Claude Code can refactor with understanding of the broader context:</p>
<pre><code>Refactor the handleSubmit function in LoginForm to use async/await instead of .then() chains</code></pre>
<h3>Bug Fixes</h3>
<p>Describe the problem and let Claude Code find and fix it:</p>
<pre><code>The user list page shows duplicate entries when you navigate back from a profile. Fix this issue.</code></pre>`,
          },
          {
            title: "Multi-file Operations",
            slug: "multi-file-operations",
            order: 3,
            duration: 18,
            content: `<h2>Working Across Multiple Files</h2>
<p>Claude Code truly shines when tasks span multiple files — something traditional code completion tools struggle with.</p>
<h3>Feature Implementation</h3>
<p>Describe a feature and let Claude Code handle all the files:</p>
<pre><code>Add a dark mode toggle to the app. This should include:
- A toggle button in the navbar
- A ThemeProvider context
- CSS variable updates
- Persisting the preference in localStorage</code></pre>
<h3>Rename Across Codebase</h3>
<pre><code>Rename the UserService class to AuthService across the entire codebase, updating all imports and references</code></pre>`,
          },
        ],
      },
      {
        title: "Advanced Commands",
        order: 2,
        lessons: [
          {
            title: "Custom System Prompts with CLAUDE.md",
            slug: "custom-system-prompts",
            order: 0,
            duration: 15,
            content: `<h2>Customizing Claude Code with CLAUDE.md</h2>
<p>CLAUDE.md files let you give Claude Code persistent instructions about your project, coding standards, and preferences.</p>
<h3>What Goes in CLAUDE.md</h3>
<ul>
<li>Build and test commands</li>
<li>Code style preferences</li>
<li>Architecture patterns to follow</li>
<li>Common pitfalls to avoid</li>
<li>Project-specific context</li>
</ul>
<h3>File Locations</h3>
<ul>
<li><code>CLAUDE.md</code> in project root — applies to all conversations</li>
<li><code>.claude/CLAUDE.md</code> — git-ignored personal preferences</li>
<li><code>src/CLAUDE.md</code> — directory-specific instructions</li>
</ul>`,
          },
          {
            title: "Tool Use and MCP Servers",
            slug: "tool-use-mcp-servers",
            order: 1,
            duration: 20,
            content: `<h2>Extending Claude Code with MCP</h2>
<p>Model Context Protocol (MCP) servers let Claude Code connect to external tools and data sources.</p>
<h3>What is MCP?</h3>
<p>MCP is a protocol that allows AI models to use tools. Claude Code supports MCP servers that provide additional capabilities like database access, API integrations, and custom tooling.</p>
<h3>Built-in Tools</h3>
<p>Claude Code comes with powerful built-in tools:</p>
<ul>
<li><strong>Read</strong> — Read files from the filesystem</li>
<li><strong>Write</strong> — Create or overwrite files</li>
<li><strong>Edit</strong> — Make targeted edits to existing files</li>
<li><strong>Bash</strong> — Run terminal commands</li>
<li><strong>Glob</strong> — Find files by pattern</li>
<li><strong>Grep</strong> — Search file contents</li>
</ul>`,
          },
          {
            title: "Context Management",
            slug: "context-management",
            order: 2,
            duration: 15,
            content: `<h2>Managing Context Effectively</h2>
<p>Claude Code has a large context window, but managing it well leads to better results and lower costs.</p>
<h3>The /compact Command</h3>
<p>Use <code>/compact</code> to summarize your conversation when it gets long. This preserves the key information while freeing up context space.</p>
<h3>Conversation Structure</h3>
<ul>
<li>Start with high-level goals</li>
<li>Break complex tasks into smaller conversations</li>
<li>Use CLAUDE.md for persistent context</li>
<li>Reference specific files rather than pasting code</li>
</ul>`,
          },
          {
            title: "Working with Large Codebases",
            slug: "large-codebases",
            order: 3,
            duration: 20,
            content: `<h2>Scaling to Large Projects</h2>
<p>Claude Code can work effectively with codebases of any size. Here are strategies for large projects.</p>
<h3>Exploration Strategies</h3>
<p>Start broad, then narrow:</p>
<pre><code>Give me an overview of the project architecture, focusing on the main entry points and data flow</code></pre>
<h3>Targeted Work</h3>
<p>For large codebases, be specific about scope:</p>
<pre><code>Looking only at the authentication module in src/auth/, fix the token refresh logic</code></pre>
<h3>Using Subagents</h3>
<p>Claude Code can delegate research to subagents, keeping your main conversation focused on the task at hand.</p>`,
          },
        ],
      },
      {
        title: "Shipping Real Projects",
        order: 3,
        lessons: [
          {
            title: "Building a REST API",
            slug: "building-rest-api",
            order: 0,
            duration: 30,
            content: `<h2>Project: Build a REST API with Claude Code</h2>
<p>In this hands-on lesson, we'll build a complete REST API for a task management application using Claude Code as our pair programmer.</p>
<h3>What We'll Build</h3>
<ul>
<li>Express.js API with TypeScript</li>
<li>CRUD endpoints for tasks</li>
<li>Input validation with Zod</li>
<li>Error handling middleware</li>
<li>Basic authentication</li>
</ul>
<h3>Exercise</h3>
<p>Open Claude Code in a new project directory and follow along with the prompts in this lesson to build the complete API.</p>`,
          },
          {
            title: "Frontend Component Development",
            slug: "frontend-component-dev",
            order: 1,
            duration: 25,
            content: `<h2>Project: Building React Components</h2>
<p>Learn how to use Claude Code to rapidly build high-quality React components with proper TypeScript types, tests, and accessibility.</p>
<h3>What We'll Build</h3>
<ul>
<li>A reusable data table component</li>
<li>Sorting, filtering, and pagination</li>
<li>Responsive design</li>
<li>Keyboard navigation</li>
<li>Unit tests with Testing Library</li>
</ul>`,
          },
          {
            title: "Database Integration",
            slug: "database-integration",
            order: 2,
            duration: 25,
            content: `<h2>Project: Database Integration</h2>
<p>Use Claude Code to set up and work with databases effectively, from schema design to complex queries.</p>
<h3>What We'll Cover</h3>
<ul>
<li>Setting up Prisma with PostgreSQL</li>
<li>Schema design best practices</li>
<li>Writing migrations</li>
<li>Seed scripts for development</li>
<li>Complex queries and relations</li>
</ul>`,
          },
          {
            title: "Full-Stack App from Scratch",
            slug: "fullstack-app-scratch",
            order: 3,
            duration: 45,
            content: `<h2>Capstone Project: Full-Stack App</h2>
<p>Put everything together by building a complete full-stack application with Claude Code guiding every step.</p>
<h3>The Project</h3>
<p>We'll build a bookmark manager with:</p>
<ul>
<li>Next.js frontend with authentication</li>
<li>PostgreSQL database with Prisma</li>
<li>Tag-based organization</li>
<li>Full-text search</li>
<li>Import/export functionality</li>
</ul>
<p>This capstone project ties together everything you've learned in the course.</p>`,
          },
        ],
      },
      {
        title: "Pro Tips & Best Practices",
        order: 4,
        lessons: [
          {
            title: "Prompt Engineering for Code",
            slug: "prompt-engineering-code",
            order: 0,
            duration: 20,
            content: `<h2>Writing Better Prompts for Code</h2>
<p>The quality of your prompts directly impacts the quality of Claude Code's output. Let's master the art of prompt engineering for coding tasks.</p>
<h3>The SPECIFY Framework</h3>
<ul>
<li><strong>S</strong>cope — Define what files/modules are involved</li>
<li><strong>P</strong>attern — Reference existing patterns to follow</li>
<li><strong>E</strong>xpected behavior — Describe what the code should do</li>
<li><strong>C</strong>onstraints — List any limitations or requirements</li>
<li><strong>I</strong>nput/Output — Provide example inputs and expected outputs</li>
<li><strong>F</strong>ile locations — Be explicit about where code goes</li>
<li><strong>Y</strong>ield — Describe what "done" looks like</li>
</ul>`,
          },
          {
            title: "Debugging with Claude Code",
            slug: "debugging-claude-code",
            order: 1,
            duration: 15,
            content: `<h2>Debugging Like a Pro</h2>
<p>Claude Code is an excellent debugging partner. Learn how to leverage it for efficient bug hunting.</p>
<h3>Describing Bugs</h3>
<p>Give Claude Code the full picture:</p>
<pre><code>When I click "Save" on the edit profile form, the page refreshes but the changes aren't persisted. The network tab shows a 200 response. Check the API route and the form submission logic.</code></pre>
<h3>Reading Error Messages</h3>
<p>Paste error messages directly:</p>
<pre><code>I'm getting this error: TypeError: Cannot read properties of undefined (reading 'map'). It happens in the CourseList component when the page first loads.</code></pre>`,
          },
          {
            title: "Code Review Workflows",
            slug: "code-review-workflows",
            order: 2,
            duration: 15,
            content: `<h2>Using Claude Code for Code Review</h2>
<p>Claude Code can help you review code changes and catch issues before they reach production.</p>
<h3>Reviewing Your Own Changes</h3>
<pre><code>Review my recent changes (git diff) and flag any potential issues, security concerns, or improvements</code></pre>
<h3>PR Reviews</h3>
<pre><code>Review PR #42 and provide feedback on code quality, potential bugs, and adherence to our coding standards</code></pre>`,
          },
          {
            title: "Team Collaboration Patterns",
            slug: "team-collaboration",
            order: 3,
            duration: 15,
            content: `<h2>Claude Code in Team Settings</h2>
<p>Learn how to use Claude Code effectively when working with a team.</p>
<h3>Shared CLAUDE.md</h3>
<p>Commit a CLAUDE.md to your repo so everyone benefits from the same context and conventions.</p>
<h3>Consistent Code Generation</h3>
<p>Define patterns in CLAUDE.md that ensure Claude Code generates consistent code regardless of who's prompting.</p>
<h3>Onboarding</h3>
<p>New team members can use Claude Code to quickly understand the codebase:</p>
<pre><code>I'm new to this project. Give me a high-level overview of the architecture, key technologies, and where to find the main features.</code></pre>`,
          },
        ],
      },
      {
        title: "The Agent SDK",
        order: 5,
        lessons: [
          {
            title: "What is the Agent SDK?",
            slug: "what-is-agent-sdk",
            order: 0,
            duration: 15,
            content: `<h2>Building Your Own AI Agents</h2>
<p>The Claude Agent SDK lets you build autonomous AI agents programmatically in Python or TypeScript. While Claude Code is the agent <em>you</em> use, the Agent SDK lets you build agents for <em>others</em> to use.</p>
<h3>What You Can Build</h3>
<ul>
<li><strong>Custom coding assistants</strong> — Agents tailored to your specific workflow</li>
<li><strong>Automated pipelines</strong> — Agents that process data, review code, or handle deployments</li>
<li><strong>Multi-agent systems</strong> — Teams of agents that collaborate on complex tasks</li>
<li><strong>Product features</strong> — Embed AI agents into your own applications</li>
</ul>
<h3>Agent SDK vs Claude Code</h3>
<table>
<tr><th>Claude Code</th><th>Agent SDK</th></tr>
<tr><td>You use it directly in the terminal</td><td>You write code that creates agents</td></tr>
<tr><td>Interactive conversation</td><td>Programmatic control</td></tr>
<tr><td>General-purpose coding assistant</td><td>Custom agents for specific tasks</td></tr>
<tr><td>Built by Anthropic</td><td>Built by you, powered by Claude</td></tr>
</table>`,
          },
          {
            title: "Your First Agent",
            slug: "first-agent-sdk-project",
            order: 1,
            duration: 25,
            content: `<h2>Hands-On: Build a Code Review Agent</h2>
<p>Let's build a simple agent that automatically reviews code changes and provides feedback.</p>
<h3>Setup</h3>
<pre><code>npm install @anthropic-ai/claude-code</code></pre>
<h3>The Agent Pattern</h3>
<p>Every agent follows the same core pattern:</p>
<ol>
<li><strong>Define the task</strong> — What should the agent do?</li>
<li><strong>Give it tools</strong> — What can the agent access? (files, APIs, databases)</li>
<li><strong>Set constraints</strong> — What are the limits? (cost caps, time limits, permissions)</li>
<li><strong>Run and observe</strong> — Let the agent work and monitor its output</li>
</ol>
<h3>Cost Control</h3>
<p>The Agent SDK has built-in cost limits. Set a maximum spend per run so your agent never burns through your API credits unexpectedly.</p>`,
          },
          {
            title: "MCP Integrations",
            slug: "mcp-integrations",
            order: 2,
            duration: 20,
            content: `<h2>Model Context Protocol (MCP)</h2>
<p>MCP is a standard for connecting AI models to external tools and data sources. Claude Code uses MCP to integrate with Google Drive, Jira, Slack, GitHub, and custom tooling.</p>
<h3>Built-in MCP Servers</h3>
<ul>
<li><strong>File system</strong> — Read, write, and search files</li>
<li><strong>Git</strong> — Full git operations (status, diff, commit, PR)</li>
<li><strong>Web search</strong> — Search the internet from your terminal</li>
<li><strong>Browser</strong> — Navigate and interact with web pages</li>
</ul>
<h3>Custom MCP Servers</h3>
<p>You can build your own MCP server to connect Claude Code to any tool or data source. This is how you make Claude Code work with your company's internal tools.</p>
<h3>Why MCP Matters</h3>
<p>MCP turns Claude Code from a coding assistant into a <strong>universal agent</strong> that can interact with any system. This is the foundation of agentic AI — the model doesn't just think, it <em>acts</em>.</p>`,
          },
        ],
      },
    ],
  },
  {
    title: "The History of AI",
    slug: "history-of-ai",
    description:
      "A one-week deep dive into how artificial intelligence became what it is today. Five two-hour classes tracing the ideas, people, breakthroughs, and setbacks from Turing to today's frontier models. No math background required — this is the story, not the equations.",
    published: true,
    order: 0,
    modules: [
      {
        title: "Week 1: How We Got Here",
        order: 0,
        lessons: [
          {
            title: "Day 1 — The Dream of Thinking Machines (Pre-1950)",
            slug: "dream-of-thinking-machines",
            order: 0,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Day 1</h3>
<p><strong>Goal:</strong> Understand that AI did not start with ChatGPT. Its ideas were already being worked out decades before computers could run them.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Pick <strong>one</strong> of these figures: Alan Turing, Ada Lovelace, Norbert Wiener, Claude Shannon, John von Neumann, Warren McCulloch, or Walter Pitts.</li>
<li>Write a <strong>500-word brief</strong> answering: What is one concrete idea this person contributed that AI still uses today? Where did their idea fall short of what modern AI does?</li>
<li>End with <strong>one question</strong> about this person's work that is still debated (e.g., "Would Turing consider modern chatbots 'thinking'?").</li>
</ol>
<p><strong>What to submit:</strong> Paste your 500-word brief into the text box. Optional: upload a PDF if you'd prefer a formatted version. No GitHub repo needed.</p>
<p><strong>Why this matters:</strong> These people asked the right questions before anyone had the hardware to answer them. Knowing the questions helps you see what today's models are actually doing — and not doing.</p>`,
            content: `<h2>The Dream Before the Machine</h2>
<p>Artificial intelligence didn't begin in 2022 with ChatGPT, or in 2012 with AlexNet, or even in 1956 at the Dartmouth Conference. It began as a question — <em>can thought be mechanized?</em> — that thinkers have circled for centuries.</p>

<h3>Ada Lovelace and the Analytical Engine (1843)</h3>
<p>Ada Lovelace wrote the first published algorithm intended for a machine — Charles Babbage's never-completed Analytical Engine. She also wrote something more prescient: a note arguing that a machine can only do what we know how to tell it to do. That debate is still alive every time someone argues about whether LLMs are "really" reasoning.</p>

<h3>Alan Turing (1936–1950)</h3>
<p>Turing's 1936 paper introduced the <strong>Turing machine</strong> — a formal model of computation that underpins every computer ever built. In 1950, in <em>Computing Machinery and Intelligence</em>, he proposed what we now call the Turing Test: if a machine can hold a conversation indistinguishable from a human, calling it "not intelligent" is hard to defend. He also predicted machines would reach that bar "around the year 2000" — he was a bit optimistic, but not by much.</p>

<h3>McCulloch and Pitts (1943): The First Artificial Neuron</h3>
<p>A neurophysiologist and a logician wrote down a mathematical model of a brain cell as a thresholded on/off switch. They showed that networks of these simple units could, in principle, compute anything computable. That paper is the direct ancestor of every neural network — from the 1958 perceptron to GPT-5 and Claude Opus 4.7.</p>

<h3>Cybernetics (1948)</h3>
<p>Norbert Wiener's book <em>Cybernetics</em> pulled together control theory, information theory, and biology into a single framework: systems that sense, act, and adjust based on feedback. This is literally the loop modern agents run in — perceive, decide, act, observe, repeat.</p>

<h3>Claude Shannon (1948)</h3>
<p>Shannon's <em>Mathematical Theory of Communication</em> gave us the bit, entropy, and channel capacity. Modern language models are, at their core, very sophisticated statistical models of communication channels — which Shannon would have recognized instantly.</p>

<h3>The Takeaway</h3>
<p>By 1950, four ideas were already in place: computation is formal and universal (Turing), intelligence might be a computation (Turing), brains are networks of thresholded units (McCulloch-Pitts), and intelligent systems can be described as feedback loops that process information (Wiener + Shannon). The hardware to run any of it wouldn't exist for another decade — but the blueprint was done.</p>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>The philosophical roots: Descartes, Leibniz, and the dream of a "calculus of thought"</li>
<li>Turing's machine and the Turing test — how one man laid two foundations at once</li>
<li>McCulloch-Pitts neurons and why a 1943 paper still matters in 2026</li>
<li>Shannon's information theory and why tokens are just bits in disguise</li>
<li>Cybernetics as the first theory of agents</li>
<li>Group discussion: which of these ideas got it most right? Most wrong?</li>
</ul>`,
          },
          {
            title: "Day 2 — The Birth of AI and the First Winter (1950s–1970s)",
            slug: "birth-of-ai-first-winter",
            order: 1,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Day 2</h3>
<p><strong>Goal:</strong> See how a field goes from hype to collapse and what gets blamed when it does.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Build a <strong>timeline of 10 events</strong> between 1950 and 1980 that shaped AI. Mix successes (Dartmouth 1956, Perceptron 1957, SHRDLU 1972) with failures (Minsky/Papert 1969, Lighthill Report 1973, funding cuts).</li>
<li>For each event, write <strong>2 sentences</strong>: what happened, and why it mattered.</li>
<li>At the end, answer in 100 words: <em>"What assumption did early AI researchers make that turned out to be wrong?"</em></li>
</ol>
<p><strong>What to submit:</strong> Your timeline as text (bullet list is fine), or upload it as a PDF / image if you want to design it visually. Optional: link to any source you found particularly useful.</p>
<p><strong>Why this matters:</strong> The first AI winter killed careers and funding for a decade. The reasons — overpromising, ignoring scaling limits, hiding failure cases — are the exact risks every AI startup faces today. History is a pattern-matching tool.</p>`,
            content: `<h2>The First Boom and the First Bust</h2>
<p>In the summer of 1956, a two-month workshop at Dartmouth College brought together John McCarthy, Marvin Minsky, Claude Shannon, and a handful of others. McCarthy coined the term "artificial intelligence" for the proposal. The optimism in that room was enormous: they genuinely believed they could solve general intelligence in a few years.</p>

<h3>The Perceptron (1957)</h3>
<p>Frank Rosenblatt built the Perceptron — a hardware implementation of a single-layer neural network that could learn to classify images. The <em>New York Times</em> reported in 1958 that the Navy expected to have machines that could "walk, talk, see, write, reproduce itself, and be conscious of its existence." That quote did not age well.</p>

<h3>Symbolic AI Takes Over</h3>
<p>Through the 1960s, symbolic AI dominated. The premise: intelligence is symbol manipulation, so build programs that reason with explicit rules.</p>
<ul>
<li><strong>General Problem Solver (1959)</strong> — Newell and Simon tried to build a universal reasoner. It worked on toy problems.</li>
<li><strong>ELIZA (1966)</strong> — Joseph Weizenbaum's pattern-matching "therapist" chatbot. Weizenbaum was horrified when people treated it as real.</li>
<li><strong>SHRDLU (1972)</strong> — Terry Winograd's program that manipulated blocks in a virtual world and could answer questions about them. Brilliant, but did not generalize.</li>
<li><strong>MYCIN (early 1970s)</strong> — Expert system for diagnosing blood infections. Beat junior doctors. Never deployed (liability).</li>
</ul>

<h3>Minsky and Papert Kill Neural Nets (1969)</h3>
<p>Marvin Minsky and Seymour Papert published <em>Perceptrons</em>, a rigorous mathematical analysis showing that single-layer perceptrons could not learn basic functions like XOR. The book was correct but widely misread as showing neural networks in general were doomed. Funding for connectionist research collapsed for nearly two decades.</p>

<h3>The Lighthill Report (1973)</h3>
<p>The British government commissioned Sir James Lighthill to evaluate AI research. His report found that AI had massively underdelivered on its promises. The UK killed most of its AI funding. The US followed soon after. The <strong>first AI winter</strong> had begun.</p>

<h3>Why It Failed</h3>
<ul>
<li><strong>Combinatorial explosion</strong> — search-based approaches grew exponentially. Toy problems didn't scale.</li>
<li><strong>The knowledge bottleneck</strong> — encoding expert knowledge by hand is enormously expensive and brittle.</li>
<li><strong>No data, no compute</strong> — learning approaches existed but had no fuel.</li>
<li><strong>Hype</strong> — researchers told funders what they wanted to hear. The bill came due.</li>
</ul>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>The Dartmouth Conference — the founding myth and what actually happened</li>
<li>The Perceptron demo and the NYT article that helped kill the field</li>
<li>Symbolic AI's greatest hits: ELIZA, SHRDLU, MYCIN</li>
<li>Minsky vs Rosenblatt — a rivalry that cost us 20 years</li>
<li>The Lighthill Report and the mechanics of how a field collapses</li>
<li>Group discussion: where do you see the same patterns in 2026?</li>
</ul>`,
          },
          {
            title: "Day 3 — Expert Systems, the Second Winter, and ML Rising (1980s–2000s)",
            slug: "expert-systems-second-winter",
            order: 2,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Day 3</h3>
<p><strong>Goal:</strong> Understand that modern "AI" is actually the <em>third</em> major approach to the problem, and the previous two are still quietly running in production somewhere.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Find a <strong>real software product</strong> (enterprise, medical, tax, legal, insurance, industrial) that runs on a rule-based / expert-system approach. Examples: tax software like TurboTax's rule engine, insurance claim systems, compliance checkers, old-school medical decision tools. (Hint: search terms like "rule engine", "decision tables", "business rules management system".)</li>
<li>Write <strong>300 words</strong> explaining: what does it do, why rule-based is the right choice there, and what would break if you replaced it with an LLM?</li>
<li>Optional: include a link to the product's site or a case study.</li>
</ol>
<p><strong>What to submit:</strong> Your 300-word write-up as text + at least one link. Files optional.</p>
<p><strong>Why this matters:</strong> "AI" is not one thing. Most of the best-deployed AI in the world is not an LLM — it's expert systems, rules engines, SVMs, gradient boosting. Knowing when NOT to use an LLM is a competitive edge.</p>`,
            content: `<h2>The Comeback and the Second Collapse</h2>
<p>The 1980s brought AI back from the dead — in a suit, not a lab coat. Industry had discovered <strong>expert systems</strong>, and the money followed.</p>

<h3>The Expert Systems Boom</h3>
<p>An expert system is a program that encodes the knowledge of a human domain expert as a set of IF-THEN rules, then lets a non-expert query it.</p>
<ul>
<li><strong>XCON (1980)</strong> — Digital Equipment Corporation's system for configuring VAX computers. Saved DEC $40 million per year. Became the poster child for commercial AI.</li>
<li><strong>Lisp machines</strong> — specialized workstations built to run AI code. Symbolics and LMI became hot stocks.</li>
<li><strong>Japan's Fifth Generation Project (1982)</strong> — a national bet on massively parallel logic-programming computers. Terrified the US into responding.</li>
</ul>

<h3>The Second Winter (late 1980s)</h3>
<p>By 1987 the bubble popped. Lisp machines couldn't compete with cheap Sun workstations. Expert systems hit a wall: they were brittle, couldn't handle anything outside their narrow domain, and cost a fortune to maintain as the knowledge changed. The Fifth Generation Project quietly failed. AI funding dried up again.</p>

<h3>Meanwhile, in the Quiet Corners</h3>
<p>During the winter, the actual research kept going — it just stopped calling itself AI.</p>
<ul>
<li><strong>Backpropagation (1986)</strong> — Rumelhart, Hinton, and Williams popularized the algorithm for training multi-layer neural networks. Minsky and Papert's 1969 critique was now obsolete, though it took the field years to notice.</li>
<li><strong>Machine learning emerges</strong> — the focus shifted from "how do we encode knowledge?" to "how do we learn from data?" Probabilistic methods (Bayesian networks, HMMs), support vector machines (1995), random forests, and kernel methods took over.</li>
<li><strong>Statistical NLP</strong> — IBM's Candide project showed that statistical translation beat rule-based translation. The phrase <em>"every time I fire a linguist, my system's performance goes up"</em> (attributed to IBM's Frederick Jelinek) captured the mood.</li>
</ul>

<h3>Deep Blue Beats Kasparov (1997)</h3>
<p>IBM's Deep Blue defeated world chess champion Garry Kasparov 3.5–2.5. Critically, Deep Blue was <em>not</em> primarily AI in the modern sense — it was brute-force search on custom hardware. But the cultural shift was huge: a machine beat the best human alive at something "only humans could do."</p>

<h3>The Netflix Prize (2006–2009)</h3>
<p>Netflix offered $1M for a 10% improvement on its recommendation algorithm. The winning team used an ensemble of matrix factorization and gradient boosting. The competition proved that <strong>data plus ML beats hand-crafted expertise</strong>, publicly, in a commercial setting.</p>

<h3>The Quiet Stack That Still Runs the World</h3>
<p>Most "AI" deployed in enterprise in 2026 is still from this era: gradient boosting (XGBoost), SVMs, logistic regression, rules engines. Fraud detection, credit scoring, ad ranking, supply chain — all running on ideas from this period.</p>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>Expert systems as the first commercial AI — what worked, what didn't</li>
<li>The Fifth Generation Project and the Cold War of compute</li>
<li>The rediscovery of neural networks — backprop, Hinton, the connectionist return</li>
<li>Statistical ML's takeover: SVMs, random forests, gradient boosting</li>
<li>Deep Blue and the cultural impact of chess</li>
<li>The Netflix Prize and the rise of "data beats model"</li>
<li>Group discussion: if rules-based AI still works, why do we never talk about it?</li>
</ul>`,
          },
          {
            title: "Day 4 — The Deep Learning Revolution (2010s)",
            slug: "deep-learning-revolution",
            order: 3,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Day 4</h3>
<p><strong>Goal:</strong> Read one real research paper from the decade that changed everything.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Pick <strong>one</strong> landmark paper from 2012–2019. Suggestions: AlexNet (2012), "Generative Adversarial Nets" (2014), "Attention Is All You Need" (2017), "BERT" (2018), "GPT-2" (2019), "ResNet" (2015), "Word2Vec" (2013).</li>
<li>Write a <strong>one-page summary</strong> with four sections: (a) the problem the authors were trying to solve, (b) the key idea that was new, (c) the result that made it famous, (d) what would be different today without it.</li>
<li>Upload either the PDF of the paper itself <strong>or</strong> a link to it on arXiv, plus your summary.</li>
</ol>
<p><strong>What to submit:</strong> Your summary (text or PDF) + a link to the paper. Don't submit the paper text itself — just your summary of it.</p>
<p><strong>Why this matters:</strong> These are the papers the entire LLM era is built on. You can use Claude without reading them — but if you want to reason about what it can and can't do, you need to have seen the primary sources.</p>`,
            content: `<h2>The Decade Everything Changed</h2>
<p>In 2012, AI was still a niche academic field. By 2019, it was eating software. The reasons were boring, in the sense that they were the same reasons from the 1950s — more compute, more data, and one very specific trick.</p>

<h3>AlexNet and the 2012 ImageNet Moment</h3>
<p>The ImageNet challenge pitted image classifiers against a million-image dataset. In 2011, the winning error rate was ~26%. In 2012, Geoff Hinton's team entered <strong>AlexNet</strong> — a deep convolutional neural network trained on two GPUs — and hit 15%. The closest non-deep-learning entry was ~26%. It wasn't a small improvement. It was a different species.</p>
<p>Within two years every top ImageNet entry was a deep convolutional network. Within four years, so was every serious computer vision system in the world.</p>

<h3>The GPU Changes Everything</h3>
<p>None of this was new math. The key was that GPUs — built for gamers — turned out to be near-optimal for training neural networks. NVIDIA's CUDA platform made this accessible. Compute became exponentially cheaper, and neural nets finally had fuel.</p>

<h3>Word Embeddings and the Language Revolution</h3>
<p><strong>Word2Vec (2013)</strong> showed that you could represent words as vectors, and that simple arithmetic on those vectors captured meaning: <em>king − man + woman ≈ queen</em>. This was the moment NLP stopped being about grammar rules and started being about geometry.</p>

<h3>GANs, RNNs, LSTMs</h3>
<ul>
<li><strong>GANs (2014)</strong> — Ian Goodfellow's Generative Adversarial Networks. Two networks competing to produce and detect fakes. Gave us the first wave of AI-generated images.</li>
<li><strong>RNNs and LSTMs</strong> — neural networks with memory. Ran most of Google Translate until 2017. Slow, hard to parallelize, limited in context length.</li>
</ul>

<h3>Transformers (2017): "Attention Is All You Need"</h3>
<p>Vaswani et al. at Google published the <strong>Transformer architecture</strong> in 2017. The paper's insight: you don't need recurrence — self-attention alone can model sequences, and it parallelizes on GPUs beautifully.</p>
<p>This is the single most important architectural idea of the last decade. Every large language model you've heard of — GPT, Claude, Gemini, Llama — is a Transformer. Everything else, at this point, is details.</p>

<h3>BERT, GPT, and the Scaling Hypothesis</h3>
<ul>
<li><strong>BERT (2018)</strong> — Google's bidirectional Transformer dominated NLP benchmarks overnight.</li>
<li><strong>GPT-1 (2018), GPT-2 (2019)</strong> — OpenAI's autoregressive Transformer. GPT-2 was so convincing at generating text that OpenAI initially refused to release the full model, citing misuse concerns. The internet laughed. A year later they released it and people noticed.</li>
<li><strong>The scaling hypothesis</strong> — quietly forming through these years: just make the model bigger, train on more data, and the results keep improving. No plateau in sight. Most researchers didn't believe it. They were wrong.</li>
</ul>

<h3>AlphaGo (2016)</h3>
<p>DeepMind's AlphaGo beat Lee Sedol 4-1. Go had been considered the unreachable benchmark — too many positions, too intuitive. AlphaGo combined deep learning with Monte Carlo tree search. A year later, AlphaGo Zero learned Go from scratch by self-play and crushed every previous version.</p>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>ImageNet 2012 — the moment deep learning became inescapable</li>
<li>GPUs and the accidental infrastructure that enabled everything</li>
<li>Word embeddings: when meaning became geometry</li>
<li>GANs, RNNs, LSTMs — the immediate pre-Transformer era</li>
<li>"Attention Is All You Need" — the paper you should actually read</li>
<li>BERT, GPT-1, GPT-2, and the quiet birth of the scaling hypothesis</li>
<li>AlphaGo — what self-play tells us about RLHF and reasoning models</li>
<li>Discussion: why did this take until 2012 if most of the ideas existed in the 80s?</li>
</ul>`,
          },
          {
            title: "Day 5 — The Age of Foundation Models (2020s)",
            slug: "age-of-foundation-models",
            order: 4,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Day 5</h3>
<p><strong>Goal:</strong> Develop a working intuition for how today's frontier models differ from each other.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Pick <strong>two</strong> current frontier models (e.g., Claude Opus 4.7, GPT-5, Gemini 2.5 Pro, Llama 4 405B). Must be two different providers.</li>
<li>Write <strong>one non-trivial prompt</strong> — something that forces reasoning, not just retrieval. Examples: "Debug this piece of code that has a subtle logic bug" (paste code), "Given these constraints, design an API schema for X", "Summarize this 20-page PDF and find three contradictions".</li>
<li>Run the same prompt against both models. Copy the full responses.</li>
<li>Write <strong>200 words</strong> answering: What did each model do differently? Which reasoning style would you trust in what situation? What surprised you?</li>
</ol>
<p><strong>What to submit:</strong> Your prompt + both responses + your 200-word analysis, all as text. Files optional (useful if you're comparing image output).</p>
<p><strong>Why this matters:</strong> In a world where everyone uses the same models, the competitive edge is <em>knowing which one to use when</em>. This is the exercise that builds that instinct.</p>`,
            content: `<h2>Foundation Models and the Age of Scale</h2>
<p>In May 2020, OpenAI published <strong>GPT-3</strong> — 175 billion parameters, trained on most of the internet, with a prompt interface so simple that a non-programmer could use it. The paper was titled "Language Models Are Few-Shot Learners." The world noticed.</p>

<h3>The Foundation Model Era</h3>
<p>In 2021, Stanford's Percy Liang and others coined "foundation models" to describe a new pattern: one enormous pre-trained model, adapted to dozens of downstream tasks. That one idea is the business model of the current AI industry.</p>

<h3>The Players (2021–2023)</h3>
<ul>
<li><strong>OpenAI</strong> — GPT-3, Codex, GPT-3.5, GPT-4 (March 2023)</li>
<li><strong>Anthropic</strong> — founded in 2021 by former OpenAI researchers. Released Claude 1 in March 2023, then Claude 2, and has been shipping models aggressively ever since.</li>
<li><strong>Google DeepMind</strong> — Gemini family, originally two separate orgs merged in 2023</li>
<li><strong>Meta</strong> — Llama (2023), which broke open-source AI by leaking and then being released</li>
<li><strong>Mistral, Cohere, xAI, DeepSeek</strong> — the second wave</li>
</ul>

<h3>RLHF and the Alignment Problem</h3>
<p>Raw language models generate anything — useful, dangerous, false, or weird. <strong>Reinforcement Learning from Human Feedback (RLHF)</strong> became the standard technique for steering base models toward being useful and safe. Anthropic's <strong>Constitutional AI</strong> approach adds a second technique: have the model critique and revise its own outputs against a written constitution. The whole field of <em>alignment research</em> is about making this work reliably as models get more capable.</p>

<h3>Multimodality</h3>
<p>By 2023, models could see images, not just text. By 2024, they could hear and speak. By 2025–2026, image input was standard, video input was common, and Claude Opus 4.7 shipped with 3× higher-resolution vision than earlier models.</p>

<h3>Agents (2024–2026)</h3>
<p>Once models were reliable enough, the next step was giving them <em>tools</em> — the ability to call APIs, edit files, browse the web, run code. <strong>Tool use</strong> and the <strong>Model Context Protocol (MCP)</strong> turned static chatbots into agents that take real actions.</p>
<p>Claude Code (Anthropic's agentic CLI) and similar tools let the model autonomously read your codebase, plan changes, edit files, run tests, and ship PRs. The same pattern now runs customer support, research workflows, scheduled routines, and entire businesses.</p>

<h3>Current Frontier (April 2026)</h3>
<ul>
<li><strong>Claude Opus 4.7</strong> — adaptive thinking, 1M context, high-res vision, strongest agentic coding model as of this writing</li>
<li><strong>Claude Sonnet 4.6</strong> — fastest intelligent tier, 1M context</li>
<li><strong>Claude Haiku 4.5</strong> — cost-optimized, 200k context, fast</li>
<li><strong>GPT-5, Gemini 2.5, Llama 4</strong> — the other major players in the same tier</li>
</ul>

<h3>Open Questions</h3>
<ul>
<li>Does scaling keep working, or does it plateau?</li>
<li>Is "reasoning" actually emerging or is it pattern matching on reasoning traces?</li>
<li>Can we trust agents to take real actions with real consequences?</li>
<li>What happens when frontier models cost $10B+ to train?</li>
</ul>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>GPT-3 and the moment scaling became undeniable</li>
<li>The foundation model paradigm and why it beat the previous stack</li>
<li>RLHF, Constitutional AI, and the alignment problem</li>
<li>How Anthropic and Claude fit into the landscape</li>
<li>Multimodality — vision, audio, video</li>
<li>Agents, tool use, and MCP — why 2024–2026 feels different</li>
<li>What to actually watch for next: reasoning models, long-horizon agents, on-device models</li>
<li>Wrap-up discussion: what's one thing you believe about AI's future that might be wrong?</li>
</ul>`,
          },
        ],
      },
    ],
  },
  {
    title: "Claude: From API to Agents",
    slug: "claude-from-api-to-agents",
    description:
      "A four-week deep dive into building with Claude. Two two-hour classes per week covering Claude's models, the Anthropic API, tool use and MCP, prompt caching and the Files/Batch APIs, the Claude Agent SDK, multi-agent systems, and Claude Code — the agentic CLI. By the end, you will have shipped a real agent running on Anthropic's infrastructure.",
    published: true,
    order: 1,
    modules: [
      {
        title: "Week 1 — Foundations",
        order: 0,
        lessons: [
          {
            title: "Class 1 — Understanding Claude: Models, Capabilities, Pricing",
            slug: "understanding-claude-models",
            order: 0,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 1, Class 1</h3>
<p><strong>Goal:</strong> Build a working mental model for choosing the right Claude model for a given job.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Pick <strong>three</strong> real-world use cases from your own life or work. Examples: legal contract summarization, customer support triage, code generation for a specific language, market research, tax document OCR, bedtime story generator for your kid.</li>
<li>For each, decide: <strong>Opus 4.7, Sonnet 4.6, or Haiku 4.5?</strong> Then justify in 3–5 sentences. Your justification must reference at least two of: context length needed, reasoning complexity, latency sensitivity, throughput, cost per request.</li>
<li>For one of the three, also pick a <strong>wrong</strong> model and explain in 2 sentences what would go wrong if you used it.</li>
</ol>
<p><strong>What to submit:</strong> Text response with your three use cases + justifications. No code needed yet.</p>
<p><strong>Why this matters:</strong> Model selection is the single biggest lever on cost and quality. Engineers who default to Opus for everything burn money; engineers who default to Haiku ship broken products. This homework trains the instinct.</p>`,
            content: `<h2>The Claude Family in April 2026</h2>
<p>As of today, Anthropic maintains three active production models. They share architecture and training philosophy, but differ in capability, speed, and price.</p>

<h3>The Current Lineup</h3>
<table>
<tr><th>Model</th><th>ID</th><th>Context</th><th>Input / Output $/MTok</th><th>Best For</th></tr>
<tr><td>Opus 4.7</td><td>claude-opus-4-7</td><td>1M</td><td>$5 / $25</td><td>Complex reasoning, agentic coding, long horizons</td></tr>
<tr><td>Sonnet 4.6</td><td>claude-sonnet-4-6</td><td>1M</td><td>$3 / $15</td><td>Balanced production workloads</td></tr>
<tr><td>Haiku 4.5</td><td>claude-haiku-4-5-20251001</td><td>200k</td><td>$1 / $5</td><td>Fast, cost-optimized, high-throughput</td></tr>
</table>

<h3>What "1M Context" Actually Means</h3>
<p>A million tokens is roughly 750,000 words — a very long book, or the entire source code of a mid-sized repo. With prompt caching, you can load a huge context once and query it for 5 minutes (or up to 1 hour) at a 10x cost reduction on the cached portion. This flips the economics of "let me just load the whole codebase in."</p>

<h3>Adaptive Thinking (Opus 4.7)</h3>
<p>Opus 4.7 introduced <strong>adaptive thinking</strong> — the model itself decides how much internal reasoning to do before answering. You no longer manually set a budget. For complex problems it will think longer; for trivial ones it responds immediately. Previous manual <em>extended thinking</em> on Sonnet 4.6 and Haiku 4.5 still works when you want precise control.</p>

<h3>High-Resolution Vision (Opus 4.7)</h3>
<p>Opus 4.7 processes images at 3.75 megapixels (2576×1932), a 3× resolution bump over earlier models. Small UI details, fine text in screenshots, high-density diagrams — all newly readable. Costs more tokens per image, so crop what you can.</p>

<h3>Deprecations to Know About</h3>
<ul>
<li><strong>Claude Haiku 3</strong> retired today (April 19, 2026). If you have anything still on claude-3-haiku-20240307, migrate to Haiku 4.5 immediately.</li>
<li><strong>Sonnet 4 and Opus 4</strong> retire June 15, 2026. Plan the bump to 4.6 / 4.7.</li>
</ul>

<h3>How to Choose</h3>
<p><strong>Use Opus 4.7 when:</strong> long-horizon agentic tasks, code generation on large repos, research synthesis across many documents, deep reasoning where a subtle mistake is expensive.</p>
<p><strong>Use Sonnet 4.6 when:</strong> most production workloads. Ask yourself "does this really need Opus?" — if the answer isn't clearly yes, Sonnet is the right call. 3x cheaper, comparable quality on most tasks.</p>
<p><strong>Use Haiku 4.5 when:</strong> classification, routing, summarization, content moderation, high-volume pipelines. If the task is well-defined and bounded, Haiku will do it fast and cheap.</p>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>The Claude model family and when to use each — worked examples</li>
<li>Pricing mechanics — input vs output, caching, Batch API (50% off)</li>
<li>Context windows — what fits in 200k vs 1M, with concrete byte counts</li>
<li>Adaptive thinking vs manual extended thinking</li>
<li>High-res vision — what changes, what doesn't</li>
<li>Deprecation policy and how to migrate off retired models</li>
<li>Hands-on: run the same prompt against all three models and compare</li>
</ul>`,
          },
          {
            title: "Class 2 — The Claude API: First Calls, Messages, and Streaming",
            slug: "claude-api-first-calls",
            order: 1,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 1, Class 2</h3>
<p><strong>Goal:</strong> Ship your first working integration with Claude.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Build a <strong>terminal chatbot</strong> using the Anthropic SDK (Python or TypeScript). Requirements:
  <ul>
    <li>Streams responses token-by-token (don't block for the full response)</li>
    <li>Maintains multi-turn conversation state (at least the last 10 turns)</li>
    <li>Has a system prompt that gives the bot a distinct personality</li>
    <li>Uses <strong>Sonnet 4.6</strong> (not Opus — you're learning, burn less money)</li>
  </ul>
</li>
<li>Commit your code to a GitHub repo. Include a README explaining how to run it.</li>
<li>Write <strong>100 words</strong> answering: <em>"What surprised you about the streaming interface vs the non-streaming call?"</em></li>
</ol>
<p><strong>What to submit:</strong> GitHub repo URL + your 100-word response in the text box. Optional: upload a screenshot or short video of the bot running.</p>
<p><strong>Hints:</strong> Use <code>anthropic</code> (Python) or <code>@anthropic-ai/sdk</code> (Node). Store your API key in <code>.env</code> — never commit it. Streaming uses <code>client.messages.stream(...)</code>.</p>`,
            content: `<h2>Your First Real Claude Code</h2>
<p>Today we stop talking about Claude and start talking to it programmatically. By the end of this class you will have a working chatbot in the terminal, and you will understand the Messages API well enough to build anything else on it.</p>

<h3>Setup</h3>
<pre><code># Python
pip install anthropic python-dotenv

# Or TypeScript / Node
npm install @anthropic-ai/sdk dotenv</code></pre>
<p>Get an API key from <code>console.anthropic.com</code>. Put it in a <code>.env</code> file as <code>ANTHROPIC_API_KEY=sk-ant-...</code>. Never commit it.</p>

<h3>Your First Call</h3>
<pre><code>import anthropic

client = anthropic.Anthropic()

msg = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(msg.content[0].text)</code></pre>
<p>That's the entire API. Everything else — streaming, tool use, caching, vision, extended thinking — is a variation on this single pattern.</p>

<h3>The Message Structure</h3>
<p>Claude is stateless. Every call sends the <em>entire</em> conversation history in the <code>messages</code> array. The API does not remember previous calls. You manage state.</p>
<pre><code>messages = [
    {"role": "user", "content": "What's the capital of France?"},
    {"role": "assistant", "content": "Paris."},
    {"role": "user", "content": "What's the population?"},
]</code></pre>

<h3>System Prompts</h3>
<p>The <code>system</code> parameter sets Claude's persona, rules, and context. It's separate from the <code>messages</code> array and is where you'd put things like a style guide, company voice, or behavioral rules.</p>
<pre><code>msg = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a terse, sarcastic sysadmin.",
    messages=[{"role": "user", "content": "My server is on fire"}],
)</code></pre>

<h3>Streaming</h3>
<p>For anything user-facing, you want streaming. Responses start appearing immediately instead of waiting for the full generation.</p>
<pre><code>with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about Python"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)</code></pre>

<h3>Assistant Prefill</h3>
<p>You can put words in Claude's mouth. This is invaluable for forcing JSON output or specific response formats.</p>
<pre><code>messages = [
    {"role": "user", "content": "Return a JSON object with a 'greeting' field."},
    {"role": "assistant", "content": "{"},  # Claude continues from here
]</code></pre>

<h3>Token Accounting</h3>
<p>Every response returns a <code>usage</code> object:</p>
<pre><code>{
  "input_tokens": 45,
  "output_tokens": 217,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0
}</code></pre>
<p>Always log this in production. Surprise bills are surprises only because nobody was looking.</p>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>API keys and environment setup (Python + TS)</li>
<li>The Messages API — the one endpoint that does everything</li>
<li>Conversation state — why Claude is stateless and what that means</li>
<li>System prompts done right</li>
<li>Streaming and why it matters for UX</li>
<li>Assistant prefill for format control</li>
<li>Token usage and cost observation from day one</li>
<li>Live-code a streaming terminal chatbot together</li>
</ul>`,
          },
        ],
      },
      {
        title: "Week 2 — Building with the API",
        order: 1,
        lessons: [
          {
            title: "Class 3 — Tool Use and MCP: Connecting Claude to the World",
            slug: "tool-use-and-mcp",
            order: 0,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 2, Class 3</h3>
<p><strong>Goal:</strong> Turn Claude from a chatbot into an agent that takes real actions.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Build a <strong>tool-using agent</strong> that performs one real end-to-end task. Examples: checks the weather for a city and books a calendar block if it's raining; searches your inbox for an invoice and extracts line items; reads a webpage and adds a summary to a Notion page.</li>
<li>Use <strong>at least two tools</strong>. They can be custom tools (JSON schemas you define) or MCP tools (Slack, GitHub, Gmail, Calendar, Drive) — or mix them.</li>
<li>Set <code>strict: true</code> on your tool definitions.</li>
<li>Push to a GitHub repo. In the README, paste your tool schemas verbatim.</li>
</ol>
<p><strong>What to submit:</strong> GitHub repo URL + your tool schema JSON in the text box + a short (1–2 min) screen recording or terminal screenshot showing it actually working end-to-end. Upload the video/screenshot here.</p>
<p><strong>Hint:</strong> Start simple. A weather + calendar agent is more than enough — resist the urge to build something ambitious until the simple case works.</p>`,
            content: `<h2>Tools — Where Claude Stops Being a Chatbot</h2>
<p>A model that can only talk is a chatbot. A model that can call external functions becomes an agent. Tool use is the mechanism, and in 2026 it is mature, reliable, and the foundation of every real Claude deployment.</p>

<h3>The Tool Use Loop</h3>
<p>The pattern is always the same:</p>
<ol>
<li>You send Claude a message + a list of available tools (as JSON schemas)</li>
<li>Claude responds with either a text answer or a <code>tool_use</code> block</li>
<li>If tool_use, <em>you</em> execute the tool and send the result back as a <code>tool_result</code> block</li>
<li>Claude continues until it produces a final text response</li>
</ol>
<p>Claude decides when to call tools. You don't prompt it to. Good tool descriptions matter more than anything else.</p>

<h3>Defining a Tool</h3>
<pre><code>tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city. Returns temperature in F and conditions.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
            },
            "required": ["city"],
        },
        "strict": True,
    }
]</code></pre>
<p><strong>Always set <code>strict: true</code>.</strong> It forces Claude's tool calls to exactly match your schema. Without it, you'll eventually get hallucinated fields and production bugs that are hell to debug.</p>

<h3>Client vs Server Tools</h3>
<ul>
<li><strong>Client tools</strong> — you run them. Custom functions, business logic, anything your code does.</li>
<li><strong>Server tools</strong> — Anthropic runs them. Includes <code>web_search</code>, <code>code_execution</code> (sandboxed Python), <code>web_fetch</code>, <code>computer_use</code>, <code>text_editor</code>, <code>bash</code>. You just enable them.</li>
</ul>

<h3>MCP — The Model Context Protocol</h3>
<p><strong>MCP</strong> is an open standard for exposing tools and data to AI models. Instead of writing bespoke integrations per-app, you run (or connect to) MCP servers, and any MCP-compatible client (Claude Code, Cursor, Claude Desktop) can use them.</p>
<p>Pre-built MCP servers exist for Slack, GitHub, Linear, Gmail, Google Calendar, Google Drive, Postgres, Puppeteer, filesystem, and dozens more. The MCP registry at <code>api.anthropic.com/mcp-registry</code> lists what's available.</p>

<h3>Practical Example: Agent with Two Tools</h3>
<pre><code>response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    tools=[
        {"name": "get_weather", "description": "...", "input_schema": {...}, "strict": True},
        {"name": "book_calendar_block", "description": "...", "input_schema": {...}, "strict": True},
    ],
    messages=[{"role": "user", "content": "Check weather in Seattle. If rainy, book 2pm–3pm as 'indoor work'."}],
)</code></pre>

<h3>Gotchas</h3>
<ul>
<li><strong>Tool descriptions are prompts.</strong> Treat them as such — precise, concrete, with examples if helpful.</li>
<li><strong>Keep schemas small.</strong> Every tool definition is in the input token count. Dozens of tools = expensive calls.</li>
<li><strong>Tool_use doesn't end the turn.</strong> You must continue the conversation by returning a tool_result, then calling messages.create again.</li>
<li><strong>Watch for infinite loops.</strong> An agent can call tools in a loop. Cap max iterations in production.</li>
</ul>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>The tool use loop — what goes in, what comes out</li>
<li>Writing a tool JSON schema that Claude actually uses correctly</li>
<li>Strict mode and why to always use it</li>
<li>Anthropic-provided server tools: web_search, code_execution, computer_use</li>
<li>MCP in practice — installing a server, connecting to it, calling it</li>
<li>Live-build a weather-plus-calendar agent, end to end</li>
<li>Common bugs: malformed tool_result, tool_use that never terminates, schema mismatches</li>
</ul>`,
          },
          {
            title: "Class 4 — Prompt Caching, Files API, and Batch API",
            slug: "caching-files-batch",
            order: 1,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 2, Class 4</h3>
<p><strong>Goal:</strong> Make Claude 10× cheaper on repetitive work.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Pick a document longer than <strong>5,000 tokens</strong>. Can be a PDF (legal contract, paper, long article), a codebase dump, or a knowledge base.</li>
<li>Build a small Q&A loop that lets you ask questions against that document. Requirements:
  <ul>
    <li>The document is loaded as cached context using <code>cache_control: {"type": "ephemeral"}</code>.</li>
    <li>You ask at least 3 questions in sequence.</li>
    <li>After each response, log the <code>usage</code> object including <code>cache_read_input_tokens</code> and <code>cache_creation_input_tokens</code>.</li>
  </ul>
</li>
<li>Take a screenshot or copy the terminal output showing the usage numbers — <strong>the first call writes cache, subsequent calls read</strong>. The cost drop should be obvious.</li>
</ol>
<p><strong>What to submit:</strong> GitHub repo + terminal screenshot showing the cache read/write numbers + the document you used (upload as a file or link). In 100 words, estimate how much you would have saved if you'd run 1,000 queries.</p>`,
            content: `<h2>The Three APIs That Change the Economics</h2>
<p>The Messages API is free to call. But three features — prompt caching, the Files API, and the Batch API — change the cost structure of entire product categories. Skipping them is leaving money on the table.</p>

<h3>Prompt Caching: 90% Off the Same Prefix</h3>
<p>If consecutive API calls share a long static prefix — system prompt, tool definitions, loaded documents, few-shot examples — you can cache it. Cached tokens cost <strong>10% of the base input price</strong>. Cache writes cost <strong>1.25x</strong> (5-min TTL) or <strong>2x</strong> (1-hour TTL). Break-even is roughly the second read.</p>
<pre><code>client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a research assistant. Here is the full document: ...",
            "cache_control": {"type": "ephemeral"},  # caches this block
        }
    ],
    messages=[{"role": "user", "content": "Summarize section 3."}],
)</code></pre>

<h3>Rules of Caching</h3>
<ul>
<li>Cache prefix must be <strong>identical</strong> — even whitespace differences break the match.</li>
<li>Minimum cacheable length: 1024 tokens (Sonnet/Opus) or 2048 (Haiku).</li>
<li>Order <strong>static before dynamic</strong>. Put the stable part first.</li>
<li>Monitor <code>cache_read_input_tokens</code> vs <code>input_tokens</code>. A high read ratio means you're saving money.</li>
<li><strong>Use the 1-hour TTL</strong> for expensive context (large codebases, big docs). Breaks even faster.</li>
</ul>

<h3>Files API: Upload Once, Reference Forever</h3>
<p>Instead of re-sending the same PDF every call, upload it once and pass a <code>file_id</code>.</p>
<pre><code>uploaded = client.beta.files.upload(
    file=("q1-report.pdf", open("q1-report.pdf", "rb"), "application/pdf"),
)

response = client.beta.messages.create(
    model="claude-opus-4-7",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Find contradictions in sections 2 and 5."},
            {"type": "document", "source": {"type": "file", "file_id": uploaded.id}},
        ],
    }],
    betas=["files-api-2025-04-14"],
)</code></pre>
<p><strong>Pricing:</strong> upload/delete/list are free. You still pay input tokens for the content when it's in a request. Combine with caching for maximum leverage.</p>

<h3>Batch API: 50% Off for Async Work</h3>
<p>For work that doesn't need to happen right now — evaluations, content moderation, bulk summarization, data labeling — the Batch API is 50% cheaper.</p>
<ul>
<li>Submit many requests in a single batch</li>
<li>Processed asynchronously (usually &lt;1 hour)</li>
<li>50% discount on both input and output</li>
<li>Can combine with extended output (up to 300k tokens) via the <code>output-300k-2026-03-24</code> beta header</li>
</ul>

<h3>When to Use What</h3>
<table>
<tr><th>Situation</th><th>Tool</th></tr>
<tr><td>Multi-turn chat with same system prompt / docs</td><td>Caching</td></tr>
<tr><td>Same large document queried across sessions/days</td><td>Files API + caching</td></tr>
<tr><td>10k requests for a nightly eval</td><td>Batch API</td></tr>
<tr><td>Bulk PDF summarization</td><td>Files API + Batch API</td></tr>
</table>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>Caching mechanics — 5-min vs 1-hour, how breakpoints work, when it misses</li>
<li>Reading the usage object to verify cache hits</li>
<li>Files API — upload, reference, delete, limits</li>
<li>Batch API — submission, polling, what fits and what doesn't</li>
<li>Combining caching + files + batch for maximum leverage</li>
<li>Live-build a caching-enabled Q&A on a long document together</li>
<li>Pricing math — walk through real scenarios and what they'd cost</li>
</ul>`,
          },
        ],
      },
      {
        title: "Week 3 — Agents",
        order: 2,
        lessons: [
          {
            title: "Class 5 — The Claude Agent SDK: Building Autonomous Agents",
            slug: "claude-agent-sdk",
            order: 0,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 3, Class 5</h3>
<p><strong>Goal:</strong> Build your first real agent — something that takes multiple actions in sequence without you holding its hand.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Build a <strong>multi-step agent</strong> using the Claude Agent SDK (Python or TypeScript). The agent must perform at least <strong>three sequential actions</strong>. Example flows:
  <ul>
    <li>Research a topic → write a summary → email/DM it somewhere</li>
    <li>Fetch recent GitHub issues → categorize → post a digest to Slack</li>
    <li>Scrape an e-commerce page → extract product info → save to a database</li>
  </ul>
</li>
<li>Use the SDK's <strong>session</strong> feature so the agent remembers context across steps.</li>
<li>Add a <strong>hook</strong> (PreToolUse or PostToolUse) that logs every tool call to a file.</li>
<li>Record a short video or take screenshots of the agent running end-to-end, including at least one case where it handled an unexpected response.</li>
</ol>
<p><strong>What to submit:</strong> GitHub repo + upload your screenshots or video + write <strong>200 words</strong> on <em>"What did the agent get wrong or almost get wrong? What did you have to add to make it reliable?"</em></p>`,
            content: `<h2>From API Calls to Agents</h2>
<p>You can build an agent in a weekend with just the Messages API and a tool loop. The <strong>Claude Agent SDK</strong> (<code>claude-agent-sdk</code>) gives you the scaffolding so you're not rebuilding it every time: session management, permissions, hooks, MCP integration, and deployment patterns.</p>

<h3>Why the SDK Over Raw API</h3>
<p>Raw API is fine for simple single-shot calls. The moment you have:</p>
<ul>
<li>Multi-turn state that persists across requests</li>
<li>Tool use loops that need retry / failure handling</li>
<li>Permission prompts (ask the user before a destructive action)</li>
<li>MCP servers to connect</li>
<li>Hooks that run on every tool call (logging, validation, kill switches)</li>
</ul>
<p>...the SDK saves you days of scaffolding.</p>

<h3>Core Concepts</h3>
<ul>
<li><strong>Agent</strong> — model + system prompt + tools + permissions</li>
<li><strong>Session</strong> — persistent conversation state across multiple turns (handles context trimming automatically)</li>
<li><strong>Tools</strong> — custom functions, or MCP-backed tools</li>
<li><strong>Permissions</strong> — ask / allow / auto / deny per tool or pattern</li>
<li><strong>Hooks</strong> — code that runs before/after tool calls or at lifecycle events</li>
</ul>

<h3>Minimal Example</h3>
<pre><code>from anthropic_agent_sdk import Agent, Tool

def fetch_issues(repo: str) -> list:
    # your implementation
    return [...]

agent = Agent(
    model="claude-sonnet-4-6",
    system_prompt="You triage GitHub issues for repos.",
    tools=[
        Tool(name="fetch_issues", description="...", function=fetch_issues),
    ],
)

session = agent.create_session()
r1 = session.send_message("Pull the last 50 issues from anthropic-ai/claude-code")
r2 = session.send_message("Group them by severity and give me the top 3")
r3 = session.send_message("Draft a Slack digest")</code></pre>

<h3>Hooks: Your Observability and Safety Layer</h3>
<p>Hooks fire on lifecycle events — <code>PreToolUse</code>, <code>PostToolUse</code>, <code>SessionStart</code>, <code>Stop</code>, and others. Use them for:</p>
<ul>
<li>Logging every tool call with inputs and outputs</li>
<li>Blocking dangerous operations (e.g., any <code>rm -rf</code>)</li>
<li>Rate limiting / cost caps</li>
<li>Metrics to Datadog, Honeycomb, whatever you use</li>
</ul>

<h3>Permissions</h3>
<p>Default mode is <strong>ask</strong> — user confirms every tool call. For production agents running unattended, move to <strong>allow</strong> with a strict allowlist, or <strong>auto</strong> (a classifier approves safe calls). Never ship an agent to production without thinking through the permission model.</p>

<h3>MCP in the SDK</h3>
<pre><code>agent = Agent(
    model="claude-opus-4-7",
    mcp_servers=[
        {"name": "slack", "url": "mcp://slack-server"},
        {"name": "github", "url": "mcp://github-server"},
    ],
)</code></pre>
<p>Tools from MCP servers are available to the agent automatically.</p>

<h3>Deployment Patterns</h3>
<ul>
<li><strong>Local</strong> — run on dev machine, full filesystem access</li>
<li><strong>Serverless</strong> — Lambda / Cloud Functions, cold-start caveats</li>
<li><strong>Cloud routine</strong> — Anthropic's infrastructure, cron or API triggers, machine can be off (we cover this in Week 4)</li>
</ul>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>Agent SDK anatomy — agent, session, tools, permissions, hooks</li>
<li>Building a research-and-write agent live</li>
<li>Hooks in practice — logging, safety nets, cost caps</li>
<li>Permission models — ask vs allow vs auto, and when each is appropriate</li>
<li>MCP integration through the SDK</li>
<li>Failure modes we'll actually hit: tool errors, context overflow, rate limits</li>
<li>Wrap-up: take the chatbot from Week 1 and upgrade it to a proper agent</li>
</ul>`,
          },
          {
            title: "Class 6 — Multi-Agent Systems: Delegation and Subagents",
            slug: "multi-agent-systems",
            order: 1,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 3, Class 6</h3>
<p><strong>Goal:</strong> Design and build a system where one Claude agent delegates work to others.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>First, design on paper.</strong> Sketch a 2- or 3-agent system that does something useful. Draw it as boxes and arrows. Each agent gets: a name, a model (Opus / Sonnet / Haiku), a system prompt summary, and a list of tools. Include <em>why</em> each agent exists and why it's not just one monolithic agent.</li>
<li><strong>Then build it.</strong> Use the Agent SDK's subagent pattern. The coordinator delegates to specialists; specialists return results; coordinator synthesizes.</li>
<li>Use <strong>different models</strong> for different agents intentionally (e.g., Haiku for fast classification, Opus for deep synthesis).</li>
</ol>
<p><strong>What to submit:</strong></p>
<ul>
<li>Your design sketch — upload as image/PDF, or describe in text</li>
<li>GitHub repo URL</li>
<li>150 words on: <em>"Why did you split it this way? What would be harder or worse if you'd built it as one agent?"</em></li>
</ul>
<p><strong>Ideas:</strong> research coordinator + web-search specialist + writing specialist; triage agent + bug-fixing agent + PR-writing agent; meal planner + grocery optimizer + recipe formatter.</p>`,
            content: `<h2>One Agent Isn't Always Enough</h2>
<p>As tasks get more complex, a single agent with every tool bolted on becomes unwieldy. The system prompt gets enormous, tool count explodes, context fills up, and the agent starts making worse decisions because it has to juggle too much.</p>
<p>The fix is decomposition: <strong>multi-agent systems</strong>. A coordinator delegates to specialists. Specialists have focused contexts, smaller tool sets, and often cheaper models.</p>

<h3>When to Split</h3>
<p>Split when you hit one of these:</p>
<ul>
<li>A phase of work has distinct expertise (research vs writing vs coding vs reviewing)</li>
<li>You want to use a cheaper model for bounded sub-tasks (Haiku classifies, Opus synthesizes)</li>
<li>Context is blowing up because every call carries irrelevant history</li>
<li>One tool's output is huge and pollutes the coordinator's context (log files, search results, raw HTML)</li>
</ul>

<h3>The Coordinator + Specialist Pattern</h3>
<pre><code>from anthropic_agent_sdk import Agent

research_agent = Agent(
    model="claude-haiku-4-5",
    system_prompt="You are a research specialist. Return concise, cited findings.",
    tools=[web_search_tool, web_fetch_tool, read_file_tool],
)

writing_agent = Agent(
    model="claude-sonnet-4-6",
    system_prompt="You write clean, short, publication-ready prose.",
    tools=[read_file_tool, write_file_tool],
)

coordinator = Agent(
    model="claude-opus-4-7",
    subagents={
        "research": research_agent,
        "writer": writing_agent,
    },
    system_prompt="You coordinate research and writing tasks. Delegate to specialists.",
)</code></pre>
<p>When the coordinator delegates, the subagent runs in its own isolated context. The subagent's back-and-forth does <em>not</em> pollute the coordinator's context — only the final result comes back. This is the single biggest reason to split.</p>

<h3>Context Isolation Is the Point</h3>
<p>If your research phase generates 80k tokens of intermediate output, the coordinator doesn't need any of that. It needs the 500-token summary. Subagents enforce this separation automatically.</p>

<h3>Design Principles</h3>
<ul>
<li><strong>Clear contracts.</strong> Each subagent should have a well-defined input and output shape. Treat them like microservices.</li>
<li><strong>Right-size the model.</strong> Don't pay Opus prices for tasks Haiku can do. Your coordinator probably needs Opus or Sonnet; your specialists often don't.</li>
<li><strong>Limit delegation depth.</strong> Coordinator calls specialists. Specialists do not typically call specialists. Deep trees are hard to debug.</li>
<li><strong>Budget per subagent.</strong> Cap each specialist's max tokens, max iterations, and max wall time. One runaway specialist can burn your whole spend.</li>
</ul>

<h3>Anti-Patterns</h3>
<ul>
<li><strong>Premature splitting.</strong> A 3-step agent doesn't need 3 specialists. Split when you feel actual pain.</li>
<li><strong>Chatty coordinators.</strong> Every round trip to a specialist costs tokens. Batch where you can.</li>
<li><strong>Duplicate context.</strong> Sending the same big document to every specialist is expensive. Let the coordinator extract what each one needs.</li>
<li><strong>Over-supervision.</strong> If you find your coordinator micro-managing, the specialist's system prompt is too vague.</li>
</ul>

<h3>Claude Code's Subagents — A Real Example</h3>
<p>Claude Code ships with specialized subagents built in: a code explorer, a planner, a code reviewer, etc. When you ask the main agent to "research how X works across the codebase," it spawns an explorer subagent, which burns through 50+ file reads in its own context, and returns a short summary. The main agent never sees the file contents. You've effectively expanded your context budget by an order of magnitude.</p>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>When to split vs when to keep it one agent</li>
<li>The coordinator-specialist pattern, step by step</li>
<li>Context isolation and why it's the whole point</li>
<li>Model selection per role — right-sizing Opus/Sonnet/Haiku in a system</li>
<li>Live-build a 3-agent research pipeline</li>
<li>Failure modes: handoff errors, context leakage, infinite delegation</li>
<li>Cost modeling — how to estimate a multi-agent run before you ship it</li>
</ul>`,
          },
        ],
      },
      {
        title: "Week 4 — Claude Code and Production",
        order: 3,
        lessons: [
          {
            title: "Class 7 — Claude Code: The CLI, Skills, and Hooks",
            slug: "claude-code-cli-skills-hooks",
            order: 0,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 4, Class 7</h3>
<p><strong>Goal:</strong> Customize Claude Code so it matches the way you actually work.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>Write a custom skill.</strong> Pick a task you do repeatedly. Examples: summarize a PR, generate a commit message from staged diff, scaffold a new API route to match your project's conventions, review a file against your style guide. Create the skill at <code>.claude/skills/your-skill-name/SKILL.md</code> with proper frontmatter (name, description, allowed-tools, etc.).</li>
<li><strong>Write one hook.</strong> Add a <code>PreToolUse</code> or <code>PostToolUse</code> hook to your project's <code>.claude/settings.json</code>. Examples: block any <code>rm -rf</code>; log every Bash command to a file; run the linter after every Edit; notify Slack after every git commit.</li>
<li><strong>Test both.</strong> Invoke your skill (<code>/your-skill-name</code>) and trigger your hook at least once.</li>
</ol>
<p><strong>What to submit:</strong></p>
<ul>
<li>The SKILL.md file (upload it)</li>
<li>The relevant block of settings.json (paste into text box or upload)</li>
<li>A screenshot or terminal paste showing the skill running and the hook firing</li>
<li>In 100 words: <em>"What did the skill do for you that a prompt couldn't?"</em></li>
</ul>`,
            content: `<h2>Claude Code — Where Agents Become Ambient</h2>
<p>Claude Code is Anthropic's agentic CLI — Claude running in your terminal with file access, shell access, and your codebase as context. If you've used it, you know how different it feels from copying code in and out of a chat window. If you haven't, install it today.</p>

<h3>Install and First Run</h3>
<pre><code>curl -fsSL https://claude.ai/install.sh | bash

cd ~/your-project
claude</code></pre>
<p>That's it. It authenticates with your Anthropic account, loads your project, and you're running.</p>

<h3>The Surfaces</h3>
<p>Claude Code runs in the terminal, the desktop app (macOS + Windows), on the web at <code>claude.ai/code</code>, and as VS Code / JetBrains extensions. All surfaces share the same engine, skills, settings, and MCP servers.</p>

<h3>Built-in Slash Commands You'll Actually Use</h3>
<ul>
<li><code>/init</code> — create a CLAUDE.md project memory file</li>
<li><code>/compact</code> — summarize context to free up tokens before hitting limits</li>
<li><code>/review</code> — review your current diff</li>
<li><code>/security-review</code> — security scan of pending changes</li>
<li><code>/schedule</code> — set up a cloud routine (see Class 8)</li>
<li><code>/loop 5m "check the logs"</code> — run a prompt on a recurring interval</li>
<li><code>/effort xhigh</code> — turn up reasoning effort for hard problems</li>
</ul>

<h3>Skills: Your Reusable Workflows</h3>
<p>A <strong>skill</strong> is a markdown file that teaches Claude Code how to do something. Located at <code>.claude/skills/&lt;name&gt;/SKILL.md</code> (project) or <code>~/.claude/skills/&lt;name&gt;/SKILL.md</code> (personal).</p>
<pre><code>---
name: pr-summary
description: Summarize the current PR's diff. Use when the user asks for a PR description or changelog entry.
allowed-tools: "Read Grep Bash(git *)"
---

When writing a PR summary:
1. Run \`git diff main...HEAD --stat\` to get the scope.
2. Run \`git log main..HEAD\` for commit messages.
3. Write a summary with: what changed, why, and test plan.

Keep it under 200 words. Use bullet points for the changed files list.</code></pre>
<p>The <em>description</em> is what Claude uses to decide when to apply the skill. Keep descriptions specific about <em>when</em> to use the skill, not just what it does.</p>

<h3>Hooks: Automate Around Tool Events</h3>
<p>Hooks run shell commands (or other things) before/after Claude takes actions. Configured in <code>.claude/settings.json</code>:</p>
<pre><code>{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(rm -rf*)",
            "command": "echo 'BLOCKED' && exit 1"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {"type": "command", "command": "npm run lint --silent"}
        ]
      }
    ]
  }
}</code></pre>
<p>Hook events include <code>PreToolUse</code>, <code>PostToolUse</code>, <code>UserPromptSubmit</code>, <code>SessionStart</code>, <code>Stop</code>, and about two dozen others. Use them for logging, safety checks, automated formatting, Slack notifications — anything that should happen deterministically.</p>

<h3>CLAUDE.md — Your Project's Instruction Manual</h3>
<p>A <code>CLAUDE.md</code> at the project root is loaded into every Claude Code session as context. Put: architecture notes, coding standards, the deployment process, known landmines. <em>Do not</em> put things that change every sprint — <code>CLAUDE.md</code> is for durable facts.</p>

<h3>MCP in Claude Code</h3>
<p>Wire up MCP servers in <code>settings.json</code>. Once configured, Claude Code can talk to Slack, Linear, Postgres, your internal APIs, anything with an MCP adapter. MCP lives in both the API/SDK and the CLI — same protocol, different consumer.</p>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>Install, login, first real task</li>
<li>The slash commands you'll use daily — <code>/init</code>, <code>/compact</code>, <code>/review</code></li>
<li>Writing a SKILL.md from scratch and invoking it</li>
<li>Hooks — live-writing a PreToolUse and PostToolUse hook</li>
<li>CLAUDE.md best practices — what belongs, what doesn't</li>
<li>MCP servers in the CLI context</li>
<li>Settings hierarchy (managed &gt; user &gt; project &gt; local)</li>
<li>Permissions — ask, allow, auto — and what to ship to production</li>
</ul>`,
          },
          {
            title: "Class 8 — Routines and Production Deployment",
            slug: "routines-production-deployment",
            order: 1,
            duration: 120,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 4, Class 8 (Final)</h3>
<p><strong>Goal:</strong> Ship a real agent to production that runs when you aren't watching.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>Set up a cloud routine</strong> at <code>claude.ai/code/routines</code> (or via <code>/schedule</code> in Claude Code). The routine must:
  <ul>
    <li>Solve an actual problem you have — not a toy</li>
    <li>Run at least daily (or on an API / GitHub trigger)</li>
    <li>Have a non-trivial prompt with clear success criteria</li>
    <li>Use at least one connector or repo</li>
  </ul>
</li>
<li>Let it run for <strong>24 hours</strong>. Watch the session outputs.</li>
<li>Look at the results. Did it do what you wanted? What failed?</li>
<li><strong>Iterate</strong> at least once — refine the prompt based on what you saw.</li>
</ol>
<p><strong>What to submit:</strong></p>
<ul>
<li>Screenshot of your routine config (upload image)</li>
<li>Screenshot of at least one successful run's output (upload image)</li>
<li>Link to the repo(s) or connector(s) it touches</li>
<li>In 200 words: <em>"What problem does this routine solve, how did you iterate the prompt, and what's the next thing you'd add?"</em></li>
</ul>
<p><strong>Ideas:</strong> daily PR review digest, auto-triage of GitHub issues, morning brief of your calendar + inbox, weekly dependency upgrade sweep, on-call alert summarizer. Pick something you'll actually keep using after the class ends.</p>`,
            content: `<h2>Putting Agents on Autopilot</h2>
<p>The last missing piece: running an agent when your laptop is closed, at 6am, or when something happens in another system. Anthropic's <strong>cloud routines</strong> (research preview, April 2026) run Claude Code sessions on Anthropic's infrastructure on a schedule or trigger.</p>

<h3>Three Ways to Schedule Work</h3>
<table>
<tr><th></th><th>Cloud Routines</th><th>Desktop Scheduled Tasks</th><th><code>/loop</code></th></tr>
<tr><td>Runs on</td><td>Anthropic infrastructure</td><td>Your machine</td><td>Your machine</td></tr>
<tr><td>Machine must be on</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Triggers</td><td>Schedule, API, GitHub events</td><td>Schedule only</td><td>Manual interval</td></tr>
<tr><td>Persistent across restarts</td><td>Yes</td><td>Yes</td><td>No</td></tr>
<tr><td>Local file access</td><td>Fresh clone</td><td>Yes</td><td>Yes</td></tr>
</table>
<p>Cloud routines are the right choice for anything you want "to just keep running" without depending on any physical machine.</p>

<h3>Creating a Routine</h3>
<p>Easiest: <code>/schedule</code> inside Claude Code, or visit <code>claude.ai/code/routines</code>. You configure:</p>
<ul>
<li><strong>Prompt</strong> — the task Claude will run</li>
<li><strong>Repos</strong> — which GitHub repos to clone (branch-restricted by default to <code>claude/*</code>)</li>
<li><strong>Connectors</strong> — MCP servers / integrations available to the routine</li>
<li><strong>Trigger</strong> — schedule (cron), API endpoint, or GitHub event filter</li>
<li><strong>Environment</strong> — env vars, network access, optional setup script</li>
</ul>

<h3>Three Kinds of Triggers</h3>
<ol>
<li><strong>Schedule</strong> — cron-style. "Every weekday at 7am." "Monday mornings." Custom cron expressions supported.</li>
<li><strong>API</strong> — POST to an endpoint with a bearer token, optionally with a text payload. Call from Sentry, Datadog, deploy pipelines, or internal tools.</li>
<li><strong>GitHub event</strong> — reacts to PR opened / closed / merged / released. Filter by author, labels, title regex, branch.</li>
</ol>

<h3>Example: Daily PR Triage Routine</h3>
<pre><code>Trigger: Schedule — every weekday at 7am

Prompt:
  Pull open PRs across my three repos from the last 24 hours.
  Categorize each as: ready-to-merge, needs-review, stale.
  For stale PRs, write a one-sentence nudge comment.
  Post a digest to #dev Slack with counts and links.

Repos: my-org/api, my-org/web, my-org/mobile
Connectors: GitHub, Slack
Allowed branches: claude/*</code></pre>
<p>Runs every weekday at 7am, on Anthropic's infrastructure, whether your laptop is open or not. Sessions show up at <code>claude.ai/code</code> — you can review, debug, or continue manually.</p>

<h3>Production Hygiene</h3>
<ul>
<li><strong>Budget everything.</strong> Every routine should have max_tokens, max_iterations, and a spend cap in your head.</li>
<li><strong>Log tool calls.</strong> Hooks → logs → grep. You will need this when something goes wrong at 3am.</li>
<li><strong>Tight prompts.</strong> Routines run unattended. A vague prompt at interactive scale is tolerable; at 1440-runs-per-day scale it isn't.</li>
<li><strong>Lock down connectors.</strong> A routine that needs GitHub read-only shouldn't have GitHub write. Least privilege.</li>
<li><strong>Restrict branches.</strong> Default is <code>claude/*</code> only — keep it that way unless you have a specific reason.</li>
<li><strong>Monitor costs.</strong> Routines draw from your subscription usage. Check weekly.</li>
</ul>

<h3>When to Reach for What</h3>
<ul>
<li><strong>Interactive session</strong> — you're working with Claude Code live</li>
<li><strong>/loop</strong> — quick polling during the current session ("check the build every 2 minutes")</li>
<li><strong>Desktop scheduled task</strong> — needs local file system access, you're OK if the machine is on</li>
<li><strong>Cloud routine</strong> — anything that must run reliably 24/7</li>
<li><strong>API-triggered routine</strong> — reactive workflows from your other systems</li>
</ul>

<h3>What We'll Cover Today (2 hours)</h3>
<ul>
<li>Cloud routines vs desktop tasks vs <code>/loop</code> — when each is right</li>
<li>Creating your first routine end to end</li>
<li>All three trigger types — schedule, API, GitHub event — live</li>
<li>Connector permissions and branch restrictions</li>
<li>Cost observation and budgeting</li>
<li>Failure modes: prompt drift, quota exhaustion, tool auth expiry</li>
<li>Final project: a routine that actually solves a real problem for each student</li>
<li>What to learn next — pointers to Anthropic Academy, the docs, and staying current</li>
</ul>`,
          },
        ],
      },
    ],
  },
  {
    title: "Build an AI Business: From Idea to First $10K",
    slug: "build-an-ai-business",
    description:
      "A 6-week, 12-class intensive for college students who want to actually ship an AI-powered business. Each class is 90 minutes. By the end you'll have a live product, your first paying customers, and the legal/financial stack set up correctly. Grounded in real 2026 founder case studies — no hype, no fluff.",
    published: true,
    order: 2,
    modules: [
      {
        title: "Week 1 — The AI Business Landscape",
        order: 0,
        lessons: [
          {
            title: "Class 1 — What's Actually Making Money with AI Right Now",
            slug: "whats-making-money-with-ai",
            order: 0,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 1, Class 1</h3>
<p><strong>Goal:</strong> Develop an eye for what separates AI businesses that actually make money from ones that don't.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Pick <strong>3 founders</strong> from this list (or find better ones): Pieter Levels (@levelsio, PhotoAI), Danny Postma (HeadshotPro), Marc Lou (ShipFast), Adrian Paler (Boring Marketing), Simon Høiberg (FeedHive), Riley Brown (Vibecode), Tibo Louis-Lucas (TweetHunter), Jordan Gal (Rosie), Alex Finn (Creator Magic), John Rush (Unicorn Platform).</li>
<li>For each founder, write a <strong>teardown</strong> covering: (a) what the product does in one sentence, (b) the business model — SaaS / agency / productized service / one-time license, (c) stated revenue with source link, (d) what specific niche they chose and why nobody else was there, (e) how they got their first 100 customers.</li>
<li>At the end, write <strong>200 words</strong> on the single pattern that surprised you most and what you'd copy for your own business.</li>
</ol>
<p><strong>What to submit:</strong> Teardowns + reflection as a text document (upload or paste). Include the source links.</p>
<p><strong>Why this matters:</strong> Most AI startup failures come from picking the wrong niche — "a better ChatGPT" that already has a trillion-dollar competitor. Every real winner picks a specific, often boring, buyer. You need to see that pattern clearly before you pick your own.</p>`,
            content: `<h2>What's Actually Making Money with AI in 2026</h2>
<p>Before you build anything, we'll look at what already works. Not to copy it — but because the patterns are unmistakable once you see them side by side.</p>

<h3>The Reality Check</h3>
<p>A solo founder in 2026 can realistically hit <strong>$10k/mo MRR in 3–12 months</strong>. A 2–3 person team can hit $100k MRR in 6–18 months. A handful of AI-era founders have built businesses earning $1M+/year with fewer than 5 employees. These aren't outliers — they're the pattern.</p>

<h3>12 Case Studies We'll Dissect</h3>
<table>
<tr><th>Founder</th><th>Product</th><th>Revenue</th><th>Lesson</th></tr>
<tr><td>Pieter Levels</td><td>PhotoAI (consumer AI photos)</td><td>~$120k MRR solo</td><td>Publish your Stripe dashboard publicly → audience is distribution</td></tr>
<tr><td>Danny Postma</td><td>HeadshotPro (LinkedIn headshots)</td><td>$1M ARR in year 1</td><td>Pick a B2B use case where the buyer <em>needs</em> it for their job</td></tr>
<tr><td>Adrian Paler</td><td>Boring Marketing (AI SEO agency)</td><td>$1M ARR in 6 months</td><td>Services hit $1M faster than SaaS — $5–20k/mo per client</td></tr>
<tr><td>Marc Lou</td><td>ShipFast (Next.js boilerplate)</td><td>~$130k/mo peak</td><td>Sell picks-and-shovels to the people building the gold rush</td></tr>
<tr><td>Jordan Gal</td><td>Rosie (AI phone receptionist)</td><td>Six-figure ARR</td><td>Voice AI for local services is greenfield — plumbers don't care which model</td></tr>
<tr><td>Simon Høiberg</td><td>FeedHive (social scheduler)</td><td>$50k+ MRR</td><td>Bolt AI onto an existing workflow tool, not a new one</td></tr>
<tr><td>Alex Finn</td><td>Creator Magic (content cloning)</td><td>$100k+/mo</td><td>"Teach creators to clone themselves with AI" &gt; making another AI tool</td></tr>
<tr><td>John Rush</td><td>Portfolio of ~20 small SaaS</td><td>~$80k MRR</td><td>10 small $5k/mo products = diversified $50k/mo business</td></tr>
<tr><td>Riley Brown</td><td>Vibecode (teaching AI app building)</td><td>Six-figure course rev</td><td>Being the best public teacher of a new tool <em>is</em> a business</td></tr>
<tr><td>Tibo Louis-Lucas</td><td>TweetHunter/Taplio</td><td>~$100k MRR → 8-fig exit</td><td>AI + one specific social platform &gt; "general AI writer"</td></tr>
<tr><td>Jon Yongfook</td><td>Bannerbear (image API)</td><td>$60k+ MRR solo</td><td>Transparent pricing + public metrics compound</td></tr>
<tr><td>Greg Isenberg</td><td>Late Checkout (studio)</td><td>$1M+ ARR across portfolio</td><td>A studio of bets beats one bet</td></tr>
</table>

<h3>The 10 Patterns Every Winner Shares</h3>
<ol>
<li><strong>Niche beats general.</strong> Specific buyer (LinkedIn headshots, dentists' phones, Twitter growth). Nobody wins with "a better ChatGPT."</li>
<li><strong>The founder's face is distribution.</strong> Audience on X/YouTube/TikTok, not paid ads.</li>
<li><strong>Build-in-public is the marketing.</strong> Public MRR + teardown threads &gt; ad budgets.</li>
<li><strong>Ship in weeks, not quarters.</strong> Every v1 was under 90 days.</li>
<li><strong>AI is a feature, not the product.</strong> The product is the workflow. Model gets swapped for the next one.</li>
<li><strong>Two dominant prices:</strong> $20–100/mo subscription or $29–299 one-time.</li>
<li><strong>Agencies hit $1M ARR faster than SaaS.</strong> $5k/mo per client beats needing 1000 subscribers.</li>
<li><strong>The stack is commodity.</strong> OpenAI/Anthropic + Stripe + Next.js + Vercel shows up in every case.</li>
<li><strong>Portfolios reduce risk.</strong> Ten $5k/mo products = $50k/mo with diversification.</li>
<li><strong>Boring &gt; sexy.</strong> Wins are in phones, SEO, payroll — not flashy consumer AI.</li>
</ol>

<h3>What We're Covering (90 min)</h3>
<ul>
<li>Side-by-side teardown of all 12 case studies with revenue sources</li>
<li>The "niche test" — how to spot a real niche vs. a fake one in 5 minutes</li>
<li>Why "AI for X" wins and "AI general-purpose" loses</li>
<li>SaaS vs. agency vs. productized service — decision framework</li>
<li>How to separate verified revenue from founder-stated vanity numbers</li>
<li>Discussion: which of these would YOU build, which would you never touch, and why?</li>
</ul>

<h3>The Real Lesson</h3>
<p>Most college students trying to start an AI business fail the same way: they build something impressive that nobody pays for. They optimized the wrong axis. By the end of this course, you'll have the opposite problem — a scrappy product that 50 people pay for — because we start with "what are people paying for" and work backwards.</p>`,
          },
          {
            title: "Class 2 — The AI Builder's Stack in 2026",
            slug: "ai-builders-stack-2026",
            order: 1,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 1, Class 2</h3>
<p><strong>Goal:</strong> Stand up the full stack you'll use for the rest of the course.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>Sign up for each</strong> (free tiers are fine): <a href="https://claude.ai">Claude Pro</a> ($20/mo — this is the one paid subscription), <a href="https://supabase.com">Supabase</a>, <a href="https://vercel.com">Vercel</a>, <a href="https://polar.sh">Polar</a> (or Stripe if US-only), <a href="https://posthog.com">PostHog</a>, <a href="https://resend.com">Resend</a>, a <a href="https://porkbun.com">Porkbun</a> domain ($10-ish for .com).</li>
<li><strong>Pick one builder:</strong> Lovable (fastest for non-coders), Cursor (if you know basic JS), or Claude Code (if you're comfortable with terminal). Sign up and complete their 5-min tutorial.</li>
<li><strong>Deploy a "Hello, [your name]" page</strong> — any page, anywhere on the internet, under a real domain you own. Submit the live URL.</li>
<li>Write <strong>150 words</strong> explaining which builder you picked and why, and what you expect to struggle with.</li>
</ol>
<p><strong>What to submit:</strong> The live URL of your deployed page + your 150-word reflection.</p>
<p><strong>Why this matters:</strong> Nothing teaches better than shipping. Every week from here on, your homework gets progressively more ambitious on top of this stack.</p>`,
            content: `<h2>The AI Builder's Stack — April 2026</h2>
<p>Every case study last class used roughly the same toolkit. It's commodity now — which is great news, because you can stand the whole thing up in an afternoon.</p>

<h3>The Categories</h3>

<h4>1. Vibe coding / AI app builders</h4>
<ul>
<li><strong>Lovable 2.0</strong> — $25/mo. Fastest if you don't code. Full-stack apps with Supabase pre-wired. Shipping to deployed URL in an afternoon. <em>Gotcha:</em> message credits burn fast when debugging.</li>
<li><strong>Cursor</strong> — $20/mo Pro. The default AI IDE. Best if you know basic JavaScript. <em>Gotcha:</em> heavy users need $40 Ultra plan for unrestricted Claude access.</li>
<li><strong>Claude Code</strong> — included with Claude Pro ($20/mo). Terminal-native, best for students comfortable with CLI. Ships more maintainable code than Lovable/Bolt. <em>Gotcha:</em> no built-in hosting — pair with Vercel.</li>
</ul>

<h4>2. Backend-in-a-box</h4>
<ul>
<li><strong>Supabase</strong> — free tier handles most MVPs. Postgres + auth + storage + realtime. Every AI builder integrates it natively. <em>Gotcha:</em> free projects pause after a week of inactivity.</li>
<li><strong>Convex</strong> — reactive/realtime-first, great for AI chat apps. TypeScript-native.</li>
<li><strong>Neon</strong> — serverless Postgres with branching. Pair with Clerk or Better Auth.</li>
</ul>

<h4>3. Payments</h4>
<ul>
<li><strong>Polar</strong> — 4% + 40¢, Merchant of Record. Handles sales tax/VAT globally. Best for students selling internationally.</li>
<li><strong>Lemon Squeezy</strong> — 5% + 50¢, MoR. Slightly pricier than Polar, bigger ecosystem.</li>
<li><strong>Stripe</strong> — 2.9% + 30¢. Cheapest but <em>you</em> owe sales tax in every state you hit nexus. Stripe Tax helps ($0.50/txn) but doesn't file returns. Biggest tax footgun for students.</li>
</ul>

<h4>4. AI model access</h4>
<ul>
<li><strong>Anthropic Claude</strong> — Sonnet 4.5 at $3/$15 per million tokens in/out. Best quality-per-dollar for agentic + code tasks.</li>
<li><strong>Groq / Cerebras</strong> — Llama 4 / Qwen 3 at 1000+ tok/s for $0.10–0.60/MTok. Use for high-volume simple tasks where latency matters.</li>
<li><strong>OpenAI</strong> — GPT-5 at $2.50/$10. Keep as fallback.</li>
<li><strong>OpenRouter</strong> — single API key across all providers, ~0% markup. Swap models without code changes.</li>
</ul>

<h4>5. Image / video generation</h4>
<ul>
<li><strong>FAL</strong> — FLUX.1 at ~$0.025/image, Kling 2.0 video at ~$0.20/sec. Fastest + cheapest for product features.</li>
<li><strong>Replicate</strong> — widest catalog of open-source models. Slightly slower.</li>
</ul>

<h4>6. Landing pages</h4>
<ul>
<li><strong>Framer</strong> — $15/mo. AI "Workshop" generates sites from prompts. 30 minutes to ship.</li>
<li><strong>ShipFast by Marc Lou</strong> — $299 one-time. Next.js boilerplate with Stripe + auth + emails wired. Overkill for just a landing page, pays off if it's your app shell too.</li>
<li><strong>Vercel templates</strong> — free. Deploy in 5 minutes if you know some code.</li>
</ul>

<h4>7. Analytics + feedback</h4>
<ul>
<li><strong>PostHog</strong> — free tier covers 1M events + session replays + feature flags + surveys + LLM observability. One tool.</li>
<li><strong>Plausible</strong> — $9/mo, privacy-friendly page views for your landing page.</li>
</ul>

<h4>8. Automation / agents</h4>
<ul>
<li><strong>n8n</strong> — self-hosted free or $24/mo Cloud. 500+ integrations, native LLM nodes. Replaces Zapier.</li>
<li><strong>Claude Code subagents + MCP</strong> — essentially free if you have Claude Pro. Write automations as prompts + tools, run on cron.</li>
</ul>

<h3>The $20/mo Student Starter Stack</h3>
<table>
<tr><th>Layer</th><th>Tool</th><th>Cost</th></tr>
<tr><td>Coding + LLM</td><td>Claude Code (via Claude Pro)</td><td>$20/mo</td></tr>
<tr><td>Hosting</td><td>Vercel Hobby</td><td>$0</td></tr>
<tr><td>Backend / Auth</td><td>Supabase Free</td><td>$0</td></tr>
<tr><td>Payments</td><td>Polar (MoR)</td><td>$0 fixed + 4%+40¢ per sale</td></tr>
<tr><td>Landing page</td><td>Framer Free or Vercel template</td><td>$0</td></tr>
<tr><td>Analytics</td><td>PostHog Free</td><td>$0</td></tr>
<tr><td>Email</td><td>Resend Free (3k/mo)</td><td>$0</td></tr>
<tr><td>Domain</td><td>Porkbun .com</td><td>~$1/mo amortized</td></tr>
<tr><td><strong>Total</strong></td><td></td><td><strong>~$21/mo</strong></td></tr>
</table>

<h3>One Meta-Gotcha</h3>
<p><strong>Free tiers are a trap if you don't read the limits.</strong> Set billing alerts on every service the day you sign up. One viral TikTok can turn a $0/mo stack into a $2,000 surprise bill on FAL or Vercel if you skip rate limits. Every single tool above lets you set a hard monthly cap — use it.</p>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>Live walkthrough: setting up the full stack end-to-end</li>
<li>Picking the right builder for your skill level</li>
<li>Why MoR providers (Polar/Lemon Squeezy) save you from tax nightmares</li>
<li>Rate-limit your endpoints on day one, not after the surprise bill</li>
<li>OpenRouter as a universal model switcher</li>
<li>Homework: everyone in the class gets a deployed "hello" page by the end of the day</li>
</ul>`,
          },
        ],
      },
      {
        title: "Week 2 — Finding Your Idea",
        order: 1,
        lessons: [
          {
            title: "Class 3 — How to Spot a Real Opportunity",
            slug: "spot-a-real-opportunity",
            order: 0,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 2, Class 3</h3>
<p><strong>Goal:</strong> Leave this week with a specific, testable idea — not a "vision."</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Write down <strong>3 problem spaces</strong> you have real exposure to (your major, your part-time job, hobbies, things your family complains about). For each, write: what's the problem, who has it, what do they spend to solve it today.</li>
<li>Apply the <strong>"niche test"</strong> to each: can you name 3 specific people who would pay for a solution today? If not, the niche is too fuzzy.</li>
<li>Pick <strong>one</strong>. Write a <strong>one-sentence product pitch</strong> in this format: <em>"&lt;tool&gt; for &lt;specific buyer&gt; that &lt;specific outcome&gt; — unlike &lt;existing thing&gt; which &lt;doesn't do X&gt;."</em> Example: "Voice-AI receptionist for US solo plumbers that answers after-hours calls and books jobs to their calendar — unlike a $30/hr answering service which can't dispatch."</li>
<li>Write your <strong>ICP statement</strong>: 1 paragraph defining your ideal customer's role, company size, annual budget for this problem, and where they spend time online.</li>
</ol>
<p><strong>What to submit:</strong> Your 3 problem-space briefs + niche-test analysis + final pitch + ICP statement, as a single doc (text or upload).</p>
<p><strong>Why this matters:</strong> Every class from here on builds on this idea. Pick wrong now and the rest of the course is wasted motion. Pick a specific-enough niche and the rest is mostly execution.</p>`,
            content: `<h2>How to Spot a Real Opportunity</h2>

<h3>The Fake Idea Trap</h3>
<p>Most first-time founders start with an idea like: "I want to build an AI that helps students study." That's a fake idea. It fails the niche test because you can't name three specific people willing to pay for it <em>today</em>. "Students" is a category, not a buyer.</p>
<p>Real ideas sound like: "An AI that helps pre-med sophomores at UC Berkeley turn their organic chemistry lecture recordings into spaced-repetition Anki decks, for $9/mo." Now you can find 10 of those students and show them the prototype tomorrow.</p>

<h3>The Niche Test (5 Minutes)</h3>
<p>For any idea, answer three questions. If any is a no, kill or sharpen.</p>
<ol>
<li><strong>Can you name 3 specific people who'd pay for this today?</strong> Not "dentists in general" — actual three people you could DM or email this week.</li>
<li><strong>Do they currently spend money solving this problem?</strong> If nobody's paying for anything to solve it, they won't pay you either. "Budget exists" means the buyer already mentally allocates money here.</li>
<li><strong>Can you reach them without paying for ads?</strong> There should be a subreddit, Discord, LinkedIn community, forum, or list you can infiltrate. If you can't find the watering hole, distribution will kill you.</li>
</ol>

<h3>Two Idea Archetypes That Work</h3>
<h4>AI-Enhanced (improve a boring business)</h4>
<p>Take an existing workflow (SEO content, receptionist, photo editing, bookkeeping) and use AI to do it 10x faster/cheaper/better. The buyer already spends money on this category.</p>
<p>Examples: HeadshotPro (headshots), Boring Marketing (SEO), Rosie (phone calls), Bannerbear (image generation).</p>

<h4>AI-Native (only possible with AI)</h4>
<p>Products that couldn't exist before LLMs. The buyer is usually discovering the capability for the first time.</p>
<p>Examples: PhotoAI (generate self into any scene), ElevenLabs (clone your own voice), HeyGen (avatar videos).</p>
<p>AI-enhanced wins faster because budget already exists. AI-native wins bigger but takes longer to find the paying buyer.</p>

<h3>Where Ideas Actually Come From</h3>
<ul>
<li><strong>Your own annoyances</strong> (highest signal). Three hours of real pain beats three months of "market research."</li>
<li><strong>Your part-time or internship work.</strong> You see the unautomated workflows that whoever hires you will pay to automate.</li>
<li><strong>Your parents' or siblings' industries.</strong> Dentists, landscapers, accountants — every small-business owner has a list of things they hate doing. Ask.</li>
<li><strong>Reddit/Discord complaints.</strong> Search niche subreddits for "I wish there was a tool that…" or "tired of manually…" — actual sentences in the wild beat ideation.</li>
<li><strong>Acquisition channels nobody else can access.</strong> If you have an audience or network nobody else does, build for them.</li>
</ul>

<h3>Bad Places to Find Ideas</h3>
<ul>
<li>Y Combinator's Request for Startups — too many people chasing the same list.</li>
<li>"AI for consumers" categories where you need 100k MAU to charge anything.</li>
<li>Broad markets like "education" or "health" where the buyer is unclear (patient? doctor? insurer? school?).</li>
<li>"What if AI could replace Salesforce" — incumbents with $100B+ market caps are not going to lose to a college student.</li>
</ul>

<h3>SaaS vs. Agency vs. Productized Service</h3>
<p>Three ways to make the same money with the same idea:</p>
<table>
<tr><th></th><th>SaaS</th><th>Agency</th><th>Productized Service</th></tr>
<tr><td>Price</td><td>$20–200/mo recurring</td><td>$5–20k/mo retainer</td><td>$29–500 one-time</td></tr>
<tr><td>Customers to $10k/mo</td><td>50–500</td><td>1–2</td><td>20–350</td></tr>
<tr><td>Sales effort</td><td>Low per-customer</td><td>Very high per-customer</td><td>Medium</td></tr>
<tr><td>Fastest path to $1M ARR</td><td>18–36 months</td><td>6–12 months</td><td>12–24 months</td></tr>
</table>
<p>For a college student without an audience yet, <strong>productized service</strong> is often the fastest path. Fixed scope (e.g. "we generate 20 AI headshots for $29"), pay-per-delivery, no recurring support.</p>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>Live niche-test round on ideas the class brings</li>
<li>"Three-people exercise": name 3 buyers for each idea out loud</li>
<li>Mining ideas from your own life — structured exercise</li>
<li>SaaS / agency / productized service decision framework</li>
<li>One-sentence pitch template and how to iterate it</li>
<li>The ICP (Ideal Customer Profile) document — why you write it before the product</li>
</ul>`,
          },
          {
            title: "Class 4 — Validate Before You Build",
            slug: "validate-before-you-build",
            order: 1,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 2, Class 4</h3>
<p><strong>Goal:</strong> Talk to 5 real potential customers before writing a single line of code.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Using the ICP from Class 3, identify <strong>15 real people</strong> who match. Find them on LinkedIn, X, Reddit, or Discord. Save their name + where you found them in a spreadsheet.</li>
<li>DM / email at least 10 of them a short, specific message offering a <strong>15-minute chat</strong>. No pitch — you're learning, not selling. Use this template: <em>"Hi [name] — I'm a college student studying how [their role] currently handles [specific workflow]. Would you be open to a 15-min call this week? Happy to share what I learn back with you."</em></li>
<li>Conduct <strong>5 interviews</strong>. Use the Mom Test framework: ask about their past behavior (not hypothetical future behavior), ask about specific pain moments, ask what they currently spend.</li>
<li>Write a <strong>pattern analysis doc</strong>: what did all 5 say the same way? What contradicted between them? Does the problem you assumed actually exist, or does something different exist?</li>
</ol>
<p><strong>What to submit:</strong> Your outreach spreadsheet (with reply rate), notes from the 5 calls, and the pattern-analysis doc. Screenshot or paste.</p>
<p><strong>Why this matters:</strong> Every founder I know who failed, built first and talked later. Every founder who succeeded did it the other way. This homework is the single highest-leverage thing you'll do in this course — do not skip it.</p>`,
            content: `<h2>Validate Before You Build</h2>

<h3>The Single Biggest Mistake</h3>
<p>You build for three months. You launch. Nobody buys. You convince yourself the problem is marketing. You burn another three months on ads. Still nobody buys. Five months in, you realize: the thing you built isn't something anyone actually wanted to pay for. You could've found this out on a 15-minute phone call in week one.</p>

<h3>The Mom Test (Essential Read)</h3>
<p>Rob Fitzpatrick wrote a short book called <em>The Mom Test</em>. Three rules:</p>
<ol>
<li><strong>Talk about their life, not your idea.</strong> "Tell me about the last time you [did the thing]" beats "Would you use a product that [does the thing]?" People lie about hypothetical futures. They tell the truth about past behavior.</li>
<li><strong>Ask about specifics in the past, not generics about the future.</strong> "How did you solve this last week?" beats "How do you usually solve this?" Specific past &gt; generic future.</li>
<li><strong>Talk less, listen more.</strong> You're not pitching. You're mining. A good customer interview is 80% them talking.</li>
</ol>

<h3>Questions That Work</h3>
<ul>
<li>"Walk me through the last time you [hit this problem]."</li>
<li>"What's the worst part of your day related to [this area]?"</li>
<li>"How do you solve this today? What do you spend on it?"</li>
<li>"If you had a magic wand, what would be different?"</li>
<li>"Has anyone else on your team dealt with this? Can you intro me?"</li>
</ul>

<h3>Questions That Destroy You</h3>
<ul>
<li>"Would you pay $X/mo for a tool that [does the thing]?" — they'll lie to be polite.</li>
<li>"Do you think this is a good idea?" — doesn't matter what they think, matters what they'll pay for.</li>
<li>"How often would you use this?" — invented number.</li>
</ul>

<h3>How to Get the Interviews</h3>
<p><strong>Cold DM template that works for students:</strong></p>
<blockquote>
<p>Hi [Name] — I'm a college student at [your school] studying how [their role] handles [specific workflow]. Not selling anything — would you be open to a 15-minute chat this week? Happy to share the aggregated insights back with you after I've talked to a dozen people in your role.</p>
</blockquote>
<p>Reply rate on this is ~20-40% if you personalize (reference something from their LinkedIn/X) and DM from a real account with your picture. Send 15 to get 5. Send 30 to get 10. Go wider if you get fewer.</p>

<h3>Who to Interview</h3>
<ul>
<li>People matching your ICP exactly (not adjacent)</li>
<li>People who have already bought something in the category (strongest signal)</li>
<li>NOT your friends, NOT your parents (unless they're your actual target)</li>
<li>NOT other founders giving you "startup advice"</li>
</ul>

<h3>Signals You Have a Real Thing</h3>
<ul>
<li>Multiple interviewees use the <strong>same specific words</strong> to describe the pain</li>
<li>They already spend money (or time-equivalent) on the problem</li>
<li>They lean in and ask when it'll be ready — unprompted</li>
<li>They offer to introduce you to other buyers</li>
<li>They ask "how much will it cost?" before you've said anything about price</li>
</ul>

<h3>Signals You Should Kill the Idea</h3>
<ul>
<li>"Sounds cool!" — polite dismissal, no real pain</li>
<li>"I'd probably use it" — hypothetical future behavior = zero signal</li>
<li>They describe the problem differently each time — you haven't found a real pattern</li>
<li>They say "maybe for someone else" — not them, not today</li>
<li>You can't get 10 people to even take a 15-minute call — the niche doesn't exist online or the framing is wrong</li>
</ul>

<h3>The Landing Page / Waitlist Shortcut</h3>
<p>After 5 good conversations, before building, throw up a one-page landing: the product name, a one-sentence pitch, 3 benefit bullets, an email waitlist, and a "reserve your spot" button. Drive your 5 interviewees + 20 more to it. If &gt;30% of those visitors give you their email — real signal. If &lt;10% — back to interviews.</p>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>The Mom Test — live role-play of a bad interview and a good one</li>
<li>Workshop: write your 5 interview questions, get feedback from the class</li>
<li>Cold DM review: everyone drafts their outreach template, class critiques</li>
<li>How to run a 15-min interview that gets real signal</li>
<li>Spotting lies politely (they want to be nice — you want the truth)</li>
<li>When to pivot the idea vs. when to pivot the framing</li>
</ul>`,
          },
        ],
      },
      {
        title: "Week 3 — Ship the MVP",
        order: 2,
        lessons: [
          {
            title: "Class 5 — Vibe-Coding Your MVP",
            slug: "vibe-code-your-mvp",
            order: 0,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 3, Class 5</h3>
<p><strong>Goal:</strong> Ship a working MVP this week. A real one, on the internet, that solves one specific problem for your ICP.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Define your <strong>MVP scope</strong>: ONE user flow, ONE problem solved, ONE payment integration. No settings page. No profile page. No admin. Cut everything that's not in the critical path.</li>
<li>Build it with Lovable / Cursor / Claude Code (your choice). Timebox: 10 hours of work max. If it's not done in 10 hours, your scope is too big — cut.</li>
<li>Deploy to Vercel (or Lovable's one-click deploy) under a real domain.</li>
<li>Make it work for <strong>one real user</strong> end-to-end: they can land on your page, sign up, use the core feature, and pay (or at least hit the Stripe/Polar test-mode checkout).</li>
<li>Record a <strong>60-second Loom</strong> walking through the flow.</li>
</ol>
<p><strong>What to submit:</strong> The live URL + Loom link + a screenshot of the Stripe/Polar dashboard showing at least one test transaction. Upload or paste.</p>
<p><strong>Why this matters:</strong> A deployed MVP — even with 3 bugs and ugly CSS — beats a pretty Figma mockup every single time. By next class, you'll be showing this to real potential customers.</p>`,
            content: `<h2>Vibe-Coding Your MVP</h2>

<h3>What Vibe Coding Actually Is</h3>
<p>"Vibe coding" = describing what you want to an AI coding tool in plain English, letting it generate the code, then iterating. In 2026, a non-engineer student can ship a working full-stack app in a weekend that would've taken an engineer a month to build from scratch in 2022.</p>
<p>The skill isn't <em>code</em> — it's knowing what to ask for, how to scope it, and how to debug when the AI hallucinates a package that doesn't exist.</p>

<h3>Pick Your Tool</h3>
<h4>Lovable — no code required</h4>
<p>You type: "Build me a SaaS that takes a LinkedIn URL and generates a tailored cover letter using Claude. Authenticated with Supabase. Payment via Polar for $5/cover letter." It generates the whole app, wires the database, the auth, and (if you connect a Polar account) the payment. Click deploy. You have a URL in 10 minutes.</p>
<p><em>Best for:</em> Non-coders, first-time builders, simple CRUD apps.</p>

<h4>Cursor — you write code, AI writes faster</h4>
<p>Traditional IDE, but with Claude built in. Use "Composer" (⌘I) to describe a feature, it edits multiple files, you review the diff. Great when you want control.</p>
<p><em>Best for:</em> Students with basic JavaScript knowledge who want to own the codebase.</p>

<h4>Claude Code — the engineer's engineer</h4>
<p>Terminal-native. You point it at a folder and have a conversation: "Add a /dashboard route with server-rendered user stats." It reads the codebase, edits the files, runs the type-checker, commits. Produces the cleanest code of the three. Requires comfort with CLI.</p>
<p><em>Best for:</em> CS students, anyone shipping more than one product.</p>

<h3>The Scope Rule</h3>
<p>MVP = <strong>M</strong>inimum <strong>V</strong>iable <strong>P</strong>roduct. The word that gets ignored is "minimum."</p>
<p>Cut everything except:</p>
<ul>
<li>One landing page (headline, one bullet list, one button)</li>
<li>One sign-up flow (email + Google, no password reset, no profile)</li>
<li>One core action (the ONE thing the product does)</li>
<li>One payment path (even if it's test-mode)</li>
</ul>
<p>Things to explicitly NOT build in MVP:</p>
<ul>
<li>Admin dashboard</li>
<li>User settings page</li>
<li>Password reset (use magic links)</li>
<li>Analytics dashboards for users</li>
<li>Email notifications</li>
<li>Mobile app</li>
<li>Anything listed in the "Pro" or "Enterprise" tier of your future pricing page</li>
</ul>

<h3>The AI-Usage Pattern</h3>
<p>You'll integrate an LLM (or image/video model) into your product. Rule of thumb: the AI call should happen <strong>server-side</strong>, not in the browser. Reasons: API key safety, rate limiting, cost control.</p>
<p>Minimal working pattern:</p>
<pre><code>// app/api/generate/route.ts
export async function POST(req: Request) {
  const { prompt, userId } = await req.json();

  // 1. Auth check
  // 2. Rate limit (hit your own DB — count calls this month)
  // 3. If paying user, call Anthropic/OpenAI
  // 4. Save result, return to client
}</code></pre>

<h3>Cost Control (Protect Your Wallet)</h3>
<ul>
<li><strong>Billing alerts:</strong> Set a $5 alert on OpenAI/Anthropic within the first hour. A runaway loop can burn $500 overnight.</li>
<li><strong>Per-user caps:</strong> Free tier? 3 calls/user/day, enforced in your DB. Paid? 100/month. Always a hard cap.</li>
<li><strong>Cache aggressively:</strong> If two users ask the exact same thing, return the cached answer. Hash the input.</li>
<li><strong>Use the cheap model for cheap tasks:</strong> Classification/routing can use Haiku ($0.25/MTok). Creative generation uses Sonnet.</li>
</ul>

<h3>Debugging Vibe-Coded Code</h3>
<p>Common traps:</p>
<ul>
<li>AI invents packages that don't exist — always check <code>npm search</code> before installing something the AI suggested.</li>
<li>AI writes &quot;works on my machine&quot; code that breaks in production — always deploy early, deploy often, find breaks fast.</li>
<li>AI uses out-of-date API versions — tell it explicitly: &quot;Use Next.js 15 App Router, not Pages Router. Use Stripe SDK v17.&quot;</li>
<li>AI gets lost in big edits — tell it to make one change at a time, test, then next.</li>
</ul>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>Live build: scope a student's idea, ship it in 30 minutes</li>
<li>The "one-flow MVP" rule — what to cut, what's non-negotiable</li>
<li>Setting up Anthropic/OpenAI billing alerts BEFORE you write the first API call</li>
<li>Common vibe-coding traps and how to prompt around them</li>
<li>Connecting Polar checkout (it's 5 minutes)</li>
<li>Deploying to Vercel from Lovable / Cursor / Claude Code — demo each</li>
</ul>`,
          },
          {
            title: "Class 6 — Design, Landing Page, First Impression",
            slug: "design-landing-page-first-impression",
            order: 1,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 3, Class 6</h3>
<p><strong>Goal:</strong> Your product needs to look competent. Not beautiful — competent. Buyers won't pay if it looks like a college project.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li>Redo your landing page so it has: (a) one-sentence headline, (b) three benefit bullets, (c) one hero image or short looping video of the product, (d) social proof (even a single testimonial from a Class 4 interview — ask permission), (e) clear CTA button, (f) pricing if you have it.</li>
<li>Write <strong>3 versions</strong> of the headline. Show them to 5 people from your ICP. Pick the one with the clearest &quot;oh, I want that&quot; reaction.</li>
<li>Inside the app: consistent colors (pick 2 — one primary, one accent), consistent spacing, one font. Use a Tailwind or Shadcn component library — don't design from scratch.</li>
<li>Add a <strong>favicon and social preview image</strong> (Open Graph image). Tools like <a href="https://og-playground.vercel.app">OG Playground</a> or Framer handle this in minutes.</li>
<li>Run <a href="https://pagespeed.web.dev">PageSpeed Insights</a> on your landing page. Fix anything scoring &lt;80 on mobile performance.</li>
</ol>
<p><strong>What to submit:</strong> Updated live URL + the 3 headline variants + screenshot of the PageSpeed score + 150-word writeup of which headline won and why.</p>
<p><strong>Why this matters:</strong> Your product will be judged in the first 3 seconds. A user who doesn't understand what you do in 3 seconds bounces and never returns.</p>`,
            content: `<h2>Design, Landing Page, First Impression</h2>

<h3>What "Competent" Actually Means</h3>
<p>You don't need to be a designer. You need the user to think: "okay, this is a real product made by someone who cares." That's it. Hitting "competent" is mostly avoiding specific amateur tells:</p>
<ul>
<li>Too many fonts (pick ONE — usually Inter or Geist)</li>
<li>Too many colors (pick TWO — one primary, one accent)</li>
<li>Inconsistent spacing (use Tailwind's scale, don't eyeball)</li>
<li>Cheesy stock photos</li>
<li>Gradient backgrounds on random elements</li>
<li>Emojis as decoration (selectively OK, spam NO)</li>
<li>Default browser blue link color left in place anywhere</li>
</ul>

<h3>The Landing Page Formula (Above the Fold)</h3>
<ol>
<li><strong>Headline</strong> — one sentence, 10-12 words, states the specific outcome for the specific buyer.</li>
<li><strong>Subhead</strong> — one sentence clarifying <em>how</em> or <em>for whom</em>.</li>
<li><strong>Hero visual</strong> — screenshot, 15-sec Loom, or looping gif of the product doing its thing. NOT a stock illustration.</li>
<li><strong>CTA button</strong> — specific verb. "Start a headshot" beats "Get started." "Generate my cover letter" beats "Sign up."</li>
<li><strong>Social proof</strong> — even one real customer quote with a real photo + name + company. Don't fake this. Ever.</li>
</ol>

<h3>Headline Patterns That Work</h3>
<ul>
<li><strong>Outcome-focused:</strong> "Get studio-quality headshots without a photographer." (HeadshotPro)</li>
<li><strong>Time savings:</strong> "Ship a SaaS in days, not weeks." (ShipFast)</li>
<li><strong>Specific buyer:</strong> "AI receptionist that books jobs for plumbers 24/7." (Rosie-style)</li>
<li><strong>Pain-avoidance:</strong> "Stop paying $500/headshot for LinkedIn photos."</li>
</ul>

<h3>Headline Anti-Patterns</h3>
<ul>
<li>"AI-powered X" — nobody cares, that's just the implementation</li>
<li>"The future of Y" — instant vague-tech-startup vibe</li>
<li>"Supercharge your Z" — dead cliché since ~2014</li>
<li>"Reimagining the way we do X" — please no</li>
</ul>

<h3>Hero Visual Options</h3>
<table>
<tr><th>Option</th><th>Effort</th><th>Conversion effect</th></tr>
<tr><td>Static screenshot</td><td>Low</td><td>Baseline</td></tr>
<tr><td>Annotated screenshot</td><td>Low</td><td>+15%</td></tr>
<tr><td>15-sec looping gif of product</td><td>Medium</td><td>+30%</td></tr>
<tr><td>30-sec narrated Loom demo</td><td>Medium</td><td>+50%</td></tr>
<tr><td>Interactive product embed</td><td>High</td><td>+80%+</td></tr>
</table>
<p>Numbers are directional, not scientific — but the pattern (more-motion beats less) is robust across dozens of landing page A/B tests on Indie Hackers and Paddle's benchmarks.</p>

<h3>Design Tools</h3>
<ul>
<li><strong>Shadcn/ui</strong> — free Tailwind components, looks professional by default. Every Cursor/Claude Code generated app should use this.</li>
<li><strong>Tailwind UI</strong> — $299 one-time for polished patterns. Pays off fast.</li>
<li><strong>Vercel's templates gallery</strong> — free, production-quality Next.js starters.</li>
<li><strong>v0.dev</strong> — generate React components from prompts, paste into your app.</li>
<li><strong>Framer</strong> — for just the marketing site, while the app lives in Next.js.</li>
</ul>

<h3>Social Proof Without Customers Yet</h3>
<p>Chicken-and-egg: you need customers to get testimonials, you need testimonials to get customers. Bootstrap:</p>
<ul>
<li>Your 5 Class-4 interviewees — ask if they'll try the MVP free. If they like it, ask for a one-sentence quote + permission to use their name/role.</li>
<li>Offer &quot;first 10 customers free lifetime&quot; in exchange for a testimonial after 2 weeks of use.</li>
<li>Screenshot real usage (anonymized if needed): &quot;10,000 cover letters generated this week&quot; — if it's true.</li>
<li>Logos of companies of your beta users (get permission) — even if each has just one individual user from that company, it signals legitimacy.</li>
<li>Show your X/LinkedIn followers as a proxy of interest.</li>
</ul>

<h3>Pricing Page Patterns</h3>
<p>We'll go deep on pricing in Week 6, but for the MVP landing:</p>
<ul>
<li>3 tiers: Starter / Pro / Team (or Free / Pro / Enterprise)</li>
<li>Middle tier = what you actually want them to buy; make it the visual focus</li>
<li>Annual toggle that shows savings (&quot;2 months free&quot;)</li>
<li>&quot;Most popular&quot; badge on the middle tier</li>
<li>Real prices, not &quot;Contact us&quot; for everything — intimidating to college buyers</li>
</ul>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>Landing page teardown — we critique 3 student pages live</li>
<li>Headline workshop — write 3, vote on winners</li>
<li>Shadcn/ui live demo — from blank page to polished UI in 15 min</li>
<li>Loom hero video — recording, editing, looping</li>
<li>Open Graph images — the thing you forget that makes your link look trash when shared</li>
<li>PageSpeed fixes — image optimization, font loading, what matters for mobile</li>
</ul>`,
          },
        ],
      },
      {
        title: "Week 4 — Launch + First Customers",
        order: 3,
        lessons: [
          {
            title: "Class 7 — Distribution on Social",
            slug: "distribution-on-social",
            order: 0,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 4, Class 7</h3>
<p><strong>Goal:</strong> Start the audience engine. By end of semester you should have 300+ followers who care about your niche.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>X/Twitter:</strong> Post 3 times per day for the next week. Mix: 1 build-in-public update (what you shipped today), 1 teardown/insight from your niche, 1 reply-worthy question to the niche. Reply to 20 accounts daily — not generic, actually useful replies.</li>
<li><strong>LinkedIn (if your niche is B2B):</strong> Post 1 carousel (Canva template) + 3 text posts this week. Comment meaningfully on 10 target-customer posts daily.</li>
<li><strong>Reddit (if applicable):</strong> Pick 2-3 niche subreddits your ICP hangs out in. Build karma for 30 days with helpful comments ONLY — no self-promo yet. Read the rules carefully.</li>
<li><strong>Track it:</strong> Spreadsheet with follower count, engagement rate, and inbound DMs, updated every day. Submit after 7 days.</li>
</ol>
<p><strong>What to submit:</strong> Your platform links (X handle, LinkedIn URL), the tracking spreadsheet, and screenshots of your best 3 posts with their analytics.</p>
<p><strong>Why this matters:</strong> Every single founder from Class 1's case studies built their audience in parallel with their product. The founders who didn't — don't have case studies, because they didn't make it.</p>`,
            content: `<h2>Distribution on Social — X, LinkedIn, Reddit</h2>

<h3>The Honest State of Social in 2026</h3>
<p>Organic reach on most platforms has compressed since 2024. The old &quot;post MRR screenshots and win&quot; playbook is saturated. What breaks through now:</p>
<ul>
<li>A <strong>weird specific angle</strong> — a specific enemy, a specific metric, a specific aesthetic</li>
<li><strong>Consistency over virality</strong> — daily posters win, one-viral-thread people die</li>
<li><strong>Replies &gt; posts</strong> for zero-follower accounts — replies surface to non-followers if they spark engagement</li>
<li><strong>Video and screenshots &gt; text</strong> — pure-text posts lost ~40% reach from 2023 to 2025</li>
</ul>

<h3>X/Twitter Playbook</h3>
<h4>What works</h4>
<ul>
<li>Contrarian takes on AI hype (&quot;I analyzed 50 AI wrapper apps — only 3 were actually useful&quot;)</li>
<li>Screenshots: terminals, dashboards, designs, your actual product</li>
<li>Teardown threads: &quot;I analyzed [X]'s onboarding — here's what I stole&quot;</li>
<li>Short 15-60 second demo videos</li>
<li>Build-in-public with a weird angle (e.g., &quot;Day 14 of building a product for dentists — here's the weirdest thing I learned&quot;)</li>
</ul>
<h4>What's dead</h4>
<ul>
<li>Motivational threads with no data</li>
<li>&quot;I made $3 MRR today&quot; celebration spam</li>
<li>#buildinpublic hashtag stuffing (algo down-weights since the 2025 shift)</li>
<li>Generic AI news commentary</li>
</ul>
<h4>The Reply-Guy Ladder</h4>
<p>Pick 30-50 accounts with 10k-200k followers in your niche. Reply thoughtfully to their posts early (within the first hour). When a verified/large account's post takes off, replies get surfaced to non-followers. This is how 0-follower accounts grow.</p>
<h4>Cadence</h4>
<p>3–5 posts/day + 20–30 replies/day. Yes, it's a lot. That's the job. Realistic timeline to 1,000 followers: 3–5 months of daily work.</p>

<h3>LinkedIn Playbook (for B2B products)</h3>
<p>LinkedIn is the most under-priced attention channel in 2026 because most indie founders think it's cringe.</p>
<ul>
<li><strong>Document/carousel posts</strong> — PDF uploads with 8-12 slides. Still the highest-reach format on LinkedIn in 2026.</li>
<li><strong>Short Loom + post</strong> — 60-second screen recording of the product solving the problem, uploaded natively. Video completion rate is LinkedIn's #1 ranking signal.</li>
<li><strong>Selective DMs, not spray:</strong> after someone likes 2+ of your posts, DM them personally. 15-25% reply rate vs. &lt;1% for cold.</li>
</ul>
<p>Expect 300-800 followers + 3-8 discovery calls/month in 90 days if you post 1 carousel/week + 3 text posts + comment 10x/day on ICP posts.</p>

<h3>Reddit Playbook (for community-native niches)</h3>
<p>Reddit is where the real talk happens for many niches (r/LocalLLaMA, r/SaaS, r/photography, r/smallbusiness, etc.). But most AI tool posts get banned within minutes.</p>
<h4>Rules that keep you alive</h4>
<ul>
<li><strong>90/10 rule:</strong> 90% genuine comments, 10% product mentions</li>
<li>Account age &gt;6 months, karma &gt;500 before any self-promo</li>
<li>Never post a naked link. Post the problem/solution narrative first, link in comments if asked</li>
<li>Framing: &quot;I built this for myself, sharing in case helpful&quot; &gt; &quot;Check out my product&quot;</li>
</ul>
<p>Case: PhotoRoom grew to 10k+ MAU partly via r/photography by answering background-removal questions for 6 months before ever mentioning the product.</p>

<h3>Calibrating Expectations</h3>
<table>
<tr><th>Channel</th><th>3-month follower range</th><th>Realistic inbound (DMs/calls/mo)</th><th>Paying customers</th></tr>
<tr><td>X (daily)</td><td>800-1,500</td><td>5-15</td><td>2-5</td></tr>
<tr><td>LinkedIn (2-3x/wk B2B)</td><td>300-800</td><td>3-8</td><td>1-4</td></tr>
<tr><td>Reddit (genuine)</td><td>N/A</td><td>5-20 per successful post</td><td>2-10 per successful post</td></tr>
</table>
<p>Numbers assume your product is actually good and the niche is real. Garbage product with great marketing still fails — just fails louder.</p>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>Live account teardown of a student who already has a few followers</li>
<li>Writing the bio — the 5-line pitch to strangers</li>
<li>First post workshop — everyone writes one, class critiques</li>
<li>The "reply engine" — how to find 50 accounts worth replying to</li>
<li>LinkedIn carousel anatomy with a live rebuild</li>
<li>Reddit survival — how to be the helpful person nobody bans</li>
</ul>`,
          },
          {
            title: "Class 8 — Product Hunt, Cold Outreach, SEO",
            slug: "producthunt-coldoutreach-seo",
            order: 1,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 4, Class 8</h3>
<p><strong>Goal:</strong> Actively push for your first 10 customers. Three lanes in parallel.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>Cold outreach (25 contacts):</strong> Using Apollo free trial or LinkedIn Sales Navigator free week, find 25 people matching your ICP. Send a 3-sentence personalized DM/email: what they do, why it reminded you of what you're building, soft CTA. Track reply rate.</li>
<li><strong>Product Hunt prep:</strong> Set your launch date (target: 2 weeks out). Build a &quot;launch list&quot; by asking 50 followers/friends to sign up on Product Hunt and upvote. DM a top hunter (Chris Messina, Kevin William David, etc.) — 10% of cold DMs get a response.</li>
<li><strong>SEO foundation:</strong> Build <strong>5 comparison pages</strong> (&quot;[Competitor] vs [Yours]&quot; and &quot;Best [category] alternatives&quot;). Use Ahrefs free tools to find the keywords. Publish to your domain with proper meta tags.</li>
</ol>
<p><strong>What to submit:</strong> (a) Cold outreach spreadsheet with contacts + replies + conversion, (b) Product Hunt launch plan doc + tease post screenshots, (c) URLs of the 5 comparison pages. Plus 200 words reflecting on which channel is generating the best response so far.</p>
<p><strong>Why this matters:</strong> Social builds over months; these three levers can get you paying customers this week.</p>`,
            content: `<h2>Product Hunt, Cold Outreach, SEO</h2>
<p>Three distribution lanes that can actually deliver paying customers in weeks — not months of building audience.</p>

<h3>Product Hunt — Is It Still Worth It in 2026?</h3>
<p><strong>Yes for developer/AI/productivity tools, no for consumer social/content apps.</strong> Traffic is ~40% lower than 2022 peak but it's still the best single-day launch event for indie tools.</p>
<h4>4-week prep checklist</h4>
<ol>
<li>Build a <strong>200+ person launch list</strong> from your existing X/LinkedIn followers, waitlist, and personal network. Ask them: &quot;Are you cool with me pinging you the morning we launch?&quot;</li>
<li>Get a <strong>top-tier hunter</strong> — cold DM Chris Messina, Kevin William David, Ryan Hoover with a product demo video. ~10% response rate. Not essential but helps.</li>
<li>Tease on X and LinkedIn daily the 7 days before: &quot;launching Tuesday,&quot; sneak peek screenshots, &quot;here's what I'm nervous about&quot;.</li>
<li><strong>Launch Tuesday or Wednesday at 12:01 AM PT</strong>. Weekends dead, Monday crowded.</li>
<li>Respond to every comment in the first 6 hours within 15 minutes.</li>
<li>Have 3-5 friendly makers/founders ready to comment substantively — not just &quot;congrats&quot; but actually-useful critique or questions.</li>
</ol>
<h4>Realistic outcome for #1 of the Day in 2026</h4>
<ul>
<li>3,000-8,000 site visits that day</li>
<li>400-1,200 signups</li>
<li>20-80 paying customers (if your free-to-paid funnel is decent)</li>
<li>$2k-$15k in one-time revenue bump</li>
<li>Long tail: ~10-20% of PH traffic trickles in for months via SEO</li>
</ul>

<h3>Cold Outreach — First 100 Customers Without an Audience</h3>
<h4>Why it still works in 2026</h4>
<p>If your product solves a real pain for a reachable buyer, and you can write a 3-sentence message that isn't spam, cold outreach works. What changed: deliverability is brutal now.</p>
<h4>The 2026 deliverability stack (~$100/mo)</h4>
<ul>
<li><strong>Dedicated sending domain</strong> (not your main .com — buy a variant for ~$10)</li>
<li>SPF / DKIM / DMARC configured</li>
<li>Warm up 2-3 weeks via Instantly.ai or Smartlead</li>
<li>Max 20-30 emails/day per inbox. Use 3-5 inboxes if you want volume</li>
<li>&lt;3% bounce rate, &lt;0.1% complaint rate — or you're toast</li>
</ul>
<h4>Tool stack</h4>
<ul>
<li><strong>Apollo.io</strong> — $49/mo starter for leads</li>
<li><strong>Instantly.ai</strong> — $37/mo for sending + warmup</li>
<li><strong>Clay.com</strong> (if budget) — AI-powered personalization at scale</li>
</ul>
<h4>Sequence that works</h4>
<ol>
<li><strong>Day 1:</strong> 3 sentences max. Specific pain. Soft CTA (&quot;worth a quick look?&quot;).</li>
<li><strong>Day 4:</strong> Case study or data point. Same CTA.</li>
<li><strong>Day 8:</strong> Breakup email (&quot;closing the loop here — let me know if timing's off&quot;).</li>
</ol>
<h4>Personalization note</h4>
<p>First-line AI personalization is now pattern-matched and ignored. What works: actually reference something from their last LinkedIn post or company announcement. Clay + Claude API lets you do this at scale.</p>
<h4>Realistic conversion</h4>
<p>500 emails → 30-50% open → 3-8% reply → 1-3% meeting booked → 5-15 meetings → 1-3 customers at mid-market ACV.</p>
<h4>$0 version for students</h4>
<p>Manual LinkedIn DMs and X DMs. 20 personalized DMs/day, ~10-15% reply rate if well-researched. Expected: 2-5 customers/month. No tools required.</p>

<h3>SEO in the Post-ChatGPT World</h3>
<h4>What's dead</h4>
<ul>
<li>Traditional &quot;what is X&quot; informational content — AI Overviews and ChatGPT search ate those clicks. Search volume for how-to queries dropped 30-50% in 2024-25.</li>
<li>AI-generated content farms — Google's scaled content abuse policy (Mar 2024, tightened 2025) deindexes them.</li>
<li>Generic listicles (&quot;10 best X tools&quot;).</li>
</ul>
<h4>What still ranks and converts</h4>
<ol>
<li><strong>Comparison / alternative pages:</strong> &quot;X vs Y,&quot; &quot;best X for Y,&quot; &quot;X alternatives.&quot; AI Overviews are worse at opinion/biased content, so these still get clicks.</li>
<li><strong>Tool pages / free calculators:</strong> People need the actual tool, not just an answer.</li>
<li><strong>Programmatic SEO with real data (not AI slop):</strong> pgSEO works if each page has unique data (scraped, user-gen, or computed). Pure AI pgSEO gets deindexed.</li>
</ol>
<h4>Working 2026 examples</h4>
<ul>
<li>Clay.com — programmatic pages for every &quot;persona + tool&quot; combo, each with real company data</li>
<li>Beehiiv — comparison pages vs. Substack/Mailchimp drive a ton of organic trial signups</li>
<li>Tally.so — free tool pages ranking for &quot;form builder&quot; long-tail</li>
</ul>
<h4>$0-100 SEO for a student</h4>
<p>Build 20-50 comparison/alternative pages manually for YOUR product vs. competitors. Use Ahrefs free tools + Google Search Console. Timeline: 4-6 months to rank, then 200-2,000 organic visits/month depending on niche.</p>

<h3>The Week-by-Week First 100 Customers Playbook</h3>
<table>
<tr><th>Weeks</th><th>Focus</th><th>Target</th></tr>
<tr><td>1-2</td><td>Foundation: ICP, profiles, comparison pages</td><td>Page live, bio set</td></tr>
<tr><td>3-4</td><td>Content engine: 3 posts/day on X, 1 carousel/wk LinkedIn, replies</td><td>100 X followers, 50 LinkedIn</td></tr>
<tr><td>5-6</td><td>Manual DM outreach — LinkedIn + X — 20/day personalized</td><td>3-5 paying customers</td></tr>
<tr><td>7-8</td><td>Subreddit genuine posts + micro-creator seeding</td><td>10-20 more customers</td></tr>
<tr><td>9-10</td><td>Product Hunt launch prep</td><td>300+ launch list</td></tr>
<tr><td>11</td><td>Product Hunt launch day</td><td>Top 5, 30-60 customers</td></tr>
<tr><td>12</td><td>Convert PH leads, ask for referrals, publish case studies</td><td>100 total paying customers</td></tr>
</table>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>Product Hunt launch anatomy — a real one played back in slow motion</li>
<li>Cold DM workshop — everyone writes one, class roasts it</li>
<li>Comparison-page structure — the formula that ranks</li>
<li>How to pick 10 keywords you can actually win on</li>
<li>The 100-customer roadmap broken into 12 concrete weeks</li>
</ul>`,
          },
        ],
      },
      {
        title: "Week 5 — Automate + Scale",
        order: 4,
        lessons: [
          {
            title: "Class 9 — The Automation Stack",
            slug: "automation-stack",
            order: 0,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 5, Class 9</h3>
<p><strong>Goal:</strong> Automate 2 recurring tasks so you can scale to your first 100 customers solo.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>Pick 2 real workflows</strong> that currently steal your time weekly. Examples: new-signup welcome sequence, customer support triage, daily content posting, weekly metrics report.</li>
<li>Implement <strong>one in n8n</strong> and <strong>one as a Claude Code routine</strong> (or just both in n8n if you don't know code).</li>
<li>Add <strong>LLM calls</strong> to at least one of them — e.g., Claude summarizes new feedback, classifies support tickets, or generates personalized welcome email variants.</li>
<li>Set up <strong>monitoring</strong>: Slack or email alert when the workflow fails.</li>
<li>Record a <strong>Loom walkthrough</strong> of each.</li>
</ol>
<p><strong>What to submit:</strong> Both Loom URLs + text description of what each automation replaces (and how many hours/week it saves you).</p>
<p><strong>Why this matters:</strong> Solo founders don't beat teams by being faster humans — they beat teams by making sure humans do less. Every hour you automate is an hour you can spend on growth.</p>`,
            content: `<h2>The Automation Stack</h2>

<h3>Why This Matters at 10 Customers, Not 100</h3>
<p>Most founders wait until they're drowning to automate. Wrong move. Every week you don't automate is a week of human toil compounding. Start at customer #5, not #500.</p>

<h3>The Two Good Tools for 2026</h3>
<h4>n8n — visual automation</h4>
<ul>
<li>Self-hosted free, or Cloud at $24/mo Starter.</li>
<li>500+ integrations (Stripe, Slack, Airtable, Google Sheets, every major CRM).</li>
<li>Native AI agent nodes — hook Claude/GPT into any step.</li>
<li>Great for non-engineers. You draw the flow.</li>
<li>Gotcha: self-hosting = $5 VPS + a weekend of learning Docker. Cloud just works.</li>
</ul>

<h4>Claude Code subagents + MCP — code-native automation</h4>
<ul>
<li>Essentially free if you already have Claude Pro.</li>
<li>Write automations as prompts + tools. Run on cron.</li>
<li>Tons more flexibility than n8n for weird custom logic.</li>
<li>Gotcha: no visual monitoring — you roll your own observability. Add Slack/email alerts on failure.</li>
</ul>

<h3>Automations Every Solo Founder Should Run</h3>
<h4>1. Welcome sequence with AI personalization</h4>
<ul>
<li>New user signs up (Supabase webhook → n8n)</li>
<li>Claude generates personalized email based on their stated use case</li>
<li>Resend sends it</li>
<li>5 days later: check-in email if they haven't completed onboarding</li>
</ul>

<h4>2. Support ticket triage</h4>
<ul>
<li>Email lands in support@yourdomain → n8n</li>
<li>Claude classifies: bug / feature request / billing / other</li>
<li>Routes to right place (GitHub issue / Linear / your inbox)</li>
<li>If "billing," auto-reply with Stripe customer portal link</li>
</ul>

<h4>3. Content engine</h4>
<ul>
<li>Every day 8am: n8n pulls your recent customer feedback</li>
<li>Claude identifies the most-mentioned pain point</li>
<li>Generates 3 X post ideas based on it</li>
<li>Drops into a Google Doc you review in 5 minutes and post</li>
</ul>

<h4>4. Weekly metrics report</h4>
<ul>
<li>Cron job Monday morning: pulls Stripe MRR, PostHog DAU, support ticket count</li>
<li>Claude writes a 5-bullet summary with week-over-week trends</li>
<li>Posts to Slack / sends to your email</li>
</ul>

<h4>5. Cold-outreach enrichment</h4>
<ul>
<li>Row added to Airtable with a prospect</li>
<li>n8n looks up their LinkedIn via Clay/Apollo</li>
<li>Claude drafts a personalized first-line DM</li>
<li>You review, edit, send</li>
</ul>

<h3>AI Agents (When to Use Them)</h3>
<p>Agents = LLMs that loop until they've completed a goal, autonomously. Hot in 2025-26 but overkill for most solo-founder automations. Use single-shot LLM calls for 90% of workflows. Agents earn their keep for:</p>
<ul>
<li>Research tasks ("find all competitors in [niche] and summarize their pricing")</li>
<li>Complex troubleshooting where you want the LLM to try, check, try again</li>
<li>Customer support where context needs to be gathered across tools</li>
</ul>
<p>Claude Code with MCP tool access is the current best agent platform for this. Cost control: hard cap max iterations per run.</p>

<h3>Monitoring &amp; Failure Modes</h3>
<p>Automations break. Plan for it.</p>
<ul>
<li><strong>Always alert on failure</strong> — email or Slack webhook on any caught exception</li>
<li><strong>Log everything</strong> — PostHog or just a Supabase table of events</li>
<li><strong>Build in a human-in-the-loop for high-risk steps</strong> (anything that sends customer-facing content unsupervised)</li>
<li><strong>Rate limit your AI calls</strong> — same rule as Week 3. A loop bug can burn $500 in an hour</li>
<li><strong>Test in dry-run mode first</strong> before flipping to live</li>
</ul>

<h3>The "Virtual Ops Team" Pattern</h3>
<p>Think of each automation as a virtual team member:</p>
<ul>
<li>Virtual SDR — qualifies inbound leads</li>
<li>Virtual CSM — onboards new users, checks in weekly</li>
<li>Virtual Support — triages tickets, auto-answers FAQ</li>
<li>Virtual Marketer — drafts social posts, compiles weekly content</li>
<li>Virtual Analyst — sends the weekly metrics summary</li>
</ul>
<p>Solo founders with $100k MRR typically have 5-10 virtual team members like this running 24/7.</p>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>Live build: welcome-sequence automation from scratch in n8n</li>
<li>Claude Code routine — same automation, code-native version</li>
<li>Decision framework: n8n vs. Claude Code vs. just Stripe webhooks</li>
<li>How to add monitoring in 10 minutes</li>
<li>Cost-control patterns for AI calls inside automations</li>
<li>Virtual team exercise — map your top 3 repetitive tasks to automations</li>
</ul>`,
          },
          {
            title: "Class 10 — Operating Solo at Scale",
            slug: "operating-solo-at-scale",
            order: 1,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 5, Class 10</h3>
<p><strong>Goal:</strong> Set up the operational backbone of a one-person business.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>Customer support channel:</strong> Gmail with labels OR Crisp (free tier). Embed the chat widget on your site. Set up one auto-responder with expected response time.</li>
<li><strong>SOP document:</strong> Write a <strong>single runbook</strong> covering: how to handle a billing complaint, how to process a refund, what to do if the product goes down, where to check metrics. Template: step-by-step so Future-You (or a VA you hire) can follow it.</li>
<li><strong>Dashboard:</strong> Build a single page (PostHog dashboard OR a Google Sheet OR your own admin route) showing: MRR, active users this week, signups this week, top 3 most-used features. Check it daily.</li>
<li><strong>&quot;Office hours&quot;:</strong> Schedule a recurring 30-min weekly call slot on Cal.com and link from your product. Let customers book a live call — even if zero book it, you're signaling quality.</li>
</ol>
<p><strong>What to submit:</strong> (a) Screenshot of your support setup, (b) your SOP doc, (c) link or screenshot of your dashboard, (d) Cal.com booking URL.</p>
<p><strong>Why this matters:</strong> Founders who don't have this die when they hit 50 customers. Every ticket becomes a fire. Every new bug is chaos. Get your ops cockpit before you need it.</p>`,
            content: `<h2>Operating Solo at Scale</h2>

<h3>The Solo Founder's Limit</h3>
<p>The wall most solo founders hit: ~50–80 customers, $3k–$10k MRR. At that scale, if you don't have ops, every day is firefighting. The founders who break through aren't working harder — they have operational systems the drowning ones don't.</p>

<h3>Customer Support as a Solo</h3>
<table>
<tr><th>Tool</th><th>Cost</th><th>Good up to</th></tr>
<tr><td>Just Gmail + labels</td><td>Free</td><td>~50 customers</td></tr>
<tr><td>Crisp (crisp.chat)</td><td>Free tier → $25/mo</td><td>~500 customers</td></tr>
<tr><td>Help Scout (helpscout.com)</td><td>$22/mo</td><td>1–5k customers</td></tr>
<tr><td>Plain (plain.com)</td><td>$35/mo</td><td>Modern, API-first</td></tr>
<tr><td>Discord community</td><td>Free</td><td>Infinite for dev tools / creator tools</td></tr>
</table>
<p><strong>Solo playbook:</strong> Start with support@yourdomain.com forwarding to Gmail. Add Crisp widget on site at ~20 paying users. Move to Help Scout when email volume is 30+/day. Discord for community-driven products.</p>

<h3>The AI Support Layer</h3>
<p>Before a customer ticket hits you, layer an AI responder:</p>
<ul>
<li>Crisp has a &quot;MagicReply&quot; AI feature trained on your docs</li>
<li>Claude-backed custom widget hooked to your FAQ / doc site</li>
<li>Fin (Intercom) for the bigger ticket budgets</li>
</ul>
<p>Target: AI resolves 30–50% of tickets without you seeing them. The rest escalate with context already gathered.</p>

<h3>SOPs — Write Them Before You Need Them</h3>
<p>Every recurring task gets a written standard operating procedure (SOP). Why: (a) so Future-You isn't re-solving the same problem, (b) so you can hand it to a VA ($5/hr on Upwork/Fiverr) when it's time.</p>
<h4>SOPs every solo founder should have</h4>
<ul>
<li>How to process a refund (step-by-step Stripe dashboard actions)</li>
<li>How to handle a billing dispute / chargeback</li>
<li>What to do if the site goes down (check Vercel / Supabase / your DNS, post status)</li>
<li>How to respond to &quot;cancel my subscription&quot; (template message + offer a discount first)</li>
<li>How to run the weekly metrics review</li>
<li>Your onboarding email sequence — written out as a single source of truth</li>
<li>How to handle a partnership inquiry (templates, qualifying questions)</li>
</ul>
<p>One Notion doc. Update it as you encounter new situations.</p>

<h3>Metrics Dashboard</h3>
<p>The 5 numbers to watch daily, nothing more:</p>
<ol>
<li><strong>MRR</strong> (and the delta since yesterday — Stripe + Polar dashboards or a custom view)</li>
<li><strong>Active paying customers</strong> this week</li>
<li><strong>New signups</strong> (yesterday, 7-day avg)</li>
<li><strong>Churn</strong> (cancellations in last 30 days / starting MRR)</li>
<li><strong>Top 3 most-used features</strong> (PostHog event counts)</li>
</ol>
<p>Don't build vanity dashboards. Don't obsess over DAU/MAU unless you're consumer. MRR, signups, churn, usage — that's it.</p>

<h3>Tools for the Dashboard</h3>
<ul>
<li><strong>PostHog Insights</strong> (free) — auto-pulls Stripe if connected</li>
<li><strong>Baremetrics / ChartMogul</strong> — $50/mo, prettier, more investor-friendly</li>
<li><strong>Just a Google Sheet</strong> with API pulls from Stripe — free and fine for under $50k MRR</li>
<li><strong>Custom /admin page in your own app</strong> — read-only view, auth-gated to your user</li>
</ul>

<h3>Office Hours &amp; Direct Access</h3>
<p>Set up a weekly Cal.com slot (30 min, 4 bookings/week). Link from your product's footer: &quot;Talk to the founder.&quot; Usually nobody books it — but the ones who do are your highest-leverage conversations. Bug reports &gt; any survey. Feature requests &gt; any roadmap exercise.</p>

<h3>Community as a Support Surface</h3>
<p>Once you have ~50 customers, start a Discord or Slack. Benefits:</p>
<ul>
<li>Customers answer each other's questions — you're not the only support channel</li>
<li>Free product feedback channel</li>
<li>Retention tool — people feel ownership and churn less</li>
<li>Recruiting channel for early evangelists and case studies</li>
</ul>
<p>Seed it with your 10 most engaged users. Don't open it to everyone on day one — low density of users kills communities.</p>

<h3>Dealing with Incidents</h3>
<p>When something breaks (and it will):</p>
<ol>
<li>Acknowledge within minutes on X and via a status update page (Instatus or Statuspage — free)</li>
<li>Keep people posted every 30 min even if you have no update</li>
<li>Post a public post-mortem within 24-48 hours: what happened, why, what you changed</li>
</ol>
<p>Honest transparency about incidents earns more trust than perfect uptime would've.</p>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>Set up Crisp chat + AI responder live in 15 min</li>
<li>SOP writing template — we write one as a class</li>
<li>Dashboard build — 5-metric PostHog view from scratch</li>
<li>Cal.com office hours setup</li>
<li>Status page + incident playbook</li>
<li>When to hire your first VA / fractional support person</li>
</ul>`,
          },
        ],
      },
      {
        title: "Week 6 — Money + Longevity",
        order: 5,
        lessons: [
          {
            title: "Class 11 — Legal, Taxes, Payments",
            slug: "legal-taxes-payments",
            order: 0,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Week 6, Class 11</h3>
<p><strong>Goal:</strong> Set up the money and legal rails so revenue flows to you cleanly and taxes don't blindside you.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>Decide on entity setup.</strong> At $0 revenue, sole prop is fine. If you're past $10k/yr or signing B2B contracts, form a Wyoming LLC directly with the state (~$160 + $185/yr) OR via Stripe Atlas if you want bank/EIN bundled. Document your decision in 1 paragraph.</li>
<li><strong>Open a business bank account.</strong> Mercury or Relay. Or (sole prop, $0 revenue) a separate personal checking account you use ONLY for business. Never mix.</li>
<li><strong>Set up the 30% rule.</strong> Create a separate savings account. Configure Mercury/Relay auto-rules to move 30% of every Stripe/Polar deposit into it. That's your tax reserve. Do NOT touch.</li>
<li><strong>Generate legal docs</strong> via Termly or iubenda: Privacy Policy, Terms of Service, Refund Policy. Publish to your site's footer.</li>
<li><strong>AI data disclosure:</strong> If your product sends user data to Claude/GPT, add a paragraph to your privacy policy stating which providers you use and linking their policies.</li>
<li><strong>International students only:</strong> Document your visa situation. If F-1, consult your DSO before taking ACTIVE income. Consider passive ownership (contractor runs ops), OPT path, or parent-owned entity.</li>
</ol>
<p><strong>What to submit:</strong> (a) 1-paragraph entity decision, (b) screenshot of business account, (c) screenshot of 30% auto-rule, (d) URLs of your published legal docs. Do NOT submit any actual legal/tax IDs — just proof-of-setup.</p>
<p><strong>Why this matters:</strong> The difference between a hobby and a business is that a business has a P&amp;L and pays taxes. Most founders who hit $50k revenue and then owe $15k in taxes on April 15 wish they'd done this earlier.</p>`,
            content: `<h2>Legal, Taxes, Payments — The Operator's Basics</h2>
<p><em>This is what founders commonly do in 2026. It's not legal or tax advice — a CPA or attorney is $500-1000 well spent once you cross $40k/yr.</em></p>

<h3>Entity Setup</h3>
<p><strong>At $0 revenue?</strong> You're a sole proprietor by default. Your SSN is your tax ID. Report income on Schedule C of your 1040. Done.</p>

<p><strong>When an LLC starts mattering:</strong></p>
<ul>
<li>Real revenue (~$10k+/yr) and you want liability separation</li>
<li>Signing contracts with companies that require an entity</li>
<li>Taking payments from platforms that require an EIN</li>
<li>Bringing on a cofounder or investor</li>
</ul>

<h4>How to form an LLC in a day (2026 prices)</h4>
<ul>
<li><strong>Directly with a state</strong> (cheapest): Wyoming ($100 + $60/yr), Delaware ($90 + $300/yr franchise tax). Use the state's online portal.</li>
<li><strong>Stripe Atlas</strong> — $500 one-time. Delaware C-corp or LLC. Includes EIN, bank (Mercury/Stripe Treasury), templates. Best if you might raise VC.</li>
<li><strong>Clerky</strong> — $99-$799. Lawyer-grade templates; preferred by YC-track startups.</li>
<li><strong>Northwest Registered Agent</strong> — $125/yr. Cleanest for just registered agent service.</li>
</ul>
<p><strong>Rule of thumb for bootstrapping AI SaaS:</strong> Wyoming LLC direct + Mercury account = ~$160 to start, ~$185/yr to maintain.</p>

<h3>International Students (F-1)</h3>
<p><strong>Hard rule:</strong> F-1 students cannot <em>actively work for</em> their own US business without authorization. &quot;Active work&quot; = coding, sales, support.</p>
<p><strong>What's allowed:</strong></p>
<ul>
<li><strong>Passive ownership</strong> of a US LLC/C-corp</li>
<li><strong>OPT</strong> (12 months post-graduation, +24 for STEM) — self-employ in your field</li>
<li><strong>On-campus work</strong> through your school</li>
</ul>
<p><strong>What founders commonly do:</strong> Form the LLC, stay passive, hire contractors (US citizens or offshore via Deel/Upwork) to do the active work. Own + strategize, don't operate. Or wait for OPT and then go full-time.</p>
<p><strong>Talk to your school's DSO and an immigration attorney before any of this.</strong> Visa violations have severe consequences.</p>

<h3>Taxes — What You'll Actually Owe</h3>
<p>Self-employment tax is the big surprise: <strong>15.3%</strong> on net profit (12.4% SS + 2.9% Medicare), <em>on top of</em> federal + state income tax.</p>
<p><strong>Structure ladder:</strong></p>
<table>
<tr><th>Net profit</th><th>Structure</th><th>Why</th></tr>
<tr><td>$0-$40k</td><td>Sole prop or single-member LLC</td><td>Same tax, Schedule C</td></tr>
<tr><td>$40k-$80k</td><td>Single-member LLC</td><td>Liability separation, still Sched C</td></tr>
<tr><td>$80k+</td><td>S-corp election</td><td>Save ~$4-6k/yr on SE tax after costs</td></tr>
</table>

<p><strong>S-corp break-even</strong> is typically ~$60-80k net profit because S-corps require: payroll ($40-80/mo Gusto), separate 1120-S return ($800-1500 to prepare), &quot;reasonable salary&quot; (IRS wants ~40-60% of profit as W-2).</p>

<p><strong>Quarterly estimated taxes:</strong> Due April 15, June 15, Sept 15, Jan 15. Pay via IRS Direct Pay. Miss them and you'll owe penalties.</p>

<h3>Payments — MoR vs. Not</h3>
<p><strong>Merchant of Record (MoR)</strong> = the provider is the legal seller, handles sales tax / VAT / chargebacks globally. You get a royalty.</p>

<table>
<tr><th>Provider</th><th>MoR?</th><th>Fees</th><th>Notes</th></tr>
<tr><td>Stripe</td><td>No</td><td>2.9% + 30¢</td><td>Cheapest, but YOU owe sales tax per state. Stripe Tax add-on 0.5%.</td></tr>
<tr><td>Paddle</td><td>Yes</td><td>~5% + 50¢</td><td>Full MoR, handles global VAT/GST. Best for SaaS.</td></tr>
<tr><td>Lemon Squeezy</td><td>Yes</td><td>5% + 50¢</td><td>Stripe-owned since 2024. Indie-friendly.</td></tr>
<tr><td>Polar</td><td>Yes</td><td>4% + 40¢</td><td>Newer, MoR for digital. Open-source strong.</td></tr>
</table>

<p><strong>2026 reality:</strong> If you're selling internationally or to EU, use an MoR. Solo-founder VAT compliance is not worth the hours. If 95% US B2B, Stripe + Stripe Tax is fine.</p>

<h3>The 30% Rule (Don't Skip This)</h3>
<p>The moment money lands in your business account: <strong>move 25-30% to a separate savings</strong> (Mercury Savings or Ally at ~4-5% APY). That's your tax money. Don't touch.</p>
<p>Mercury and Relay both have auto-rules: &quot;30% of every deposit → savings vault.&quot; Set it up in Day 1. Founders who skip this owe $15k in April and have $0.</p>

<h3>Accounting</h3>
<ul>
<li><strong>Under $50k revenue:</strong> Spreadsheet is fine. Track monthly: revenue, Stripe/Polar fees, API costs (Claude/OpenAI), hosting, software. Save receipts in Google Drive.</li>
<li><strong>$50k-$250k:</strong> Wave (free), QuickBooks Self-Employed ($15/mo), or Xero ($20/mo).</li>
<li><strong>Bookkeeper:</strong> Hire at ~$100k revenue or whenever you're losing &gt;3 hrs/mo to books. $200-500/mo on Upwork, or Bench/Pilot.</li>
<li><strong>CPA:</strong> Once profitable. $500-1500 to file business taxes. Worth every penny.</li>
</ul>

<h3>Legal Docs Without Paying a Lawyer</h3>
<ul>
<li><strong>Termly</strong> (termly.io) — $10-30/mo. Privacy Policy, ToS, Cookie, Refund. Auto-updates with law changes.</li>
<li><strong>iubenda</strong> (iubenda.com) — EU-focused, strong GDPR.</li>
<li><strong>Free templates</strong> — Stripe Atlas / Clerky bundles.</li>
</ul>
<p>Enforceability: Generated policies are enforceable in most consumer cases. Pay a lawyer ($500-1500) if you handle health data, financial data, or kids' data (COPPA).</p>

<h3>AI Data Compliance Minimum</h3>
<p>If your product sends user data to Claude/GPT APIs:</p>
<ul>
<li>In your privacy policy: &quot;We use third-party AI providers (OpenAI, Anthropic) to process your inputs. See their policies at [links].&quot;</li>
<li>Data handling: do you store prompts? How long? Is it used for training? (Claude/GPT API inputs are NOT used for training by default in 2026 — state this clearly.)</li>
<li>For sensitive data (health/financial/kids): explicit consent.</li>
</ul>

<h3>Getting Paid (The Flow)</h3>
<ol>
<li>Customer pays Stripe/Polar → payout to your business bank (2-7 days)</li>
<li>Auto-rule moves 30% to savings</li>
<li>Remaining stays in business account for expenses (hosting, AI APIs, tools)</li>
<li>You transfer to personal as &quot;owner's draw&quot; (sole prop / LLC) or W-2 + distributions (S-corp)</li>
</ol>

<h3>What We'll Cover (90 min)</h3>
<ul>
<li>Wyoming LLC setup walkthrough</li>
<li>Mercury account + 30% auto-rule config live</li>
<li>Stripe vs. Polar — which to pick based on where customers are</li>
<li>Termly privacy + terms workflow</li>
<li>The S-corp math: when it saves you money, when it doesn't</li>
<li>International-student questions (we won't answer them authoritatively — just point at the right resources)</li>
</ul>`,
          },
          {
            title: "Class 12 — Pricing, Scaling, 90-Day Plan",
            slug: "pricing-scaling-90-day-plan",
            order: 1,
            duration: 90,
            projectEnabled: true,
            projectInstructions: `<h3>Homework — Final Project</h3>
<p><strong>Goal:</strong> Walk out of this course with a concrete plan for the next 90 days AND public accountability.</p>
<p><strong>Tasks:</strong></p>
<ol>
<li><strong>Pricing:</strong> Set your real pricing. Three tiers minimum. Write a 200-word justification for why these numbers (value-based, not cost-plus). Include the &quot;double your price&quot; stress test — would you be willing to 2x your middle tier?</li>
<li><strong>90-day plan:</strong> Document covering: (a) MRR target at day 30/60/90, (b) 3 distribution experiments you'll run each month, (c) 1 product experiment per month, (d) budget (what you'll spend on tools + ads).</li>
<li><strong>Accountability post:</strong> Publish on X or LinkedIn: &quot;I built [product] in a college course. It's live at [URL]. My 90-day goal is [X MRR]. I'll post weekly updates.&quot; Tag @blokschool if you want.</li>
<li><strong>First 30 days commitment:</strong> Calendar-block 1 hour/day for 30 consecutive days. Show the blocked calendar.</li>
</ol>
<p><strong>What to submit:</strong> Pricing doc + 90-day plan doc + link to your public accountability post + screenshot of blocked calendar.</p>
<p><strong>Why this matters:</strong> 80% of what you learned in this course will evaporate if you don't execute in the 30 days after the course ends. Public commitment + daily time blocking is the cheapest way to fight that.</p>`,
            content: `<h2>Pricing, Scaling, 90-Day Plan</h2>

<h3>Pricing Psychology — The Part Most Founders Get Wrong</h3>
<p>Three frameworks:</p>
<ul>
<li><strong>Cost-plus</strong> (your costs × markup) — bad for software; ignore.</li>
<li><strong>Competitive</strong> (match competitors) — safe, boring, leaves money on the table.</li>
<li><strong>Value-based</strong> — price at a fraction of the value you deliver. &quot;Saves 10 hrs/mo at $50/hr = $500/mo of value; charge $49-99.&quot;</li>
</ul>

<h3>Patterns That Work in 2026</h3>
<ul>
<li><strong>3-tier ladder:</strong> $19 / $49 / $99 or $29 / $99 / $299. Middle tier = what you want sold, make it the best value visually.</li>
<li><strong>Anchor high:</strong> Show &quot;Enterprise — Contact us&quot; tier so lower tiers look cheap.</li>
<li><strong>Usage-based</strong> (AI products especially): base fee + per-call overage. Mirrors your OpenAI/Anthropic costs. Example: $20/mo includes 100 runs, $0.10 each after.</li>
<li><strong>Free tier:</strong> Works for PLG. 5-10% convert. Dangerous for AI products — free users can burn real $$$. Rate-limit aggressively.</li>
<li><strong>Annual discount:</strong> 2 months free (17% off). Locks in cash, reduces churn.</li>
</ul>

<h3>Real Pricing Changes That 2-10x&apos;d MRR</h3>
<ul>
<li><strong>Superhuman</strong> — $30/mo flat, never discounted. Premium positioning beats cheap copycats.</li>
<li><strong>Linear</strong> — moved to seat-based $8-14, 3x&apos;d ARR by pricing on team value not feature count.</li>
<li><strong>Cursor</strong> — added $40/mo Ultra in 2024-2025 — usage-based for power users drove massive ARPU lift.</li>
<li><strong>Classic indie hacker move:</strong> double your price. Conversion usually drops &lt;50%, so revenue goes up.</li>
</ul>

<h3>The Scaling Curve</h3>
<p>Broad phases for a bootstrapped AI business:</p>
<table>
<tr><th>Stage</th><th>Range</th><th>Focus</th><th>Time allocation</th></tr>
<tr><td>Pre-revenue</td><td>$0</td><td>Interviews, MVP, first 10 users</td><td>100% build + validate</td></tr>
<tr><td>Ramen</td><td>$1-3k/mo</td><td>Distribution, PMF tuning</td><td>70% distribution, 30% product</td></tr>
<tr><td>Scale-up</td><td>$3-20k/mo</td><td>Paid acquisition, retention</td><td>50/50 growth + ops</td></tr>
<tr><td>Solo-max</td><td>$20-80k/mo</td><td>Automate, hire first VA</td><td>60% ops + automation, 40% growth</td></tr>
<tr><td>Sell or scale</td><td>$80k+/mo</td><td>Hire a team or exit</td><td>Team-building or exit prep</td></tr>
</table>

<h3>The 90-Day Plan</h3>
<p>Every founder who ships fast runs on 30-day sprints. Here&apos;s the shape of a realistic post-course 90 days for a student:</p>

<h4>Days 1-30 — Relaunch</h4>
<ul>
<li>MRR target: $500</li>
<li>Relaunch on Product Hunt with course-iterated product</li>
<li>Daily: 3 X posts, 20 replies, 5 cold DMs</li>
<li>Weekly: 1 blog/SEO page</li>
<li>Weekly: founder call with 3 existing customers — refine product</li>
<li>First feature update shipped in week 2, week 4</li>
</ul>

<h4>Days 31-60 — Compound</h4>
<ul>
<li>MRR target: $2k</li>
<li>First real marketing experiment (micro-influencer seeding, Reddit post, LinkedIn carousel series)</li>
<li>Referral program launched (30% lifetime recurring to referrer)</li>
<li>First hire: VA at $5-10/hr for support triage (20 hrs/mo)</li>
<li>Public MRR screenshot thread on X every Friday</li>
</ul>

<h4>Days 61-90 — Double down</h4>
<ul>
<li>MRR target: $5k (or double whatever day-60 hit)</li>
<li>Identify the ONE distribution channel that&apos;s working, double investment</li>
<li>Kill the 2 channels that aren&apos;t</li>
<li>Pricing raise experiment on the middle tier</li>
<li>Case study from best 3 customers for the website</li>
<li>Decide: keep scaling solo, hire first full-time, or find cofounder</li>
</ul>

<h3>Where Most Students Will Stall</h3>
<ul>
<li><strong>Week 2:</strong> Nobody bought after launch. Temptation is to build more features. Don&apos;t — do more distribution.</li>
<li><strong>Week 5:</strong> Consistent but slow growth. Feels stagnant. Keep posting. Compounding is flat until it isn&apos;t.</li>
<li><strong>Week 8:</strong> First hater / bad feedback / feature request you don&apos;t like. Normal. Don&apos;t overcorrect.</li>
<li><strong>Week 10:</strong> You hit a wall of &quot;is this working?&quot; Show your metrics to 3 other founders for perspective.</li>
</ul>

<h3>When to Quit</h3>
<p>Real talk: not every idea becomes a business. Honest kill criteria:</p>
<ul>
<li>After 90 days of daily effort, still &lt;$100 MRR and no organic interest</li>
<li>Customer interviews keep revealing the problem isn&apos;t actually painful enough to pay for</li>
<li>The niche you picked turned out to be a few hundred people, not thousands</li>
<li>You&apos;ve lost interest — long-term businesses run on founder interest as much as PMF</li>
</ul>
<p>Killing a thing is a skill. The founders who fail permanently are the ones who ride one idea for 5 years without adjusting, not the ones who kill V1 and start V2 in month 3.</p>

<h3>What We&apos;ll Cover in the Final 90 Minutes</h3>
<ul>
<li>Pricing workshop — each student writes their pricing, class critiques</li>
<li>The 90-day plan template — we fill it in together for a student case</li>
<li>How to write a public accountability post that makes you actually follow through</li>
<li>When to raise money (usually: never), when to get investors anyway (rare cases)</li>
<li>Exit paths — acquisitions, acquihires, lifestyle business</li>
<li>Farewell + how to stay connected — alumni Discord, follow-up calls, office hours for graduates</li>
</ul>

<h3>The Final Challenge</h3>
<p>Before you close this tab, do one thing: publish a tweet/LinkedIn post committing to your 90-day MRR target. Tag @blokschool if you want. Make it public. Because once it&apos;s public, the only way you don&apos;t do it is to publicly fail — and that alone is motivating enough to get most of you across the line.</p>
<p>Good luck. Go ship.</p>`,
          },
        ],
      },
    ],
  },
  {
    title: "Git & GitHub Essentials",
    slug: "git-and-github-essentials",
    description:
      "Understand version control, collaboration, and the developer workflow that powers every software project. The foundation underneath every AI tool.",
    published: true,
    order: 4,
    modules: [
      {
        title: "Git Basics",
        order: 0,
        lessons: [
          {
            title: "Version Control Concepts",
            slug: "version-control-concepts",
            order: 0,
            duration: 12,
            content: `<h2>Understanding Version Control</h2>
<p>Version control is the foundation of modern software development. Let's understand why it matters and how it works.</p>
<h3>What is Version Control?</h3>
<p>Version control is a system that records changes to files over time so you can recall specific versions later. It's like having an "undo" button for your entire project.</p>
<h3>Why Use Version Control?</h3>
<ul>
<li>Track every change made to your code</li>
<li>Collaborate with others without conflicts</li>
<li>Experiment safely with branches</li>
<li>Roll back to any previous state</li>
<li>Understand the history of your project</li>
</ul>`,
          },
          {
            title: "Installing Git",
            slug: "installing-git",
            order: 1,
            duration: 10,
            content: `<h2>Installing and Configuring Git</h2>
<p>Let's get Git installed and configured on your machine.</p>
<h3>Installation</h3>
<p>Git is available for all major operating systems. Download it from the official Git website or use your package manager.</p>
<h3>Initial Configuration</h3>
<pre><code>git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"</code></pre>`,
          },
          {
            title: "Repositories, Commits, and Branches",
            slug: "repos-commits-branches",
            order: 2,
            duration: 20,
            content: `<h2>Core Git Concepts</h2>
<p>Let's build a solid understanding of Git's three most important concepts.</p>
<h3>Repositories</h3>
<p>A repository (repo) is a directory that Git tracks. Initialize one with <code>git init</code> or clone an existing one with <code>git clone</code>.</p>
<h3>Commits</h3>
<p>A commit is a snapshot of your project at a specific point in time. Each commit has a unique ID, a message, and a reference to its parent commit.</p>
<h3>Branches</h3>
<p>Branches let you work on different features or fixes in parallel without affecting the main codebase.</p>`,
          },
          {
            title: "The Git Workflow",
            slug: "git-workflow",
            order: 3,
            duration: 15,
            content: `<h2>The Standard Git Workflow</h2>
<p>Learn the day-to-day workflow that developers use with Git.</p>
<h3>The Cycle</h3>
<ol>
<li><strong>Pull</strong> — Get latest changes from remote</li>
<li><strong>Branch</strong> — Create a feature branch</li>
<li><strong>Edit</strong> — Make your changes</li>
<li><strong>Stage</strong> — Select changes to commit</li>
<li><strong>Commit</strong> — Save a snapshot with a message</li>
<li><strong>Push</strong> — Share your branch</li>
<li><strong>PR</strong> — Open a pull request for review</li>
</ol>`,
          },
        ],
      },
      {
        title: "GitHub Collaboration",
        order: 1,
        lessons: [
          {
            title: "Creating a GitHub Account",
            slug: "creating-github-account",
            order: 0,
            duration: 8,
            content: `<h2>Getting Started with GitHub</h2>
<p>GitHub is the world's largest platform for hosting and collaborating on code. Let's set up your account and configure it properly.</p>
<h3>Account Setup</h3>
<ul>
<li>Choose a professional username</li>
<li>Set up two-factor authentication</li>
<li>Configure SSH keys for secure access</li>
<li>Customize your profile</li>
</ul>`,
          },
          {
            title: "Repositories and READMEs",
            slug: "repos-and-readmes",
            order: 1,
            duration: 15,
            content: `<h2>GitHub Repositories</h2>
<p>Learn how to create, manage, and organize your GitHub repositories.</p>
<h3>Creating a Repository</h3>
<p>Every project starts with a repository. Learn the options for visibility, licensing, and initialization.</p>
<h3>The README</h3>
<p>A good README is the front door to your project. Learn what to include and how to write compelling documentation.</p>`,
          },
          {
            title: "Issues and Project Boards",
            slug: "issues-project-boards",
            order: 2,
            duration: 15,
            content: `<h2>Tracking Work with Issues</h2>
<p>GitHub Issues are a powerful way to track bugs, features, and tasks.</p>
<h3>Topics</h3>
<ul>
<li>Creating effective issues</li>
<li>Labels and milestones</li>
<li>Issue templates</li>
<li>Project boards for workflow management</li>
</ul>`,
          },
          {
            title: "GitHub Actions Overview",
            slug: "github-actions-overview",
            order: 3,
            duration: 18,
            content: `<h2>Automation with GitHub Actions</h2>
<p>GitHub Actions lets you automate workflows directly in your repository.</p>
<h3>What Are Actions?</h3>
<p>Actions are automated workflows triggered by events in your repository — pushes, pull requests, issues, and more.</p>
<h3>Common Workflows</h3>
<ul>
<li>Running tests on every push</li>
<li>Deploying on merge to main</li>
<li>Linting and code quality checks</li>
<li>Automated releases</li>
</ul>`,
          },
        ],
      },
      {
        title: "Branching & PRs",
        order: 2,
        lessons: [
          {
            title: "Forking and Cloning",
            slug: "forking-and-cloning",
            order: 0,
            duration: 12,
            content: `<h2>Forking and Cloning</h2>
<p>Learn the difference between forking and cloning, and when to use each.</p>
<h3>Cloning</h3>
<p>Cloning creates a local copy of a repository you have access to.</p>
<h3>Forking</h3>
<p>Forking creates your own copy of someone else's repository on GitHub, allowing you to make changes without affecting the original.</p>`,
          },
          {
            title: "Pull Requests",
            slug: "pull-requests",
            order: 1,
            duration: 20,
            content: `<h2>Mastering Pull Requests</h2>
<p>Pull requests are the heart of GitHub collaboration. Learn how to create, review, and merge them effectively.</p>
<h3>Creating a Great PR</h3>
<ul>
<li>Write clear titles and descriptions</li>
<li>Keep PRs focused and small</li>
<li>Add screenshots for UI changes</li>
<li>Link related issues</li>
</ul>`,
          },
          {
            title: "Code Review Best Practices",
            slug: "code-review-practices",
            order: 2,
            duration: 15,
            content: `<h2>Code Review Best Practices</h2>
<p>Code review is crucial for maintaining code quality and sharing knowledge across the team.</p>
<h3>As a Reviewer</h3>
<ul>
<li>Review promptly — don't block teammates</li>
<li>Be constructive and specific</li>
<li>Focus on logic, not style (use linters for that)</li>
<li>Ask questions when you don't understand</li>
</ul>`,
          },
          {
            title: "Merge Strategies",
            slug: "merge-strategies",
            order: 3,
            duration: 15,
            content: `<h2>Understanding Merge Strategies</h2>
<p>GitHub offers several ways to merge pull requests. Each has tradeoffs.</p>
<h3>Merge Commit</h3>
<p>Preserves all commits and adds a merge commit. Best for feature branches with meaningful history.</p>
<h3>Squash and Merge</h3>
<p>Combines all commits into one. Best for small PRs or when commit history isn't important.</p>
<h3>Rebase and Merge</h3>
<p>Replays commits on top of the base branch. Creates a linear history but rewrites commit hashes.</p>`,
          },
        ],
      },
      {
        title: "Advanced Git",
        order: 3,
        lessons: [
          {
            title: "GitHub CLI",
            slug: "github-cli",
            order: 0,
            duration: 15,
            content: `<h2>Working with GitHub CLI</h2>
<p>The GitHub CLI (<code>gh</code>) brings GitHub functionality to your terminal.</p>
<h3>Key Commands</h3>
<pre><code>gh pr create    # Create a pull request
gh pr view      # View PR details
gh issue create # Create an issue
gh repo clone   # Clone a repository
gh run view     # View GitHub Actions runs</code></pre>`,
          },
          {
            title: "GitHub Pages",
            slug: "github-pages",
            order: 1,
            duration: 12,
            content: `<h2>Hosting with GitHub Pages</h2>
<p>Deploy static websites directly from your GitHub repository for free.</p>
<h3>Setup Options</h3>
<ul>
<li>Deploy from a branch</li>
<li>Deploy with GitHub Actions</li>
<li>Custom domains</li>
</ul>`,
          },
          {
            title: "Secrets and Environment Variables",
            slug: "secrets-env-variables",
            order: 2,
            duration: 15,
            content: `<h2>Managing Secrets</h2>
<p>Learn how to securely manage API keys, tokens, and other sensitive data in your GitHub repositories.</p>
<h3>Repository Secrets</h3>
<p>Store sensitive values that can be used in GitHub Actions without exposing them in code.</p>
<h3>Environment Variables</h3>
<p>Configure environment-specific settings for different deployment stages.</p>`,
          },
          {
            title: "Automating with GitHub Actions",
            slug: "automating-github-actions",
            order: 3,
            duration: 25,
            content: `<h2>Deep Dive: GitHub Actions</h2>
<p>Build sophisticated CI/CD pipelines and automation workflows.</p>
<h3>Writing Workflows</h3>
<p>Learn YAML syntax for defining workflows, triggers, jobs, and steps.</p>
<h3>Practical Examples</h3>
<ul>
<li>CI pipeline with tests and linting</li>
<li>Automated deployment to Vercel</li>
<li>Release automation with changelogs</li>
<li>Scheduled tasks and cron jobs</li>
</ul>`,
          },
        ],
      },
    ],
  },
  {
    title: "AI-Powered Workflows",
    slug: "ai-powered-workflows",
    description:
      "Master the modern AI toolkit. Connect Claude Code, GitHub, APIs, and automation tools into powerful workflows that do the work for you.",
    published: true,
    order: 3,
    modules: [
      {
        title: "The AI Toolkit",
        order: 0,
        lessons: [
          {
            title: "Overview of AI Coding Tools",
            slug: "overview-ai-coding-tools",
            order: 0,
            duration: 15,
            content: `<h2>AI Coding Tools in 2025</h2>
<p>The landscape of AI-assisted development tools has exploded. Let's map it out and understand where each tool fits.</p>
<h3>Categories</h3>
<ul>
<li><strong>Code Completion</strong> — Real-time suggestions as you type</li>
<li><strong>Agentic Tools</strong> — Autonomous agents that can perform complex tasks</li>
<li><strong>Chat Interfaces</strong> — Conversational coding assistants</li>
<li><strong>Specialized Tools</strong> — Testing, documentation, code review</li>
</ul>`,
          },
          {
            title: "Choosing the Right Tool",
            slug: "choosing-right-tool",
            order: 1,
            duration: 12,
            content: `<h2>Choosing the Right AI Tool</h2>
<p>Not every tool is right for every task. Learn how to choose effectively.</p>
<h3>Decision Factors</h3>
<ul>
<li>Task complexity (simple edit vs. multi-file feature)</li>
<li>Context requirements (single file vs. entire codebase)</li>
<li>Speed vs. quality tradeoffs</li>
<li>Integration with your existing workflow</li>
<li>Cost considerations</li>
</ul>`,
          },
          {
            title: "Setting Expectations",
            slug: "setting-expectations",
            order: 2,
            duration: 10,
            content: `<h2>Realistic Expectations</h2>
<p>AI tools are powerful but not magic. Understanding their limitations helps you use them more effectively.</p>
<h3>What AI Does Well</h3>
<ul>
<li>Boilerplate and repetitive code</li>
<li>Following established patterns</li>
<li>Exploring unfamiliar APIs</li>
<li>Code review and bug detection</li>
</ul>
<h3>Where Humans Excel</h3>
<ul>
<li>Architecture decisions</li>
<li>Business logic and domain expertise</li>
<li>Creative problem solving</li>
<li>Understanding user needs</li>
</ul>`,
          },
        ],
      },
      {
        title: "Workflow Automation",
        order: 1,
        lessons: [
          {
            title: "Writing Effective Prompts",
            slug: "writing-effective-prompts",
            order: 0,
            duration: 20,
            content: `<h2>Prompt Engineering 101</h2>
<p>The quality of AI output is directly proportional to the quality of your input. Let's learn to write prompts that get great results.</p>
<h3>Principles</h3>
<ul>
<li><strong>Be specific</strong> — "Add error handling to the login function" beats "make it better"</li>
<li><strong>Provide context</strong> — Reference files, patterns, and constraints</li>
<li><strong>Show examples</strong> — Input/output examples guide the AI</li>
<li><strong>Iterate</strong> — Refine based on initial results</li>
</ul>`,
          },
          {
            title: "Context and Constraints",
            slug: "context-and-constraints",
            order: 1,
            duration: 15,
            content: `<h2>Context is King</h2>
<p>Learn how to provide the right amount of context for consistent, high-quality results.</p>
<h3>Types of Context</h3>
<ul>
<li><strong>Project context</strong> — Tech stack, architecture, conventions</li>
<li><strong>File context</strong> — Related files, imports, dependencies</li>
<li><strong>Task context</strong> — What you're trying to achieve and why</li>
<li><strong>Constraint context</strong> — Performance requirements, compatibility needs</li>
</ul>`,
          },
          {
            title: "Iterative Refinement",
            slug: "iterative-refinement",
            order: 2,
            duration: 15,
            content: `<h2>Iterating on AI Output</h2>
<p>Rarely is the first output perfect. Learn how to refine results through conversation.</p>
<h3>The Feedback Loop</h3>
<ol>
<li>Start with a clear initial prompt</li>
<li>Review the output critically</li>
<li>Provide specific feedback on what to change</li>
<li>Iterate until satisfied</li>
</ol>
<p>Each iteration should be more specific than the last, narrowing in on exactly what you want.</p>`,
          },
        ],
      },
      {
        title: "API Connections & Building Systems",
        order: 2,
        lessons: [
          {
            title: "IDE Integration",
            slug: "ide-integration",
            order: 0,
            duration: 15,
            content: `<h2>AI in Your IDE</h2>
<p>Learn how to integrate AI tools seamlessly into your development environment.</p>
<h3>VS Code Extensions</h3>
<p>Popular AI extensions and how to configure them for optimal use.</p>
<h3>Terminal Integration</h3>
<p>Using Claude Code and other CLI tools alongside your editor.</p>`,
          },
          {
            title: "CI/CD with AI",
            slug: "cicd-with-ai",
            order: 1,
            duration: 18,
            content: `<h2>AI in Your Pipeline</h2>
<p>Incorporate AI into your CI/CD pipeline for automated code review, test generation, and more.</p>
<h3>Use Cases</h3>
<ul>
<li>Automated PR review comments</li>
<li>Test coverage gap analysis</li>
<li>Documentation generation</li>
<li>Security vulnerability scanning</li>
</ul>`,
          },
          {
            title: "Code Quality and AI",
            slug: "code-quality-ai",
            order: 2,
            duration: 15,
            content: `<h2>Maintaining Quality with AI</h2>
<p>AI can help maintain and improve code quality when used correctly.</p>
<h3>Quality Checks</h3>
<ul>
<li>Using AI for code review</li>
<li>Automated refactoring suggestions</li>
<li>Technical debt identification</li>
<li>Performance profiling recommendations</li>
</ul>
<p>Remember: AI is a tool to augment your judgment, not replace it. Always review AI-generated code with the same rigor as human-written code.</p>`,
          },
        ],
      },
    ],
  },
  {
    title: "Python for AI Builders",
    slug: "python-for-ai-builders",
    description:
      "Learn Python — the language behind most AI tools. Understand what's happening when you command AI, so you can debug, customize, and go deeper.",
    published: true,
    order: 5,
    modules: [
      {
        title: "Python Fundamentals",
        order: 0,
        lessons: [
          {
            title: "Why Python for AI?",
            slug: "why-python-for-ai",
            order: 0,
            duration: 10,
            content: `<h2>Why Python for AI?</h2>
<p>Python is the language behind nearly every AI tool you use. Understanding Python gives you superpowers — you can debug, customize, and extend the AI tools you already command.</p>
<h3>What You'll Learn</h3>
<ul>
<li>Why Python dominates AI and machine learning</li>
<li>How Python connects to the AI tools you already use</li>
<li>Setting up your Python environment</li>
<li>Your first Python script</li>
</ul>`,
          },
          {
            title: "Variables, Types, and Logic",
            slug: "variables-types-logic",
            order: 1,
            duration: 15,
            content: `<h2>Python Building Blocks</h2>
<p>Learn the core building blocks of Python — variables, data types, conditionals, and loops. These are the foundations that power every AI tool under the hood.</p>
<h3>Topics</h3>
<ul>
<li>Variables and data types</li>
<li>Strings, numbers, and booleans</li>
<li>If/else logic</li>
<li>Loops and iteration</li>
</ul>`,
          },
          {
            title: "Functions and Modules",
            slug: "functions-and-modules",
            order: 2,
            duration: 15,
            content: `<h2>Functions and Modules</h2>
<p>Organize your code into reusable functions and learn how Python's module system works — the same system that powers every AI library.</p>
<h3>Topics</h3>
<ul>
<li>Defining and calling functions</li>
<li>Parameters and return values</li>
<li>Importing modules</li>
<li>Creating your own modules</li>
</ul>`,
          },
        ],
      },
      {
        title: "Data & APIs",
        order: 1,
        lessons: [
          {
            title: "Working with Data",
            slug: "working-with-data",
            order: 0,
            duration: 15,
            content: `<h2>Working with Data in Python</h2>
<p>AI is all about data. Learn to read, manipulate, and transform data using Python's powerful built-in tools and popular libraries.</p>
<h3>Topics</h3>
<ul>
<li>Lists, dictionaries, and sets</li>
<li>Reading and writing files</li>
<li>JSON data handling</li>
<li>Introduction to pandas</li>
</ul>`,
          },
          {
            title: "Calling APIs with Python",
            slug: "calling-apis-python",
            order: 1,
            duration: 15,
            content: `<h2>Calling APIs with Python</h2>
<p>Most AI tools communicate through APIs. Learn to make HTTP requests, handle responses, and connect to real-world services.</p>
<h3>Topics</h3>
<ul>
<li>What is an API?</li>
<li>Making requests with the requests library</li>
<li>Parsing JSON responses</li>
<li>Authentication and API keys</li>
</ul>`,
          },
          {
            title: "Working with the OpenAI & Anthropic APIs",
            slug: "openai-anthropic-apis",
            order: 2,
            duration: 15,
            content: `<h2>AI APIs in Practice</h2>
<p>Connect directly to the AI APIs that power your favorite tools. Understand what happens when you send a prompt and get a response.</p>
<h3>Topics</h3>
<ul>
<li>Setting up API clients</li>
<li>Sending prompts programmatically</li>
<li>Handling streaming responses</li>
<li>Token counting and cost management</li>
</ul>`,
          },
        ],
      },
      {
        title: "Scripting & Automation",
        order: 2,
        lessons: [
          {
            title: "Python Scripts for Automation",
            slug: "python-scripts-automation",
            order: 0,
            duration: 15,
            content: `<h2>Automate Everything</h2>
<p>Use Python to automate repetitive tasks — file management, data processing, web scraping, and more.</p>
<h3>Topics</h3>
<ul>
<li>Command-line scripts</li>
<li>File system automation</li>
<li>Web scraping basics</li>
<li>Scheduling and cron jobs</li>
</ul>`,
          },
          {
            title: "Error Handling and Debugging",
            slug: "error-handling-debugging",
            order: 1,
            duration: 12,
            content: `<h2>When Things Go Wrong</h2>
<p>Learn to debug Python code and handle errors gracefully — essential skills for understanding what's happening when AI tools fail.</p>
<h3>Topics</h3>
<ul>
<li>Try/except blocks</li>
<li>Common error types</li>
<li>Debugging strategies</li>
<li>Reading error messages like a pro</li>
</ul>`,
          },
          {
            title: "Virtual Environments and Dependencies",
            slug: "virtual-environments-dependencies",
            order: 2,
            duration: 10,
            content: `<h2>Managing Python Projects</h2>
<p>Learn to manage dependencies and isolate your projects — the same skills used in every professional Python project.</p>
<h3>Topics</h3>
<ul>
<li>Virtual environments with venv</li>
<li>Installing packages with pip</li>
<li>Requirements files</li>
<li>Project structure best practices</li>
</ul>`,
          },
        ],
      },
      {
        title: "Real Projects",
        order: 3,
        lessons: [
          {
            title: "Build a CLI Tool",
            slug: "build-cli-tool",
            order: 0,
            duration: 20,
            content: `<h2>Build Your Own CLI Tool</h2>
<p>Put everything together by building a real command-line tool in Python — from argument parsing to output formatting.</p>
<h3>What You'll Build</h3>
<ul>
<li>A CLI tool with argument parsing</li>
<li>API integration for data fetching</li>
<li>Formatted output and error handling</li>
<li>Packaging for distribution</li>
</ul>`,
          },
          {
            title: "Build an AI-Powered Script",
            slug: "build-ai-powered-script",
            order: 1,
            duration: 20,
            content: `<h2>Build an AI-Powered Script</h2>
<p>Combine your Python and AI knowledge to build a script that uses AI APIs to solve a real problem.</p>
<h3>What You'll Build</h3>
<ul>
<li>A Python script that calls an AI API</li>
<li>Prompt templating and dynamic inputs</li>
<li>Processing and formatting AI responses</li>
<li>Making it reusable and configurable</li>
</ul>`,
          },
          {
            title: "Extending AI Tools with Python",
            slug: "extending-ai-tools-python",
            order: 2,
            duration: 15,
            content: `<h2>Going Deeper</h2>
<p>Now that you understand Python, you can extend and customize AI tools. Learn to build MCP servers, create custom tooling, and contribute to open source.</p>
<h3>Topics</h3>
<ul>
<li>Building MCP servers in Python</li>
<li>Creating custom AI tool integrations</li>
<li>Contributing to open-source AI projects</li>
<li>Where to go from here</li>
</ul>`,
          },
        ],
      },
    ],
  },
];

/**
 * Idempotent, student-safe seed.
 *
 * Behavior:
 *  - Upserts courses by slug. Modules are upserted by (courseId, title).
 *    Lessons are upserted by (moduleId, slug) — which is the schema's unique key.
 *    This means: existing student Projects (tied to lessonId) are PRESERVED
 *    across reseeds, because we never delete lessons that still appear in
 *    the curriculum.
 *  - Removed courses (e.g. OpenClaw) are explicitly deleted here. That cascade
 *    DOES delete Projects tied to those lessons — we warn before it happens.
 */

const REMOVED_COURSE_SLUGS = ["build-ai-agents-with-openclaw"];

async function removeRetiredCourses() {
  for (const slug of REMOVED_COURSE_SLUGS) {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (!course) continue;

    const projectCount = await prisma.project.count({
      where: { lesson: { module: { courseId: course.id } } },
    });

    if (projectCount > 0) {
      console.warn(
        `⚠️  Removing course "${slug}" will cascade-delete ${projectCount} student submission(s). ` +
          `Back up the database now if you need them. Press Ctrl-C within 5s to abort.`
      );
      await new Promise((r) => setTimeout(r, 5000));
    }

    await prisma.course.delete({ where: { id: course.id } });
    console.log(
      `Removed retired course: ${slug}` +
        (projectCount > 0 ? ` (${projectCount} project(s) cascaded)` : "")
    );
  }
}

type LessonInput = {
  title: string;
  slug: string;
  content: string;
  duration: number;
  order: number;
  projectEnabled?: boolean;
  projectInstructions?: string;
};

async function upsertLesson(moduleId: string, lesson: LessonInput) {
  const data = {
    title: lesson.title,
    content: lesson.content,
    duration: lesson.duration,
    order: lesson.order,
    projectEnabled: lesson.projectEnabled ?? false,
    projectInstructions: lesson.projectInstructions ?? null,
  };

  await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId, slug: lesson.slug } },
    update: data,
    create: { ...data, slug: lesson.slug, moduleId },
  });
}

async function upsertModule(
  courseId: string,
  mod: { title: string; order: number; lessons: LessonInput[] }
) {
  const existing = await prisma.module.findFirst({
    where: { courseId, title: mod.title },
  });

  const record = existing
    ? await prisma.module.update({
        where: { id: existing.id },
        data: { order: mod.order },
      })
    : await prisma.module.create({
        data: { courseId, title: mod.title, order: mod.order },
      });

  for (const lesson of mod.lessons) {
    await upsertLesson(record.id, lesson);
  }
}

// ────────────────────────────────────────────────────────────────────
// Cohort live classes — Spring 2026 cohort schedule
//
// Times are 23:00 UTC (= 7pm ET / 6pm CT / 4pm PT). Adjust per-class
// from /admin/live-classes if the cohort wants different times.
// Idempotent: re-running this seed updates existing rows by roomName
// rather than duplicating. Removing a class from this list will NOT
// delete it — wipe via the admin UI if needed.
// ────────────────────────────────────────────────────────────────────
type LiveClassSeed = {
  roomName: string;
  title: string;
  description: string;
  scheduledAt: Date;
  durationMinutes: number;
  lessonSlug?: string;
};

const COHORT_LIVE_CLASSES: LiveClassSeed[] = [
  // Week 1 — History of AI (Mon–Fri 2026-05-04 to 2026-05-08, 23:00 UTC)
  {
    roomName: "spring-2026-history-day-1",
    title: "History of AI · Day 1 — The Dream of Thinking Machines",
    description:
      "Pre-1950 foundations: Lovelace, Turing, McCulloch–Pitts, cybernetics, and Shannon. The ideas that AI is built on, before any hardware existed to run them.",
    scheduledAt: new Date("2026-05-04T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "dream-of-thinking-machines",
  },
  {
    roomName: "spring-2026-history-day-2",
    title: "History of AI · Day 2 — The Birth of AI and the First Winter",
    description:
      "1950s–1970s: Dartmouth, the Perceptron, symbolic AI, Minsky vs. Rosenblatt, the Lighthill Report, and the first collapse.",
    scheduledAt: new Date("2026-05-05T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "birth-of-ai-first-winter",
  },
  {
    roomName: "spring-2026-history-day-3",
    title: "History of AI · Day 3 — Expert Systems, the Second Winter, and ML Rising",
    description:
      "1980s–2000s: XCON, Lisp machines, the Fifth Generation Project, the rediscovery of backprop, statistical ML's takeover, Deep Blue, and the Netflix Prize.",
    scheduledAt: new Date("2026-05-06T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "expert-systems-second-winter",
  },
  {
    roomName: "spring-2026-history-day-4",
    title: "History of AI · Day 4 — The Deep Learning Revolution",
    description:
      "2010s: AlexNet and ImageNet, GPUs as fuel, Word2Vec, GANs, and Attention Is All You Need. The decade that turned AI from niche into core software.",
    scheduledAt: new Date("2026-05-07T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "deep-learning-revolution",
  },
  {
    roomName: "spring-2026-history-day-5",
    title: "History of AI · Day 5 — The Age of Foundation Models",
    description:
      "2020s: GPT-3, ChatGPT, Claude, scaling laws, RLHF, and the rise of agents. Where we are today and the open questions for the next decade.",
    scheduledAt: new Date("2026-05-08T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "age-of-foundation-models",
  },

  // Weeks 2–5 — Claude: From API to Agents (Mon + Wed each week, 23:00 UTC)
  {
    roomName: "spring-2026-claude-class-1",
    title: "Claude · Class 1 — Understanding Claude: Models, Capabilities, Pricing",
    description:
      "The Claude family in 2026: Opus 4.7, Sonnet 4.6, Haiku 4.5. Pricing, context windows, adaptive thinking, vision, and how to choose the right model.",
    scheduledAt: new Date("2026-05-11T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "understanding-claude-models",
  },
  {
    roomName: "spring-2026-claude-class-2",
    title: "Claude · Class 2 — The Claude API: First Calls, Messages, and Streaming",
    description:
      "Set up the Anthropic SDK, make your first API call, build a streaming terminal chatbot. By the end of class you will have shipped your first Claude integration.",
    scheduledAt: new Date("2026-05-13T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "claude-api-first-calls",
  },
  {
    roomName: "spring-2026-claude-class-3",
    title: "Claude · Class 3 — Tool Use and MCP: Connecting Claude to the World",
    description:
      "Tool use, the Model Context Protocol, and how to give Claude the ability to read files, hit APIs, query databases, and act on the world.",
    scheduledAt: new Date("2026-05-18T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "tool-use-and-mcp",
  },
  {
    roomName: "spring-2026-claude-class-4",
    title: "Claude · Class 4 — Prompt Caching, Files API, and Batch API",
    description:
      "Cost optimization at scale. Prompt caching for repeated context, the Files API for large documents, and the Batch API for 50% cheaper async workloads.",
    scheduledAt: new Date("2026-05-20T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "caching-files-batch",
  },
  {
    roomName: "spring-2026-claude-class-5",
    title: "Claude · Class 5 — The Claude Agent SDK: Building Autonomous Agents",
    description:
      "Build your first autonomous agent with the Claude Agent SDK. Memory, planning loops, tool routing, and graceful shutdown.",
    scheduledAt: new Date("2026-05-25T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "claude-agent-sdk",
  },
  {
    roomName: "spring-2026-claude-class-6",
    title: "Claude · Class 6 — Multi-Agent Systems: Delegation and Subagents",
    description:
      "Architecting systems where multiple Claude agents delegate to each other. Subagents, supervisors, blackboards, and when NOT to multi-agent.",
    scheduledAt: new Date("2026-05-27T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "multi-agent-systems",
  },
  {
    roomName: "spring-2026-claude-class-7",
    title: "Claude · Class 7 — Claude Code: The CLI, Skills, and Hooks",
    description:
      "Anthropic's agentic CLI in depth. Skills, hooks, slash commands, MCP servers, and how to make Claude Code do exactly what you want.",
    scheduledAt: new Date("2026-06-01T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "claude-code-cli-skills-hooks",
  },
  {
    roomName: "spring-2026-claude-class-8",
    title: "Claude · Class 8 — Routines and Production Deployment",
    description:
      "Routines, scheduling, observability, error budgets, and how to run a Claude-powered system in production without it falling over at 3am.",
    scheduledAt: new Date("2026-06-03T23:00:00Z"),
    durationMinutes: 120,
    lessonSlug: "routines-production-deployment",
  },
];

// Spring 2026 cohort — created idempotently so students can join with code SPRING26
// from day one. Includes the courses students should see during the cohort.
async function seedSpring2026Cohort(ownerId: string) {
  const cohort = await prisma.cohort.upsert({
    where: { code: "SPRING26" },
    update: { ownerId, archived: false },
    create: {
      code: "SPRING26",
      name: "Spring 2026 Cohort",
      description:
        "The inaugural cohort. Wednesday Day 0 setup, then History of AI Week 1, then 4 weeks of Claude API → Agents.",
      ownerId,
    },
  });

  const cohortCourseSlugs = [
    "setup",
    "history-of-ai",
    "claude-from-api-to-agents",
  ];
  const courses = await prisma.course.findMany({
    where: { slug: { in: cohortCourseSlugs } },
    select: { id: true, slug: true },
  });
  for (const course of courses) {
    await prisma.cohortCourse.upsert({
      where: {
        cohortId_courseId: { cohortId: cohort.id, courseId: course.id },
      },
      update: {},
      create: { cohortId: cohort.id, courseId: course.id },
    });
  }

  console.log(
    `Cohort: ${cohort.name} (code ${cohort.code}, ${courses.length} courses linked).`,
  );
  return cohort;
}

async function seedCohortLiveClasses(hostUserId: string, cohortId: string) {
  // Look up lesson IDs once via slug; lesson rows already exist from the
  // curriculum upsert above.
  const lessonsBySlug = new Map<string, string>();
  const slugs = COHORT_LIVE_CLASSES.map((c) => c.lessonSlug).filter(
    (s): s is string => !!s,
  );
  if (slugs.length > 0) {
    const lessons = await prisma.lesson.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    });
    for (const l of lessons) lessonsBySlug.set(l.slug, l.id);
  }

  let created = 0;
  let updated = 0;
  for (const c of COHORT_LIVE_CLASSES) {
    const lessonId = c.lessonSlug ? lessonsBySlug.get(c.lessonSlug) : null;
    const existing = await prisma.liveClass.findUnique({
      where: { roomName: c.roomName },
    });
    if (existing) {
      await prisma.liveClass.update({
        where: { id: existing.id },
        data: {
          title: c.title,
          description: c.description,
          scheduledAt: c.scheduledAt,
          durationMinutes: c.durationMinutes,
          lessonId: lessonId ?? null,
          hostUserId,
          cohortId,
        },
      });
      updated++;
    } else {
      await prisma.liveClass.create({
        data: {
          roomName: c.roomName,
          title: c.title,
          description: c.description,
          scheduledAt: c.scheduledAt,
          durationMinutes: c.durationMinutes,
          lessonId: lessonId ?? null,
          hostUserId,
          cohortId,
        },
      });
      created++;
    }
  }
  console.log(
    `Live classes: ${created} created, ${updated} updated (Spring 2026 cohort).`,
  );
}

function resolveSeedPassword(
  envVar: "ADMIN_PASSWORD" | "STUDENT_PASSWORD",
  fallback: string
): { password: string; explicit: boolean } {
  const fromEnv = process.env[envVar];
  if (fromEnv && fromEnv.length >= 8) return { password: fromEnv, explicit: true };

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Refusing to seed in production without a strong ${envVar} env var (min 8 chars). ` +
        `Set ${envVar} in your environment, or don't run the seed in production.`
    );
  }

  console.warn(
    `⚠️  Using the throwaway dev default for ${envVar}. Set ${envVar} in .env for anything shared.`
  );
  return { password: fallback, explicit: false };
}

async function main() {
  console.log("Seeding database...");

  await removeRetiredCourses();

  // Create admin user. If ADMIN_PASSWORD is explicitly set, update too —
  // so "change the env var and reseed" rotates the password.
  const adminPwd = resolveSeedPassword("ADMIN_PASSWORD", "admin123");
  const adminHash = await bcrypt.hash(adminPwd.password, 12);
  const admin = await prisma.user.upsert({
    where: { email: "chase@blokblokstudio.com" },
    update: adminPwd.explicit ? { hashedPassword: adminHash } : {},
    create: {
      name: "Chase Haynes",
      email: "chase@blokblokstudio.com",
      hashedPassword: adminHash,
      role: Role.ADMIN,
    },
  });
  console.log(
    `Admin user: ${admin.email}` + (adminPwd.explicit ? " (password rotated from env)" : "")
  );

  // Create demo student
  const studentPwd = resolveSeedPassword("STUDENT_PASSWORD", "student123");
  const studentHash = await bcrypt.hash(studentPwd.password, 12);
  const student = await prisma.user.upsert({
    where: { email: "student@blokschool.com" },
    update: studentPwd.explicit ? { hashedPassword: studentHash } : {},
    create: {
      name: "Demo Student",
      email: "student@blokschool.com",
      hashedPassword: studentHash,
      role: Role.STUDENT,
    },
  });
  console.log(
    `Student user: ${student.email}` + (studentPwd.explicit ? " (password rotated from env)" : "")
  );

  // Upsert courses, then modules, then lessons — all idempotent.
  for (const courseData of curriculum) {
    const { modules, ...courseFields } = courseData;

    const course = await prisma.course.upsert({
      where: { slug: courseFields.slug },
      update: courseFields,
      create: courseFields,
    });

    for (const mod of modules) {
      await upsertModule(course.id, mod);
    }

    console.log(`Course: ${course.title} (${course.slug})`);
  }

  const cohort = await seedSpring2026Cohort(admin.id);
  await seedCohortLiveClasses(admin.id, cohort.id);

  // Enroll demo student in first course
  const firstCourse = await prisma.course.findUnique({
    where: { slug: "command-ai-with-claude-code" },
  });
  if (firstCourse) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId: student.id, courseId: firstCourse.id },
      },
      update: {},
      create: { userId: student.id, courseId: firstCourse.id },
    });
    console.log("Enrolled demo student in Command AI with Claude Code");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
