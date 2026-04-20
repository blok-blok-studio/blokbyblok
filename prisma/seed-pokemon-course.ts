import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Delete old lesson if it exists
  await prisma.lesson.deleteMany({ where: { slug: "pokemon-card-deal-hunter" } });
  console.log("Cleaned up old lesson");

  const course = await prisma.course.create({
    data: {
      title: "Pokemon Card Agent: Build an Autonomous Deal Hunter",
      slug: "pokemon-card-agent",
      description:
        "Build a complete autonomous agent with OpenClaw that scrapes marketplaces, analyzes deals with AI, and manages seller outreach. A real-world project covering web scraping, AI analysis, Telegram bots, email/voice outreach, and deployment to isolated hardware.",
      published: true,
      order: 4,
      modules: {
        create: [
          {
            title: "Project Overview & Setup",
            order: 0,
            lessons: {
              create: [
                {
                  title: "What We Are Building",
                  slug: "what-we-are-building",
                  order: 0,
                  duration: 10,
                  githubUrl: "https://github.com/blok-blok-studio/Pokemon-Scraper",
                  content: `<h2>The Pokemon Card Agent</h2>
<p>In this course, you'll build a complete, production-ready <strong>autonomous agent</strong> that hunts for discounted Pokemon TCG cards across online marketplaces. This isn't a toy project — it's a real system that runs 24/7 on isolated hardware, makes its own decisions, and communicates results back to you.</p>

<h3>Download the Complete Source Code</h3>
<p><a href="/uploads/files/Pokemon-Scraper-main.zip" download><strong>📦 Download Pokemon-Scraper-main.zip</strong></a></p>

<h3>What the Agent Does</h3>
<ul>
<li><strong>eBay Scraping</strong> — Finds Pokemon card listings (Buy It Now only), up to 3 pages per search</li>
<li><strong>TCGPlayer Price Check</strong> — Cross-references market prices for discount calculation</li>
<li><strong>AI Card Analysis</strong> — Claude analyzes listings for legitimacy, deal quality, and red flags</li>
<li><strong>Telegram Alerts</strong> — Real-time deal notifications with bot commands for control</li>
<li><strong>Email Outreach</strong> — AI-personalized emails to card shops and sellers via Resend</li>
<li><strong>Voice Outreach</strong> — AI phone calls to stores via Bland.ai with transcript analysis</li>
<li><strong>Spend Tracking</strong> — Monitors API costs with daily caps so it never overspends</li>
<li><strong>Web Dashboard</strong> — Bootstrap status dashboard on localhost</li>
</ul>

<h3>How It Works</h3>
<ol>
<li><strong>Build</strong> in Claude Code (this repo)</li>
<li><strong>Push</strong> to GitHub</li>
<li><strong>Pull</strong> onto isolated hardware</li>
<li><strong>Run</strong> on OpenClaw — the agent operates autonomously from there</li>
</ol>

<h3>Tech Stack</h3>
<ul>
<li><strong>Runtime:</strong> Node.js + OpenClaw</li>
<li><strong>Scraping:</strong> Puppeteer (headless Chrome)</li>
<li><strong>Database:</strong> SQLite via better-sqlite3</li>
<li><strong>AI:</strong> Anthropic Claude API</li>
<li><strong>Messaging:</strong> Telegram Bot API</li>
<li><strong>Email:</strong> Resend API</li>
<li><strong>Voice:</strong> Bland.ai API</li>
<li><strong>Dashboard:</strong> Express + Bootstrap</li>
</ul>

<h3>Prerequisites</h3>
<p>Before starting, make sure you have Node.js 22+, a GitHub account, and basic JavaScript knowledge. No prior OpenClaw experience needed.</p>`,
                },
                {
                  title: "Project Architecture",
                  slug: "project-architecture",
                  order: 1,
                  duration: 12,
                  content: `<h2>How the Project is Structured</h2>
<p>The Pokemon Card Agent follows OpenClaw's skill-based architecture. Each capability is a separate <strong>skill</strong> with its own definition file, and shared utilities live in the <code>/tools</code> directory.</p>

<h3>Directory Structure</h3>
<pre><code>/skills              — OpenClaw skill definitions (SKILL.md files)
  /pokemon-scraper   — Marketplace scraping
  /tcg-price-check   — Price cross-referencing
  /card-analyzer     — AI deal analysis
  /deal-alerts       — Telegram notifications
  /email-outreach    — Email to sellers
  /voice-outreach    — Phone calls to stores
  /watchlist-manager — Card tracking
  /spend-tracker     — API cost monitoring
  /agent-dashboard   — Web status page

/tools               — Shared tools called by skills
  /scraper-engine    — eBay + TCGPlayer scrapers
  /analyzer          — AI card analysis logic
  /telegram-client   — Telegram bot + alerts
  /resend-client     — Email outreach via Resend
  /bland-client      — Voice outreach via Bland.ai
  /db                — SQLite database layer
  /dashboard         — Express + Bootstrap web dashboard

/config              — Configuration files (gitignored)
/deploy              — Deployment scripts for isolated hardware
SOUL.md              — Agent personality and rules
AGENTS.md            — Autonomous task definitions
openclaw.json        — OpenClaw configuration with cron schedules</code></pre>

<h3>Skills vs Tools</h3>
<p><strong>Skills</strong> are what OpenClaw sees — each SKILL.md tells the agent what it can do. <strong>Tools</strong> are the implementation — regular Node.js modules that skills call via CLI. This separation means you can update tool logic without changing skill definitions.</p>

<h3>Data Flow</h3>
<ol>
<li>OpenClaw cron triggers the <strong>scrape cycle</strong></li>
<li>The spend-tracker skill checks the daily budget</li>
<li>The pokemon-scraper skill calls the eBay tool to find listings</li>
<li>The tcg-price-check skill cross-references prices</li>
<li>The card-analyzer skill uses Claude to analyze deals</li>
<li>The deal-alerts skill sends Telegram notifications</li>
<li>Everything gets logged to the SQLite database</li>
</ol>`,
                },
                {
                  title: "Installation and Configuration",
                  slug: "installation-configuration",
                  order: 2,
                  duration: 15,
                  content: `<h2>Setting Up the Project</h2>

<h3>Clone and Install</h3>
<pre><code>git clone https://github.com/YOUR_USERNAME/pokemon-card-agent.git
cd pokemon-card-agent
npm install</code></pre>

<h3>Configure Environment Variables</h3>
<pre><code>cp .env.example .env
cp config/config.example.json config/config.json
cp config/watchlist.example.json config/watchlist.json
cp config/contacts.example.json config/contacts.json</code></pre>

<h3>API Keys</h3>
<p>Edit your <code>.env</code> file with the following keys:</p>
<table>
<tr><th>Service</th><th>Purpose</th><th>Where to Get It</th></tr>
<tr><td>Anthropic</td><td>AI analysis and email generation</td><td>console.anthropic.com</td></tr>
<tr><td>Telegram</td><td>Deal alerts and bot commands</td><td>Create bot via @BotFather on Telegram</td></tr>
<tr><td>Resend</td><td>Email outreach</td><td>resend.com</td></tr>
<tr><td>Bland.ai</td><td>Voice outreach (optional)</td><td>bland.ai</td></tr>
</table>
<p>All services are pay-as-you-go. No subscriptions required.</p>

<h3>Configuration Files</h3>
<p><strong>config/config.json</strong> — Main settings:</p>
<pre><code>{
  "scrapingIntervalMinutes": 30,
  "minDiscountPercent": 15,
  "maxPriceDefault": 500,
  "broadSearchTerms": [
    "pokemon psa 10 charizard",
    "pokemon gold star",
    "pokemon 1st edition base set"
  ],
  "dailyApiCap": 5.00
}</code></pre>

<h3>Verify Installation</h3>
<pre><code>npm run test:db         # Test database layer
npm run test:dashboard  # Test dashboard server</code></pre>`,
                },
              ],
            },
          },
          {
            title: "OpenClaw Agent Configuration",
            order: 1,
            lessons: {
              create: [
                {
                  title: "SOUL.md — Defining Agent Identity",
                  slug: "soul-md-agent-identity",
                  order: 0,
                  duration: 12,
                  content: `<h2>The Agent's Personality and Rules</h2>
<p><code>SOUL.md</code> is what makes your OpenClaw agent more than just a script. It defines who the agent is, what it cares about, and what it must never do.</p>

<h3>Our Agent's SOUL.md</h3>
<pre><code># Pokemon Card Agent

You are a Pokemon TCG card hunting agent. You run autonomously on OpenClaw
to find rare and discounted Pokemon cards, analyze deals, and manage
outreach to sellers.

## Core Identity
- You are an expert Pokemon TCG market analyst and deal hunter
- You operate autonomously — you decide when to scrape, alert, reach out
- You are methodical, thorough, and never spam sellers
- You protect your operator's money by tracking API costs

## Rules
- NEVER spend more than the daily API cap configured in .env
- NEVER contact the same seller more than once within the cooldown period
- NEVER make voice calls outside business hours (9am-5pm)
- ALWAYS check the database for duplicates before alerting on a deal
- ALWAYS log every action you take
- If you encounter an error, log it, alert via Telegram, and continue
- When in doubt about a listing, flag it as suspicious

## Decision Making
- Prioritize watchlist cards over broad searches
- Grade deals: must-buy (&gt;30% off), good-deal (15-30%), fair, overpriced
- If API spend approaches the cap, reduce scraping frequency</code></pre>

<h3>Key Principles</h3>
<ul>
<li><strong>Safety rails</strong> — The NEVER rules prevent costly mistakes</li>
<li><strong>Graceful degradation</strong> — When budget runs low, it adapts instead of stopping</li>
<li><strong>Never crash</strong> — The agent must always catch errors and continue</li>
<li><strong>Decision framework</strong> — Clear grading system helps the AI make consistent calls</li>
</ul>

<h3>Exercise</h3>
<p>Think about an agent you'd want to build. Write a SOUL.md for it with a core identity, 5+ rules, and a decision-making framework.</p>`,
                },
                {
                  title: "AGENTS.md — Autonomous Task Cycles",
                  slug: "agents-md-task-cycles",
                  order: 1,
                  duration: 15,
                  content: `<h2>Defining What the Agent Does Autonomously</h2>
<p><code>AGENTS.md</code> is the playbook. It defines the exact sequences of actions the agent performs on its own, without human intervention.</p>

<h3>The Scrape Cycle (every 30 minutes)</h3>
<pre><code>1. Check spend via spend-tracker — if over 80% of cap, switch to watchlist-only
2. Run pokemon-scraper skill — scrape eBay for all watchlist cards and broad terms
3. Run card-analyzer skill — analyze any new ungraded listings with AI
4. Run deal-alerts skill — send Telegram alerts for deals above minimum discount
5. Log a cycle summary: listings found, new deals, time taken, API cost</code></pre>

<h3>The Outreach Cycle (daily at 10am)</h3>
<pre><code>1. Check spend via spend-tracker — skip if over budget
2. Run email-outreach skill — email all eligible contacts (respecting cooldowns)
3. Run voice-outreach skill — call eligible contacts (business hours only)
4. Send outreach summary via deal-alerts</code></pre>

<h3>Error Handling</h3>
<pre><code>- If any skill fails during a cycle, log the error, send Telegram alert, continue
- If more than 5 errors within 10 minutes, pause all cycles and alert
- Never crash — always catch, log, alert, and continue</code></pre>

<h3>Why This Structure Works</h3>
<ul>
<li><strong>Sequential steps</strong> — Each cycle has a clear order of operations</li>
<li><strong>Budget checks first</strong> — Always check spend before doing expensive work</li>
<li><strong>Graceful degradation</strong> — Over budget? Switch to watchlist-only, don't stop</li>
<li><strong>Error isolation</strong> — One failed skill doesn't kill the whole cycle</li>
<li><strong>Circuit breaker</strong> — Too many errors? Pause and alert instead of spiraling</li>
</ul>`,
                },
                {
                  title: "openclaw.json — Cron Schedules and Skills",
                  slug: "openclaw-json-config",
                  order: 2,
                  duration: 10,
                  content: `<h2>The Master Configuration File</h2>
<p><code>openclaw.json</code> ties everything together. It tells OpenClaw which skills to load, what model to use, and when to run autonomous tasks.</p>

<h3>Skills Configuration</h3>
<p>Each skill can be toggled on or off independently:</p>
<pre><code>"skills": {
  "entries": {
    "pokemon-scraper": { "enabled": true },
    "tcg-price-check": { "enabled": true },
    "card-analyzer": { "enabled": true },
    "deal-alerts": { "enabled": true },
    "email-outreach": { "enabled": true },
    "voice-outreach": { "enabled": true },
    "watchlist-manager": { "enabled": true },
    "spend-tracker": { "enabled": true },
    "agent-dashboard": { "enabled": true }
  }
}</code></pre>

<h3>Cron Schedules</h3>
<pre><code>"crons": {
  "scrape-cycle":    { "schedule": "*/30 * * * *" },
  "outreach-cycle":  { "schedule": "0 10 * * *"   },
  "daily-summary":   { "schedule": "0 20 * * *"   },
  "database-backup": { "schedule": "0 3 * * *"    },
  "cloud-sync":      { "schedule": "*/5 * * * *"  }
}</code></pre>

<h3>Cron Schedule Reference</h3>
<pre><code>*/30 * * * *    Every 30 minutes
0 10 * * *      Daily at 10:00 AM
0 20 * * *      Daily at 8:00 PM
0 3 * * *       Daily at 3:00 AM
*/5 * * * *     Every 5 minutes</code></pre>

<h3>Gateway Security</h3>
<p>The <code>gateway.bind: "loopback"</code> setting means the agent's API can only be accessed from localhost — not from the network. This is a critical security measure for agents running on remote hardware.</p>`,
                },
              ],
            },
          },
          {
            title: "Building the Skills",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Writing SKILL.md Files",
                  slug: "writing-skill-md-files",
                  order: 0,
                  duration: 15,
                  content: `<h2>How to Write OpenClaw Skills</h2>
<p>Each skill in the <code>/skills</code> directory has a single <code>SKILL.md</code> file that tells the agent what it can do and how.</p>

<h3>Anatomy of a SKILL.md</h3>
<pre><code>---
name: pokemon-scraper
description: Scrape Pokemon card listings from eBay and other marketplaces.
metadata:
  openclaw:
    requires:
      bins: ["node"]
---

# Pokemon Card Scraper

## Tools
- eBay search: node tools/scraper-engine/ebay-cli.js search "query" --max-price 500
- Database insert: node tools/db/cli.js insert-listing 'JSON'
- TCG price check: node tools/scraper-engine/tcg-cli.js lookup "card name"

## Instructions
1. Load the watchlist from config/watchlist.json
2. For each card, run an eBay search
3. Cross-reference prices with TCGPlayer
4. Insert results into the database
5. Log a summary

## Rules
- Never scrape more than 3 pages per query
- Always respect rate limits (1 request per 3 seconds)
- Always deduplicate via the database</code></pre>

<h3>The Four Sections</h3>
<ul>
<li><strong>Frontmatter</strong> — Name, description, and system requirements</li>
<li><strong>Tools</strong> — Exact CLI commands the agent can run</li>
<li><strong>Instructions</strong> — Step-by-step guide for using the skill</li>
<li><strong>Rules</strong> — Hard constraints the agent must follow</li>
</ul>

<h3>Tips</h3>
<ul>
<li>Always show exact command syntax — don't make the agent guess</li>
<li>Include example output so the agent knows what to expect</li>
<li>List rules as concrete constraints, not vague guidelines</li>
<li>Keep instructions sequential and numbered</li>
</ul>`,
                },
                {
                  title: "The eBay Scraper Tool",
                  slug: "ebay-scraper-tool",
                  order: 1,
                  duration: 20,
                  content: `<h2>Building the Web Scraper</h2>
<p>The eBay scraper uses Puppeteer for headless browser automation with built-in rate limiting and retry logic.</p>

<h3>Core Scraping Function</h3>
<pre><code>const puppeteer = require('puppeteer');

async function scrapeEbay({ query, maxPrice, maxPages = 3 }) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);

  for (let pageNum = 1; pageNum &lt;= maxPages; pageNum++) {
    const params = new URLSearchParams({
      _nkw: query,
      LH_BIN: '1',      // Buy It Now only
      _sop: '15',        // Sort by price + shipping lowest
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const listings = await page.evaluate(() =&gt; {
      const items = [];
      document.querySelectorAll('.s-item').forEach(item =&gt; {
        const title = item.querySelector('.s-item__title')?.textContent;
        const price = item.querySelector('.s-item__price')?.textContent;
        const link = item.querySelector('a')?.href;
        items.push({ card_name: title, price, url: link });
      });
      return items;
    });
  }

  await browser.close();
  return allListings;
}</code></pre>

<h3>Key Design Decisions</h3>
<ul>
<li><strong>Headless Chrome</strong> — Required for dynamic eBay pages that use JS rendering</li>
<li><strong>Buy It Now only</strong> — Auctions have unpredictable final prices</li>
<li><strong>Rate limiting</strong> — 1 request per 3 seconds to avoid IP bans</li>
<li><strong>Retry logic</strong> — Exponential backoff (3s, 9s, 27s) on failures</li>
<li><strong>Max 3 pages</strong> — Diminishing returns beyond page 3</li>
</ul>

<h3>The Rate Limiter</h3>
<pre><code>const PQueue = require('p-queue').default;

const scraperQueue = new PQueue({
  concurrency: 1,
  interval: 3000,
  intervalCap: 1
});</code></pre>
<p>Every request goes through this queue — max 1 request every 3 seconds.</p>`,
                },
                {
                  title: "AI Card Analysis with Claude",
                  slug: "ai-card-analysis",
                  order: 2,
                  duration: 15,
                  content: `<h2>Using Claude to Analyze Deals</h2>
<p>The card analyzer takes raw listing data and asks Claude to evaluate each deal for legitimacy, value, and red flags.</p>

<h3>The Analysis Prompt</h3>
<pre><code>Analyze this Pokemon card listing:
Card: Charizard Base Set Holo
Price: $280.00
TCG Market Price: $400.00
Condition: Near Mint
Seller: pokemon_collector_99
Discount: 30%

Evaluate:
1. Is this a legitimate listing?
2. Deal grade: must-buy, good-deal, fair, overpriced, or suspicious
3. Any concerns about condition or seller?
4. Buy recommendation (yes/no/caution)

Respond in JSON format.</code></pre>

<h3>Deal Grading System</h3>
<ul>
<li><strong>must-buy</strong> — Over 30% below market, legitimate seller</li>
<li><strong>good-deal</strong> — 15-30% below market, worth considering</li>
<li><strong>fair</strong> — Within 15% of market price</li>
<li><strong>overpriced</strong> — Above market price</li>
<li><strong>suspicious</strong> — Red flags detected (too good to be true, new seller, stock photos)</li>
</ul>

<h3>Cost Control</h3>
<p>Each analysis costs roughly $0.003-0.005 with Claude Sonnet. At 100 listings per cycle, that's about $0.50 per scrape. The spend tracker monitors this and skips AI analysis if the budget is running low.</p>`,
                },
                {
                  title: "Telegram Alerts and Bot Commands",
                  slug: "telegram-alerts-bot",
                  order: 3,
                  duration: 15,
                  content: `<h2>Real-Time Notifications via Telegram</h2>
<p>The Telegram integration sends deal alerts and receives commands to control the agent.</p>

<h3>Alert Format</h3>
<pre><code>🃏 NEW DEAL FOUND

Card: Charizard Base Set Holo
Price: $280.00 (TCG Market: $400)
Discount: 30% off
Grade: must-buy ✅
Seller: pokemon_collector_99
Condition: Near Mint

🔗 View on eBay: [link]</code></pre>

<h3>Bot Commands</h3>
<ul>
<li><code>/status</code> — Agent uptime, last scrape time, error count</li>
<li><code>/deals</code> — Recent deals found today</li>
<li><code>/watchlist</code> — Current watchlist cards</li>
<li><code>/spend</code> — Today's API spend breakdown</li>
<li><code>/help</code> — List all commands</li>
</ul>

<h3>Setup</h3>
<ol>
<li>Message <code>@BotFather</code> on Telegram and create a new bot</li>
<li>Copy the bot token to your .env file</li>
<li>Message <code>@userinfobot</code> to get your chat ID</li>
<li>Add the chat ID to your .env file</li>
</ol>`,
                },
                {
                  title: "Email and Voice Outreach",
                  slug: "email-voice-outreach",
                  order: 4,
                  duration: 15,
                  content: `<h2>Automated Seller Outreach</h2>
<p>The agent reaches out to card shops and sellers through AI-personalized email and voice calls.</p>

<h3>Email Outreach (Resend)</h3>
<p>Claude generates personalized emails for each contact based on their business type and your watchlist interests. Emails are sent via the Resend API.</p>

<h3>Voice Outreach (Bland.ai)</h3>
<p>For contacts with phone numbers, the agent makes AI-powered calls during business hours only. Calls are limited to 2 minutes and transcripts are analyzed afterward.</p>

<h3>Safety Controls</h3>
<ul>
<li><strong>Cooldown periods</strong> — Never contact the same seller twice within the configured window</li>
<li><strong>Daily limits</strong> — Maximum emails and calls per day</li>
<li><strong>Business hours only</strong> — Voice calls restricted to 9am-5pm</li>
<li><strong>Opt-out tracking</strong> — Mark contacts who don't want further contact</li>
</ul>`,
                },
              ],
            },
          },
          {
            title: "Database, Dashboard & Deployment",
            order: 3,
            lessons: {
              create: [
                {
                  title: "SQLite Database Layer",
                  slug: "sqlite-database-layer",
                  order: 0,
                  duration: 12,
                  content: `<h2>Storing Data Locally with SQLite</h2>
<p>The agent uses SQLite for zero-configuration local storage — no database server needed.</p>

<h3>Why SQLite?</h3>
<ul>
<li>No setup — works out of the box</li>
<li>Single file — easy to backup and move</li>
<li>Fast for reads — perfect for a single-agent workload</li>
<li>Portable — moves with the agent to any hardware</li>
</ul>

<h3>Tables</h3>
<pre><code>listings       — Every card listing found
price_history  — Price changes over time
outreach_log   — Emails sent, calls made
spend_log      — API costs per service per day
deal_grades    — AI analysis results</code></pre>

<h3>Deduplication</h3>
<p>The database automatically deduplicates listings by URL. If the same listing appears in two scrape cycles, it updates the existing record instead of creating a duplicate. This prevents alert spam.</p>`,
                },
                {
                  title: "Deployment to Isolated Hardware",
                  slug: "deployment-isolated-hardware",
                  order: 1,
                  duration: 15,
                  content: `<h2>Running the Agent on Its Own Machine</h2>
<p>For production use, the agent runs on isolated hardware — a cheap VPS, a Raspberry Pi, or any dedicated machine.</p>

<h3>First-Time Setup</h3>
<pre><code>bash deploy/setup.sh</code></pre>
<p>This installs Node.js, Git, Chromium, and OpenClaw. Then clones the repo and walks you through configuration.</p>

<h3>Security Hardening</h3>
<pre><code>bash deploy/harden.sh</code></pre>
<p>Configures UFW firewall, SSH key-only auth, fail2ban, dedicated system user, and automatic security updates.</p>

<h3>Starting the Agent</h3>
<pre><code>openclaw onboard --install-daemon
openclaw gateway start</code></pre>
<p>The agent now runs 24/7: scraping every 30 min, outreach at 10am, summary at 8pm, backup at 3am.</p>

<h3>Updating</h3>
<pre><code>bash deploy/update.sh</code></pre>
<p>Pulls latest from GitHub, installs dependencies, restarts OpenClaw.</p>`,
                },
                {
                  title: "Course Recap and Next Steps",
                  slug: "recap-next-steps",
                  order: 2,
                  duration: 8,
                  content: `<h2>What You've Learned</h2>
<ul>
<li><strong>SOUL.md</strong> defines identity and safety rails</li>
<li><strong>AGENTS.md</strong> defines autonomous task cycles</li>
<li><strong>openclaw.json</strong> ties skills, model, and cron schedules together</li>
<li><strong>Skills are modular</strong> — each SKILL.md is self-contained</li>
<li><strong>Tools are the engine</strong> — Regular Node.js code called via CLI</li>
<li><strong>Error handling is critical</strong> — Autonomous agents must never crash</li>
<li><strong>Spend tracking is essential</strong> — Always cap your API costs</li>
</ul>

<h3>Challenge: Build Your Own Agent</h3>
<ol>
<li><strong>Job Listing Hunter</strong> — Scrape job boards, analyze with AI, alert via Telegram</li>
<li><strong>Stock/Crypto Monitor</strong> — Track prices, analyze trends, send alerts</li>
<li><strong>Content Aggregator</strong> — Scrape RSS feeds, summarize with AI, email digest</li>
<li><strong>Competitor Price Tracker</strong> — Monitor competitor pricing, alert on changes</li>
</ol>
<p>Start with SOUL.md, then AGENTS.md, then build skills one at a time.</p>

<h3>Resources</h3>
<ul>
<li><a href="/uploads/files/Pokemon-Scraper-main.zip" download>Download full source code</a></li>
<li>OpenClaw documentation: openclaw.com/docs</li>
<li>Puppeteer docs: pptr.dev</li>
</ul>`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Created course:", course.id, course.title);

  // Enroll admin
  const user = await prisma.user.findUnique({
    where: { email: "chase@blokblokstudio.com" },
  });
  if (user) {
    await prisma.enrollment.create({
      data: { userId: user.id, courseId: course.id },
    });
    console.log("Enrolled admin in new course");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
