import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SLUG = "setup";

async function main() {
  const existing = await prisma.course.findUnique({ where: { slug: SLUG } });
  if (existing) {
    await prisma.course.delete({ where: { slug: SLUG } });
    console.log(`Deleted existing course "${SLUG}"`);
  }

  const course = await prisma.course.create({
    data: {
      title: "Day 0: Set Up Your Computer",
      slug: SLUG,
      description:
        "Before your first class, get every tool installed and working — Git, Node.js, Python, VS Code, and Claude Code. Step-by-step instructions for Mac, Windows, and Linux. No prior experience required.",
      published: true,
      order: -1,
      modules: {
        create: [
          // ─────────────────────────────────────────────────────────────
          // Module 1: Welcome
          // ─────────────────────────────────────────────────────────────
          {
            title: "Welcome — Read This First",
            order: 0,
            lessons: {
              create: [
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
          },

          // ─────────────────────────────────────────────────────────────
          // Module 2: Mac
          // ─────────────────────────────────────────────────────────────
          {
            title: "Mac Setup",
            order: 1,
            lessons: {
              create: [
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
          },

          // ─────────────────────────────────────────────────────────────
          // Module 3: Windows
          // ─────────────────────────────────────────────────────────────
          {
            title: "Windows Setup",
            order: 2,
            lessons: {
              create: [
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
          },

          // ─────────────────────────────────────────────────────────────
          // Module 4: Linux
          // ─────────────────────────────────────────────────────────────
          {
            title: "Linux Setup (Ubuntu / Debian)",
            order: 3,
            lessons: {
              create: [
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
          },
        ],
      },
    },
    include: {
      modules: { include: { lessons: true } },
    },
  });

  console.log(`✅ Created course "${course.title}" (slug: ${course.slug})`);
  console.log(`   ${course.modules.length} modules, ${course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
