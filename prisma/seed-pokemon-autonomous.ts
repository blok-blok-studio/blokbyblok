import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const course = await prisma.course.create({
    data: {
      title: "Pokemon Autonomous Agents: Build AI That Plays",
      slug: "pokemon-autonomous-agents",
      description:
        "Build AI agents that play Pokemon games autonomously. Learn agentic AI by watching AI reason, plan, and battle — then build your own agent and battle your brother's. Covers perception loops, memory systems, multi-agent coordination, and the fundamentals of autonomous AI.",
      published: true,
      order: 2,
      modules: {
        create: [
          {
            title: "Welcome to AI Agents",
            order: 0,
            lessons: {
              create: [
                {
                  title: "What Are Autonomous AI Agents?",
                  slug: "what-are-autonomous-agents",
                  order: 0,
                  duration: 15,
                  content: `<h2>AI That Actually Does Things</h2>
<p>Most AI you've used is <strong>reactive</strong> — you ask a question, it answers. An <strong>autonomous agent</strong> is different. It observes the world, reasons about what to do, takes action, and learns from the results — all on its own.</p>

<h3>The Agent Loop</h3>
<p>Every autonomous agent follows the same core loop:</p>
<ol>
<li><strong>Perceive</strong> — Look at what's happening (read the screen, check sensors, get data)</li>
<li><strong>Think</strong> — Reason about what to do next (plan, strategize, decide)</li>
<li><strong>Act</strong> — Take an action (press a button, call an API, send a message)</li>
<li><strong>Remember</strong> — Store what happened for future decisions</li>
<li><strong>Repeat</strong></li>
</ol>

<h3>Why Pokemon?</h3>
<p>Pokemon is the <strong>perfect training ground</strong> for learning about AI agents because:</p>
<ul>
<li>You already know the rules — so you can focus on learning AI, not the problem domain</li>
<li>It requires <strong>long-term planning</strong> — you can't beat the game in one move</li>
<li>Battles require <strong>strategy under uncertainty</strong> — you don't know the opponent's full team</li>
<li>Navigation requires <strong>spatial reasoning</strong> — finding your way through maps and buildings</li>
<li>Resource management requires <strong>decision-making</strong> — when to heal, when to save, which Pokemon to use</li>
</ul>

<h3>Real-World Connections</h3>
<table>
<tr><th>Pokemon Agent Concept</th><th>Real-World AI Equivalent</th></tr>
<tr><td>Reading the game screen</td><td>Computer vision / sensor input</td></tr>
<tr><td>Choosing a move in battle</td><td>Decision-making under uncertainty</td></tr>
<tr><td>Remembering which routes you've explored</td><td>Memory and knowledge management</td></tr>
<tr><td>Planning how to beat a gym leader</td><td>Long-horizon task planning</td></tr>
<tr><td>Managing your team composition</td><td>Resource optimization</td></tr>
</table>`,
                },
                {
                  title: "Meet the Projects: Claude, GPT, and RL Agents",
                  slug: "meet-the-projects",
                  order: 1,
                  duration: 20,
                  content: `<h2>Famous Pokemon AI Projects</h2>
<p>Before we build our own, let's study what others have built. These projects represent three different approaches to autonomous agents.</p>

<h3>1. Claude Plays Pokemon (Anthropic)</h3>
<p>Anthropic launched a Twitch livestream where Claude 3.7 Sonnet plays Pokemon Red. The split-screen shows Claude's internal reasoning alongside the gameplay.</p>
<ul>
<li><strong>How it works:</strong> Claude receives a screenshot + game state data from RAM, then outputs button presses</li>
<li><strong>Key innovation:</strong> A self-managed knowledge base — Claude writes its own notes that persist across thousands of actions</li>
<li><strong>Watch it:</strong> twitch.tv/claudeplayspokemon</li>
</ul>

<h3>2. GPT Plays Pokemon FireRed</h3>
<p>An open-source project where GPT-5.2 completed the entire game with zero human input.</p>
<ul>
<li><strong>How it works:</strong> Reads game memory directly for structured state, uses long-term memory management</li>
<li><strong>Key innovation:</strong> The AI sets its own objectives and pathfinds across maps</li>
<li><strong>Source code:</strong> github.com/Clad3815/gpt-play-pokemon-firered</li>
</ul>

<h3>3. PokemonRedExperiments (Reinforcement Learning)</h3>
<p>Trained AI agents over 50,000+ simulated hours to play Pokemon Red purely from screen pixels.</p>
<ul>
<li><strong>How it works:</strong> No language model — the agent learns from trial and error across thousands of parallel game instances</li>
<li><strong>Key innovation:</strong> Reward shaping — the agent gets points for exploring new areas, leveling up, and beating gyms</li>
<li><strong>Source code:</strong> github.com/PWhiddy/PokemonRedExperiments</li>
</ul>

<h3>LLM Agents vs RL Agents</h3>
<table>
<tr><th>LLM Agents (Claude/GPT)</th><th>RL Agents (Neural Networks)</th></tr>
<tr><td>Understand language and can explain their reasoning</td><td>Learn from trial and error, no language understanding</td></tr>
<tr><td>Work immediately (zero-shot)</td><td>Need thousands of hours of training</td></tr>
<tr><td>Cost money per action (API calls)</td><td>Cost compute upfront for training</td></tr>
<tr><td>Can use external knowledge</td><td>Only learn from experience</td></tr>
</table>

<h3>Activity: Watch and Journal</h3>
<p>Watch the Claude Plays Pokemon stream for 15 minutes. In your journal, answer:</p>
<ol>
<li>What is Claude's current objective?</li>
<li>What decisions did it make well?</li>
<li>Where did it get stuck or make mistakes?</li>
<li>What would you have done differently?</li>
</ol>`,
                },
                {
                  title: "Setting Up Your Agent Lab",
                  slug: "setting-up-agent-lab",
                  order: 2,
                  duration: 15,
                  content: `<h2>Your Agent Development Environment</h2>
<p>Let's set up everything you need to build and run Pokemon AI agents.</p>

<h3>What You'll Need</h3>
<ul>
<li><strong>Python 3.10+</strong> — Most Pokemon AI projects use Python</li>
<li><strong>Node.js 22+</strong> — For some projects and OpenClaw integration</li>
<li><strong>An API key</strong> — Claude (Anthropic) or GPT (OpenAI) for the LLM agent</li>
<li><strong>A Pokemon ROM</strong> — You'll need a legally obtained Pokemon Red/FireRed ROM file</li>
<li><strong>Git</strong> — For cloning projects and version control</li>
</ul>

<h3>Install the Pokemon Agent Platform</h3>
<p>We'll use the NousResearch pokemon-agent platform — it's the most beginner-friendly and works with any LLM:</p>
<pre><code>git clone https://github.com/NousResearch/pokemon-agent.git
cd pokemon-agent
pip install -e .</code></pre>

<h3>Install the Battle Simulator</h3>
<p>For building battle agents, we'll use Pokemon Showdown (no ROM needed):</p>
<pre><code>pip install poke-env</code></pre>
<p>Pokemon Showdown is a free, open-source battle simulator used by competitive players worldwide. It's perfect for training AI because battles are fast and text-based.</p>

<h3>Verify Your Setup</h3>
<pre><code>python -c "import poke_env; print('poke-env ready!')"</code></pre>`,
                },
              ],
            },
          },
          {
            title: "The Perception-Action Loop",
            order: 1,
            lessons: {
              create: [
                {
                  title: "How Agents See the World",
                  slug: "how-agents-see",
                  order: 0,
                  duration: 20,
                  content: `<h2>Perception: The Agent's Eyes</h2>
<p>An autonomous agent needs to understand its environment before it can act. In Pokemon, there are two ways an agent can "see":</p>

<h3>Method 1: Screenshot Analysis</h3>
<p>Take a screenshot of the game and send it to the LLM:</p>
<pre><code># Capture the game screen
screenshot = emulator.get_screenshot()

# Send to Claude with context
response = claude.messages.create(
    model="claude-sonnet-4-6",
    messages=[{
        "role": "user",
        "content": [
            {"type": "image", "source": screenshot},
            {"type": "text", "text": "What do you see? What should we do next?"}
        ]
    }]
)</code></pre>
<p>This is simple but expensive — every screenshot costs API tokens.</p>

<h3>Method 2: Memory Reading (RAM)</h3>
<p>Read the game's memory directly for structured data:</p>
<pre><code># Read structured data from game memory
state = {
    "location": emulator.read_memory(0xD35E),  # Map ID
    "player_x": emulator.read_memory(0xD362),
    "player_y": emulator.read_memory(0xD361),
    "pokemon_hp": emulator.read_memory(0xD16C),
    "badges": emulator.read_memory(0xD356),
}</code></pre>
<p>This is fast, cheap, and precise — but requires understanding the game's memory layout.</p>

<h3>Best Approach: Both!</h3>
<p>The best Pokemon agents combine both: RAM reading for precise game state, and occasional screenshots for visual understanding (especially in menus and new areas).</p>

<h3>Activity: Build a State Reader</h3>
<p>Using the pokemon-agent platform, write a function that reads the current game state and formats it as a prompt for Claude. Include location, team health, items, and badges.</p>`,
                },
                {
                  title: "Making Decisions: The Action System",
                  slug: "making-decisions",
                  order: 1,
                  duration: 20,
                  content: `<h2>Action: Turning Thoughts Into Button Presses</h2>
<p>Once the agent understands the game state, it needs to decide what to do and translate that into button presses.</p>

<h3>The Action Space</h3>
<p>In Pokemon, the agent has a small set of possible actions:</p>
<ul>
<li><strong>Directional:</strong> Up, Down, Left, Right</li>
<li><strong>Buttons:</strong> A (confirm), B (cancel), Start, Select</li>
<li><strong>Macros:</strong> "Navigate to coordinates (x, y)" — higher-level actions built from sequences</li>
</ul>

<h3>From Reasoning to Action</h3>
<pre><code># The agent's decision-making prompt
prompt = f"""
Current state:
- Location: Pewter City Gym
- Team: Pikachu (HP: 35/35), Pidgey (HP: 28/28)
- Badges: 0/8
- Opponent: Brock's Geodude (Rock/Ground type)

Available actions: [A, B, Up, Down, Left, Right, Start]

What should we do? Think step by step, then output a single action.
"""

# Claude responds with reasoning + action
# "Geodude is Rock/Ground. Pikachu's electric moves won't work.
#  I should switch to Pidgey and use Gust. Action: navigate_to_pokemon_menu"</code></pre>

<h3>The Reasoning Gap</h3>
<p>This is where agents get interesting. Claude's extended thinking shows the full reasoning chain before choosing an action. Sometimes it makes brilliant strategic decisions. Sometimes it gets stuck in a loop pressing the same button. Understanding <em>why</em> is the key to building better agents.</p>

<h3>Activity: Decision Logger</h3>
<p>Modify the agent to log every decision it makes: the game state, the reasoning, and the chosen action. After 50 actions, review the log together. Where did the agent reason well? Where did it fail?</p>`,
                },
                {
                  title: "Memory: Agents That Remember",
                  slug: "agent-memory-systems",
                  order: 2,
                  duration: 20,
                  content: `<h2>Memory: The Secret Weapon</h2>
<p>Without memory, an agent forgets everything between actions. It would wander the same routes, fight the same battles, and make the same mistakes forever. Memory is what turns a reactive chatbot into an autonomous agent.</p>

<h3>Short-Term Memory (Context Window)</h3>
<p>The LLM's context window holds recent actions and observations. This is like your working memory — what you're actively thinking about right now.</p>

<h3>Long-Term Memory (Knowledge Base)</h3>
<p>Claude Plays Pokemon pioneered a self-managed knowledge base — a persistent text file the agent can read and write to:</p>
<pre><code># The agent maintains its own notes
knowledge_base = """
## Explored Areas
- Pallet Town: Fully explored, got starter Pokemon
- Route 1: Safe path, low-level Rattata and Pidgey
- Viridian City: Visited, Gym locked (need Earth Badge)

## Current Objectives
1. Train team to level 12 before Pewter Gym
2. Catch a Grass or Water type for Brock

## Battle Notes
- Brock uses Rock types — Electric is useless
- Need Grass, Water, or Fighting moves
"""</code></pre>

<h3>Why This Matters</h3>
<p>This is the same pattern used in real-world AI agents:</p>
<ul>
<li><strong>RAG (Retrieval-Augmented Generation)</strong> — Looking up information from a knowledge base before answering</li>
<li><strong>Agent scratchpads</strong> — Agents writing notes to themselves for future reference</li>
<li><strong>OpenClaw's memory system</strong> — Persistent Markdown files the agent manages</li>
</ul>

<h3>Activity: Build a Knowledge Base</h3>
<p>Implement a simple knowledge base for your agent:</p>
<ol>
<li>Create a text file the agent can read at the start of each action</li>
<li>Let the agent write updates to the file after important events (new area, gym battle, evolution)</li>
<li>Include sections for: explored areas, objectives, battle notes, team status</li>
</ol>`,
                },
              ],
            },
          },
          {
            title: "Build Your Battle Agent",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Pokemon Showdown and poke-env",
                  slug: "pokemon-showdown-setup",
                  order: 0,
                  duration: 20,
                  content: `<h2>Your Battle Arena</h2>
<p>Pokemon Showdown is a free, open-source competitive battle simulator. Combined with the poke-env Python library, it's the fastest way to build and test battle agents.</p>

<h3>Why Showdown?</h3>
<ul>
<li><strong>Text-based</strong> — No screen reading needed, battles are pure data</li>
<li><strong>Fast</strong> — Battles complete in seconds, not hours</li>
<li><strong>Competitive</strong> — Play against real humans or other bots</li>
<li><strong>Free</strong> — No ROM, no API costs for the simulator itself</li>
</ul>

<h3>How poke-env Works</h3>
<pre><code>from poke_env.player import Player

class MyAgent(Player):
    def choose_move(self, battle):
        # battle.available_moves — moves you can use
        # battle.available_switches — Pokemon you can switch to
        # battle.opponent_active_pokemon — what you're fighting

        # Your AI logic goes here!
        return self.choose_random_move(battle)</code></pre>

<h3>Battle State</h3>
<p>Every turn, your agent receives:</p>
<ul>
<li>Your active Pokemon (HP, status, moves, types)</li>
<li>Opponent's active Pokemon (HP, status, type — moves are hidden!)</li>
<li>Your bench (available switches)</li>
<li>Weather, terrain, and field effects</li>
</ul>

<h3>Start Your First Battle</h3>
<pre><code>from poke_env.player import RandomPlayer

# Create two random agents and battle them
player1 = RandomPlayer()
player2 = RandomPlayer()

await player1.battle_against(player2, n_battles=10)
print(f"Player 1 wins: {player1.n_won_battles}")</code></pre>`,
                },
                {
                  title: "Building an LLM Battle Agent",
                  slug: "llm-battle-agent",
                  order: 1,
                  duration: 30,
                  content: `<h2>Your AI-Powered Battle Agent</h2>
<p>Now let's connect Claude to Pokemon Showdown. Your agent will analyze the battle state, reason about type matchups and strategy, and choose moves.</p>

<h3>The LLM Agent Class</h3>
<pre><code>from poke_env.player import Player
import anthropic

class ClaudeBattleAgent(Player):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.client = anthropic.Anthropic()
        self.battle_log = []

    def choose_move(self, battle):
        # Build the battle state prompt
        state = self.format_battle_state(battle)
        moves = self.format_available_moves(battle)

        prompt = f"""You are a competitive Pokemon battle AI.

Current battle state:
{state}

Available moves:
{moves}

Choose the best move. Consider:
1. Type effectiveness (super effective = 2x damage)
2. Your Pokemon's stats vs opponent's
3. Status moves and their strategic value
4. When to switch vs when to attack

Respond with just the move name."""

        response = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=100,
            messages=[{"role": "user", "content": prompt}]
        )

        chosen_move = response.content[0].text.strip()
        return self.find_move(battle, chosen_move)</code></pre>

<h3>Type Knowledge</h3>
<p>One key insight from the PokeLLMon research: LLMs sometimes hallucinate type matchups. To fix this, we can inject a type chart directly into the prompt — this is called <strong>Knowledge-Augmented Generation</strong>.</p>

<h3>Activity: Build and Battle</h3>
<p>Build your own ClaudeBattleAgent. Then:</p>
<ol>
<li>Battle it against a RandomPlayer 10 times — what's the win rate?</li>
<li>Add type chart knowledge to the prompt — does the win rate improve?</li>
<li>Add battle history (last 5 moves) — does memory help?</li>
</ol>`,
                },
                {
                  title: "Agent vs Agent: Battle Your Brother",
                  slug: "agent-vs-agent-battle",
                  order: 2,
                  duration: 25,
                  content: `<h2>The Ultimate Test: Agent vs Agent</h2>
<p>Each of you has been building your own battle agent. Now it's time to battle each other's creations.</p>

<h3>The Competition</h3>
<p>Run a tournament: your agent vs your brother's agent, best of 20 battles. The winner has built the smarter AI.</p>
<pre><code># Battle two custom agents
from your_agent import YourAgent
from brother_agent import BrotherAgent

agent_1 = YourAgent(battle_format="gen1randombattle")
agent_2 = BrotherAgent(battle_format="gen1randombattle")

await agent_1.battle_against(agent_2, n_battles=20)

print(f"Agent 1 wins: {agent_1.n_won_battles}")
print(f"Agent 2 wins: {agent_2.n_won_battles}")</code></pre>

<h3>Strategies to Try</h3>
<ul>
<li><strong>Better prompting</strong> — More detailed reasoning instructions</li>
<li><strong>Battle memory</strong> — Remember what the opponent's Pokemon have done</li>
<li><strong>Prediction</strong> — Anticipate switches and adjust strategy</li>
<li><strong>Anti-panic</strong> — PokeLLMon found that agents "panic switch" against strong opponents. Add logic to stay calm</li>
<li><strong>Model choice</strong> — Try Claude Opus vs Sonnet vs Haiku. Does a smarter model always win?</li>
</ul>

<h3>Track Your Results</h3>
<p>Create a scorecard tracking:</p>
<ul>
<li>Win rate per matchup</li>
<li>Which Pokemon/moves your agent uses most</li>
<li>Common failure modes (panic switching, bad type matchups)</li>
<li>API cost per battle (cheaper is better if win rate is similar!)</li>
</ul>

<h3>Discuss</h3>
<ol>
<li>What strategy differences emerged between your agents?</li>
<li>Did either agent develop "habits" or patterns?</li>
<li>What would you do differently if you rebuilt from scratch?</li>
</ol>`,
                },
              ],
            },
          },
          {
            title: "Multi-Agent Systems",
            order: 3,
            lessons: {
              create: [
                {
                  title: "The Planner-Executor-Critic Pattern",
                  slug: "planner-executor-critic",
                  order: 0,
                  duration: 25,
                  content: `<h2>Agents Working Together</h2>
<p>The most advanced Pokemon AI projects don't use a single agent — they use a <strong>team of specialized agents</strong> that collaborate. This is the same pattern used in real-world AI systems like CrewAI and AutoGen.</p>

<h3>The Three-Agent Pattern</h3>
<p>The PokéAI research paper introduced three agents working together:</p>
<ol>
<li><strong>Planning Agent</strong> — Sets high-level goals ("We need to beat Brock's gym. Our team is weak to Rock. Objective: find and train a Water-type Pokemon.")</li>
<li><strong>Execution Agent</strong> — Carries out the plan step by step ("Navigate to Route 4, encounter wild Pokemon, catch a Squirtle.")</li>
<li><strong>Critique Agent</strong> — Evaluates whether the plan is working ("We've been grinding for 20 minutes but haven't found a Water-type. The plan should be updated.")</li>
</ol>

<h3>Why Multiple Agents?</h3>
<p>A single agent trying to do everything gets overwhelmed. By splitting responsibilities:</p>
<ul>
<li>The Planner focuses on <strong>strategy</strong> (what to do)</li>
<li>The Executor focuses on <strong>tactics</strong> (how to do it)</li>
<li>The Critic focuses on <strong>evaluation</strong> (is it working?)</li>
</ul>
<p>This achieved an <strong>80.8% win rate</strong> in wild encounters — much higher than single-agent approaches.</p>

<h3>Real-World Applications</h3>
<p>This pattern is everywhere in production AI:</p>
<ul>
<li><strong>Software development:</strong> Planner designs the architecture, Executor writes code, Critic runs tests</li>
<li><strong>Customer support:</strong> Router identifies the issue, Specialist handles it, QA checks the resolution</li>
<li><strong>Content creation:</strong> Researcher gathers info, Writer drafts, Editor refines</li>
</ul>

<h3>Activity: Design Your Multi-Agent System</h3>
<p>With your brother, design a multi-agent Pokemon system on paper:</p>
<ol>
<li>One of you designs the Planner agent (what instructions, what information does it need?)</li>
<li>The other designs the Executor agent</li>
<li>Together, design the Critic agent that evaluates both</li>
<li>Draw the communication flow between them</li>
</ol>`,
                },
                {
                  title: "Building a Multi-Agent Pokemon System",
                  slug: "building-multi-agent",
                  order: 1,
                  duration: 30,
                  content: `<h2>Hands-On: Implement the Pattern</h2>
<p>Let's build a simple multi-agent system for Pokemon battles where one brother builds the Planner and the other builds the Executor.</p>

<h3>The Planner Agent</h3>
<pre><code>class PlannerAgent:
    """Analyzes the battle and creates a strategy."""

    def create_plan(self, battle_state, battle_history):
        prompt = f"""You are a Pokemon battle strategist.

Battle state: {battle_state}
Recent history: {battle_history}

Create a battle plan with:
1. Assessment: Who has the advantage and why?
2. Strategy: What's our best approach?
3. Priority moves: Which moves should we use and in what order?
4. Switch triggers: When should we switch Pokemon?

Output a structured plan."""

        return self.client.messages.create(
            model="claude-sonnet-4-6",
            messages=[{"role": "user", "content": prompt}]
        )</code></pre>

<h3>The Executor Agent</h3>
<pre><code>class ExecutorAgent:
    """Takes the Planner's strategy and picks specific moves."""

    def choose_action(self, plan, battle):
        prompt = f"""You are a Pokemon battle executor.

The strategist says: {plan}

Available moves: {self.format_moves(battle)}
Available switches: {self.format_switches(battle)}

Based on the strategy, choose ONE specific action.
Output just the action name."""

        return self.client.messages.create(
            model="claude-haiku-4-5",  # Cheaper model for simple execution
            messages=[{"role": "user", "content": prompt}]
        )</code></pre>

<h3>The Collaboration</h3>
<p>One brother builds and tunes the Planner. The other builds and tunes the Executor. Then combine them and battle against your single-agent versions. Is the team smarter than one agent alone?</p>

<h3>Cost Optimization Trick</h3>
<p>Notice the Executor uses Haiku (cheap, fast) while the Planner uses Sonnet (smart, more expensive). Strategic model routing — use expensive models for hard thinking, cheap models for simple execution.</p>`,
                },
                {
                  title: "Course Project: The Pokemon AI Championship",
                  slug: "pokemon-ai-championship",
                  order: 2,
                  duration: 20,
                  content: `<h2>Final Project: Tournament Time</h2>
<p>It's time to put everything together. Each of you builds your best possible Pokemon battle agent, then we run a championship tournament.</p>

<h3>Requirements</h3>
<p>Your final agent must include:</p>
<ul>
<li><strong>Battle reasoning</strong> — Type-aware move selection with Claude or GPT</li>
<li><strong>Memory</strong> — Track opponent patterns across turns</li>
<li><strong>Knowledge augmentation</strong> — Type chart, move data, or strategy guides injected into prompts</li>
<li><strong>Cost tracking</strong> — Log API costs per battle</li>
</ul>

<h3>Bonus Points</h3>
<ul>
<li>Multi-agent architecture (Planner + Executor)</li>
<li>Win rate tracking and visualization</li>
<li>Custom team selection strategy</li>
<li>Battle replay analysis — agent explains its decisions after the game</li>
</ul>

<h3>Tournament Format</h3>
<ol>
<li><strong>Round 1:</strong> Each agent vs RandomPlayer (baseline — should win easily)</li>
<li><strong>Round 2:</strong> Each agent vs MaxDamagePlayer (always picks highest damage move)</li>
<li><strong>Round 3:</strong> Agent vs Agent — best of 50 battles</li>
<li><strong>Round 4:</strong> Present your agent — explain your strategy, show your code, discuss what you learned</li>
</ol>

<h3>Presentation Guide</h3>
<p>Each of you presents for 10 minutes:</p>
<ol>
<li>What strategy did your agent use?</li>
<li>What was your biggest challenge?</li>
<li>Show one battle replay with your agent's reasoning visible</li>
<li>What would you build next if you had more time?</li>
<li>How do the concepts you learned apply to real-world AI agents?</li>
</ol>

<h3>What You've Learned</h3>
<table>
<tr><th>Concept</th><th>What You Built</th></tr>
<tr><td>Perception-Action Loop</td><td>Reading game state, outputting moves</td></tr>
<tr><td>Agent Memory</td><td>Knowledge bases, battle history tracking</td></tr>
<tr><td>Prompt Engineering</td><td>Crafting prompts that produce good battle decisions</td></tr>
<tr><td>Multi-Agent Systems</td><td>Planner + Executor + Critic pattern</td></tr>
<tr><td>RAG (Knowledge Augmentation)</td><td>Type charts injected into prompts</td></tr>
<tr><td>Cost Optimization</td><td>Model routing (Opus for planning, Haiku for execution)</td></tr>
<tr><td>Evaluation & Benchmarking</td><td>Win rates, tournament scoring</td></tr>
</table>

<p><strong>Congratulations.</strong> You didn't just learn about AI agents — you built them, battled them, and understood how they think. These same patterns power the autonomous systems being built at companies like Anthropic, OpenAI, and Google DeepMind. You're ahead of the curve.</p>`,
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
