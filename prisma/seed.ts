import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const curriculum = [
  {
    title: "Command AI with Claude Code",
    slug: "command-ai-with-claude-code",
    description:
      "Master Anthropic's agentic coding CLI — the #1 most-loved AI coding tool. Build real projects from your terminal with voice mode, 1M token context, and the Agent SDK. No coding experience needed.",
    published: true,
    order: 0,
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
    title: "Build AI Agents with OpenClaw",
    slug: "build-ai-agents-with-openclaw",
    description:
      "Build autonomous AI agents with OpenClaw — the open-source agent runtime with 321k+ GitHub stars. Connect AI to WhatsApp, Telegram, Discord and more. Your agent reads messages, reasons, and takes real-world actions.",
    published: true,
    order: 1,
    modules: [
      {
        title: "What Are AI Agents?",
        order: 0,
        lessons: [
          {
            title: "What is OpenClaw?",
            slug: "what-is-openclaw",
            order: 0,
            duration: 12,
            content: `<h2>Welcome to OpenClaw</h2>
<p>OpenClaw is a <strong>free, open-source autonomous AI agent runtime</strong> — the most-starred AI project on GitHub with 321,000+ stars. Created by Peter Steinberger, it's a self-hosted Node.js service that connects messaging platforms to an AI that <em>actually does things</em>.</p>
<h3>What Makes OpenClaw Different</h3>
<p>Unlike chatbots that only talk, OpenClaw <strong>takes actions</strong>: running shell commands, managing files, browsing websites, sending emails, controlling APIs, and automating tasks across applications. It runs locally on your hardware — you own everything.</p>
<h3>Key Features</h3>
<ul>
<li><strong>50+ messaging integrations</strong> — WhatsApp, Telegram, Discord, Slack, Signal, iMessage</li>
<li><strong>Model-agnostic</strong> — Works with Claude, GPT, DeepSeek, or local models via LM Studio</li>
<li><strong>100+ preconfigured skills</strong> — Ready-made actions the agent can perform</li>
<li><strong>Persistent memory</strong> — Stored in simple Markdown files the agent manages itself</li>
<li><strong>Runs anywhere</strong> — macOS, Linux, Windows, Raspberry Pi</li>
<li><strong>MIT Licensed</strong> — Free for commercial and personal use</li>
</ul>
<h3>Why Learn OpenClaw?</h3>
<p>OpenClaw teaches you how autonomous AI agents work in the real world. You'll learn TypeScript, shell scripting, API integration, and the architecture behind agents that can reason, plan, and execute tasks without human intervention.</p>`,
          },
          {
            title: "Use Cases and Capabilities",
            slug: "use-cases-capabilities",
            order: 1,
            duration: 15,
            content: `<h2>What Can You Build with OpenClaw?</h2>
<p>OpenClaw agents run 24/7 and interact with the real world. Here's what people are building:</p>
<h3>Real-World Agent Use Cases</h3>
<ul>
<li><strong>Personal AI Assistant</strong> — Message it on WhatsApp to manage files, search the web, control smart home devices, send emails</li>
<li><strong>Deal Hunter Agents</strong> — Scrape marketplaces, analyze prices with AI, send Telegram alerts when deals appear</li>
<li><strong>Code Review Bots</strong> — Monitor GitHub repos and review PRs automatically</li>
<li><strong>Content Pipelines</strong> — Scrape RSS feeds, summarize with AI, post to social media or email digests</li>
<li><strong>Hardware Control</strong> — Program Arduinos, control Raspberry Pi GPIO, IoT automation via Home Assistant</li>
<li><strong>Customer Support</strong> — AI agents that handle support tickets across Slack, Discord, and email simultaneously</li>
</ul>
<h3>The Key Difference</h3>
<p>Traditional automation (like cron jobs or Zapier) follows rigid rules. OpenClaw agents <strong>reason about what to do</strong> — they can handle unexpected situations, make judgment calls, and adapt their behavior based on context.</p>`,
          },
          {
            title: "Setting Up Your Environment",
            slug: "setting-up-environment",
            order: 2,
            duration: 15,
            content: `<h2>Environment Setup</h2>
<p>Let's get OpenClaw running on your machine. It takes about 5 minutes.</p>
<h3>Requirements</h3>
<ul>
<li>Node.js 22+ (OpenClaw is built on Node.js)</li>
<li>An API key for your LLM provider (Claude, GPT, or use a free local model via LM Studio)</li>
<li>Git for version control</li>
</ul>
<h3>Installation</h3>
<pre><code>git clone https://github.com/openclaw/openclaw.git
cd openclaw
npm install
cp .env.example .env</code></pre>
<h3>First Run</h3>
<pre><code>npx openclaw</code></pre>
<p>OpenClaw will walk you through connecting your first messaging platform and choosing an AI model. Start with Telegram — it's the easiest to set up.</p>
<h3>Verify It Works</h3>
<p>Send your agent a message on Telegram: "What time is it?" If it responds, you're ready to build.</p>`,
          },
        ],
      },
      {
        title: "Your First Agent",
        order: 1,
        lessons: [
          {
            title: "Architecture Overview",
            slug: "architecture-overview",
            order: 0,
            duration: 20,
            content: `<h2>OpenClaw Architecture</h2>
<p>Understanding how OpenClaw works under the hood helps you build better agents and debug issues faster.</p>
<h3>The Agent Loop</h3>
<ol>
<li><strong>Message arrives</strong> — User sends a message via WhatsApp, Telegram, Discord, etc.</li>
<li><strong>Context assembly</strong> — OpenClaw gathers conversation history, available skills, and persistent memory</li>
<li><strong>LLM reasoning</strong> — The AI model decides what to do (run a command, read a file, call an API, etc.)</li>
<li><strong>Action execution</strong> — OpenClaw runs the chosen action on your machine</li>
<li><strong>Memory update</strong> — Results are stored in Markdown files the agent maintains</li>
<li><strong>Response</strong> — The agent sends back a message to the user</li>
</ol>
<h3>Core Components</h3>
<ul>
<li><strong>Message Router</strong> — Connects 50+ messaging platforms to the agent core</li>
<li><strong>Skills System</strong> — JS/TS functions stored as directories with a SKILL.md metadata file</li>
<li><strong>Memory System</strong> — Persistent long-term memory stored in local Markdown files</li>
<li><strong>Gateway</strong> — REST API for programmatic control (locked to localhost by default)</li>
</ul>`,
          },
          {
            title: "Configuration and Customization",
            slug: "configuration-customization",
            order: 1,
            duration: 15,
            content: `<h2>Configuring OpenClaw</h2>
<p>OpenClaw is highly configurable through its <code>openclaw.json</code> file and environment variables.</p>
<h3>Model Selection</h3>
<p>OpenClaw is model-agnostic. Switch between providers in your config:</p>
<ul>
<li><strong>Claude</strong> (Anthropic) — Best for complex reasoning and code generation</li>
<li><strong>GPT-4o / GPT-5</strong> (OpenAI) — Strong general purpose</li>
<li><strong>DeepSeek</strong> — Cost-effective for simpler tasks</li>
<li><strong>Local models via LM Studio</strong> — Free, private, runs on your hardware</li>
</ul>
<h3>Skill Toggles</h3>
<p>Enable or disable individual skills without removing them. Perfect for testing and gradual rollouts.</p>
<h3>Cron Schedules</h3>
<p>Define when autonomous tasks run using standard cron expressions. Your agent can scrape data every 30 minutes, send daily summaries, or run backups at 3am — all without human intervention.</p>`,
          },
          {
            title: "Integration Points",
            slug: "integration-points",
            order: 2,
            duration: 18,
            content: `<h2>Integrating OpenClaw</h2>
<p>OpenClaw's power comes from connecting it to real-world systems. Each integration becomes a tool your agent can use.</p>
<h3>Messaging Platforms</h3>
<p>Your agent can be reached on WhatsApp (via Baileys), Telegram (via grammY), Discord (via discord.js), Slack (via Bolt), and 50+ other platforms. Users message the agent naturally, and it responds with actions.</p>
<h3>Hardware Integration</h3>
<p>OpenClaw can program Arduinos, control Raspberry Pi GPIO pins, and integrate with Home Assistant for smart home automation. Your agent can literally control physical devices.</p>
<h3>API & Database Connections</h3>
<p>Give your agent access to external APIs for real-time data (weather, stock prices, web scraping) and databases (SQLite, PostgreSQL) for persistent storage and querying.</p>
<h3>Webhook Triggers</h3>
<p>Set up webhooks so external events (GitHub pushes, payment received, sensor triggered) automatically wake up your agent to take action.</p>`,
          },
        ],
      },
      {
        title: "Advanced Agent Patterns",
        order: 2,
        lessons: [
          {
            title: "Your First OpenClaw Agent",
            slug: "first-openclaw-project",
            order: 0,
            duration: 25,
            content: `<h2>Hands-On: Your First Agent</h2>
<p>Build a complete agent from scratch that lives on Telegram and can manage your files, answer questions, and take actions on your computer.</p>
<h3>What We'll Build</h3>
<p>A Telegram-based personal assistant agent that can:</p>
<ul>
<li>Answer questions using Claude or GPT</li>
<li>Read and summarize files on your computer</li>
<li>Run shell commands and report results</li>
<li>Remember things you tell it (persistent memory)</li>
</ul>
<h3>Skills We'll Create</h3>
<ol>
<li><strong>file-reader</strong> — Read and summarize any file</li>
<li><strong>shell-runner</strong> — Execute commands safely</li>
<li><strong>note-taker</strong> — Save and retrieve notes in Markdown</li>
</ol>`,
          },
          {
            title: "Working with APIs",
            slug: "working-with-apis",
            order: 1,
            duration: 20,
            content: `<h2>API Integration Deep Dive</h2>
<p>Your agent needs to talk to the outside world. Learn how to connect it to any API safely and reliably.</p>
<h3>Building API Tools</h3>
<p>Each API integration becomes a CLI tool your agent can call. We'll build tools that:</p>
<ul>
<li><strong>Authenticate securely</strong> — Store API keys in .env, never hardcode them</li>
<li><strong>Handle rate limits</strong> — Use p-queue for request throttling (1 request per N seconds)</li>
<li><strong>Retry on failure</strong> — Exponential backoff (3s, 9s, 27s) for transient errors</li>
<li><strong>Cache responses</strong> — Avoid redundant API calls with time-based caching</li>
</ul>
<h3>Example: Weather API Tool</h3>
<p>We'll build a weather tool the agent can call to check conditions anywhere in the world, then use it in a morning briefing skill.</p>`,
          },
          {
            title: "Data Processing Pipelines",
            slug: "data-processing-pipelines",
            order: 2,
            duration: 25,
            content: `<h2>Building Data Pipelines</h2>
<p>Use OpenClaw to build intelligent data processing pipelines that extract, transform, and load data with AI-powered decision making.</p>
<h3>What We'll Build</h3>
<p>A content aggregator agent that:</p>
<ol>
<li>Scrapes RSS feeds and websites on a cron schedule</li>
<li>Uses Claude to summarize and categorize articles</li>
<li>Stores results in SQLite for querying</li>
<li>Sends a daily digest via Telegram with the top stories</li>
</ol>
<h3>Pipeline Pattern</h3>
<p>This is the fundamental pattern for autonomous agents: <strong>Gather → Analyze → Store → Notify</strong>. Once you understand this, you can apply it to any domain — deal hunting, job searching, competitor monitoring, or news tracking.</p>`,
          },
        ],
      },
      {
        title: "Deploy & Scale",
        order: 3,
        lessons: [
          {
            title: "Performance Optimization",
            slug: "performance-optimization",
            order: 0,
            duration: 20,
            content: `<h2>Optimizing OpenClaw Performance</h2>
<p>Learn techniques to make your agents faster, cheaper, and more reliable.</p>
<h3>Cost Control</h3>
<ul>
<li><strong>Model routing</strong> — Use cheaper models (Haiku, DeepSeek) for simple tasks, reserve Opus/GPT-5 for complex reasoning</li>
<li><strong>Prompt optimization</strong> — Shorter, more focused prompts reduce token costs</li>
<li><strong>Spend tracking</strong> — Build a skill that monitors daily API costs and alerts if approaching limits</li>
</ul>
<h3>Speed Optimization</h3>
<ul>
<li><strong>Response caching</strong> — Cache identical queries to avoid redundant LLM calls</li>
<li><strong>Batch processing</strong> — Group similar tasks together instead of processing one at a time</li>
<li><strong>Streaming</strong> — Use streaming responses for real-time feedback to users</li>
</ul>`,
          },
          {
            title: "Custom Extensions",
            slug: "custom-extensions",
            order: 1,
            duration: 25,
            content: `<h2>Building Custom Skills</h2>
<p>The real power of OpenClaw is creating your own skills. Each skill is a directory with a SKILL.md file that tells the agent what it can do.</p>
<h3>Skill Anatomy</h3>
<pre><code>/skills/my-skill/
  SKILL.md      — What the agent sees (name, tools, instructions, rules)
  index.js      — Optional implementation code</code></pre>
<h3>Writing a SKILL.md</h3>
<p>The SKILL.md is the contract between you and the agent. It defines:</p>
<ul>
<li><strong>Tools</strong> — Exact CLI commands the agent can run</li>
<li><strong>Instructions</strong> — Step-by-step guide for using the skill</li>
<li><strong>Rules</strong> — Hard constraints the agent must follow</li>
</ul>
<h3>Community Skills</h3>
<p>Browse 1,000+ community skills on ClawHub (github.com/openclaw/clawhub) — from code review bots to smart home controllers. Install any skill with a single command.</p>`,
          },
          {
            title: "Deployment Strategies",
            slug: "deployment-strategies",
            order: 2,
            duration: 20,
            content: `<h2>Deploying OpenClaw Agents</h2>
<p>Take your agent from your laptop to running 24/7 on its own machine.</p>
<h3>Deployment Options</h3>
<ul>
<li><strong>Raspberry Pi</strong> — $50 dedicated agent hardware, runs at home. OpenClaw has native Pi 5 support with Hailo AI accelerator</li>
<li><strong>VPS</strong> — A $5/month DigitalOcean or Hetzner server for always-on agents</li>
<li><strong>Docker</strong> — Containerize your agent for easy deployment and portability</li>
</ul>
<h3>Security Hardening</h3>
<ul>
<li>Gateway locked to localhost (no external API access)</li>
<li>SSH key-only authentication</li>
<li>UFW firewall rules</li>
<li>Dedicated system user with limited permissions</li>
<li>Automatic security updates</li>
</ul>
<h3>Monitoring</h3>
<p>Set up your agent to report its own health via Telegram: uptime, error count, API spend, last action taken. If something breaks, you get an alert immediately.</p>`,
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
    order: 3,
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
    order: 2,
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
    order: 4,
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

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "chase@blokblokstudio.com" },
    update: {},
    create: {
      name: "Chase Haynes",
      email: "chase@blokblokstudio.com",
      hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Admin user: ${admin.email}`);

  // Create demo student
  const studentPassword = await bcrypt.hash("student123", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@blokschool.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@blokschool.com",
      hashedPassword: studentPassword,
      role: Role.STUDENT,
    },
  });
  console.log(`Student user: ${student.email}`);

  // Create courses with modules and lessons
  for (const courseData of curriculum) {
    const { modules, ...courseFields } = courseData;

    const course = await prisma.course.upsert({
      where: { slug: courseFields.slug },
      update: courseFields,
      create: {
        ...courseFields,
        modules: {
          create: modules.map((mod) => ({
            title: mod.title,
            order: mod.order,
            lessons: {
              create: mod.lessons.map((lesson) => ({
                title: lesson.title,
                slug: lesson.slug,
                content: lesson.content,
                duration: lesson.duration,
                order: lesson.order,
              })),
            },
          })),
        },
      },
    });

    console.log(`Course: ${course.title} (${course.slug})`);
  }

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
