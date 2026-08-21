/**
 * English content for the six solution pages. Mirrors soluciones.js field for
 * field — see that file for why the structure and block order are fixed.
 */

export const SOLUCION_CONTENIDO = {

  'scale-ai-beyond-pilots': {
    q: 'Do your pilots never scale?',
    answer:
      'If your prototypes work in a demo but not in operation, you need to identify what’s missing around the technology before scaling.',
    signals: [
      'No operational owner exists after the pilot.',
      'The real workflow didn’t change.',
      'Data, integrations or controls depend on manual work.',
      'Users try the solution but don’t adopt it.',
      'There’s no baseline or scale-readiness criteria.',
    ],
    problem:
      'The pilot doesn’t fail because of the model. It fails because it was built alongside the real work instead of inside it: no one owns the result, the process stayed the same, and there’s no measure to decide against.',
    value:
      'We assess the pilot as part of a People, Data, Agents, Products and Operations system; decide whether it should stop, be redesigned or become a capability; then build the conditions for adoption and scale.',
    tools: ['Inside Readiness Index™', 'Agentic Workflow Blueprint™', 'Embed Scorecard™', 'Scale Readiness Gate™'],
    result: 'An informed decision and, where warranted, a capability ready to operate.',
    engagement: 'BECOME DISCOVER™ → BECOME EMBED™',
    engagementWhy:
      'The diagnosis is strategic and the solution is operational. Skipping the first usually produces a second, equally isolated pilot.',
    cta: 'Turn the pilot into a capability',
  },

  'prepare-teams-for-ai': {
    q: 'Need to prepare your teams to work with AI?',
    answer:
      'If your teams already use AI tools with no shared method, that scattered use has to become a common way of working, with criteria and controls.',
    signals: [
      'Everyone uses AI their own way, with uneven results.',
      'General training happened and day-to-day work didn’t change.',
      'Nobody knows what a tool can reasonably be asked to do, and what it can’t.',
      'What works in one team never reaches the others.',
      'There’s no shared standard for what counts as an acceptable output.',
    ],
    problem:
      'A generic course teaches a tool; the work doesn’t change because nobody looked at the team’s real process. Capability appears when each team works on its own documents, its own cases and its own constraints — and keeps something reusable.',
    value:
      'We start from the work each area does today: we map its process, pick the priority cases, work on its real documents, and leave assistants, templates and validation criteria that stay in the company.',
    tools: ['Applied Workflow Canvas', 'Adoption Scorecard', 'Inside Readiness Index™'],
    result: 'Teams working with AI on their own processes, with a reusable library and shared quality criteria.',
    engagement: 'BECOME NOW™',
    engagementWhy:
      'It’s the service built for this. If deciding where to invest as a company is also missing, Discover orders that decision before or alongside it.',
    cta: 'Design your team’s program',
  },

  'redesign-critical-workflows': {
    q: 'Need to redesign a critical workflow?',
    answer:
      'If you’re looking to improve a critical operation, you need to redesign the workflow end-to-end — not automate isolated tasks.',
    signals: [
      'Multiple handoffs and rework exist.',
      'Decisions depend on fragmented information.',
      'Specialists spend time on repetitive tasks.',
      'Exceptions have no owner or consistent criteria.',
      'The process is slow, variable or hard to audit.',
    ],
    problem:
      'Automating a task inside a process that doesn’t change just moves the bottleneck. Time recovered in one step is lost in the next, because the decisions, the data and the exceptions stay exactly where they were.',
    value:
      'We redesign events, decisions, roles, agent tasks, data, exceptions, human oversight, controls and metrics as a single workflow; then we build and validate the priority capability.',
    tools: ['Inside Target State Canvas™', 'Agentic Workflow Blueprint™', 'Embed Scorecard™'],
    result: 'A faster, more consistent, controlled workflow capable of learning.',
    engagement: 'BECOME DISCOVER™ + BECOME EMBED™',
    engagementWhy:
      'The redesign needs a systems view, and the improvement is only real once the new workflow runs in production.',
    cta: 'Redesign the workflow',
  },

  'deploy-governed-ai-agents': {
    q: 'Want to build an agent or copilot?',
    answer:
      'We design the workflow before selecting the model. We define what the agent should do, which data and tools it can access, which LLM it needs, when human approval is required and how it will be evaluated before and after go-live. A solution may combine ChatGPT/OpenAI, Claude/Anthropic, Gemini/Google or other models, together with APIs, RAG, tool calling, MCP and enterprise integrations.',
    signals: [
      'The team knows the task, but not the operating model.',
      'It’s unclear what the agent decides and what the person keeps.',
      'Exception paths, permissions or quality criteria are missing.',
      'The prototype isn’t integrated into the real workflow.',
    ],
    problem:
      'An agent without an operating model is a demo with permissions. What decides its fate isn’t the quality of its answers, but who responds when it gets something wrong and what happens to the cases that don’t fit.',
    value:
      'We validate the blueprint, design human-in-the-loop oversight and controls, build and integrate the agent or copilot, support adoption, and measure trust, performance, control and value.',
    tools: ['Agentic Workflow Blueprint™', 'Embed Scorecard™', 'Scale Readiness Gate™'],
    result: 'An agent or copilot that participates in real work with explicit ownership.',
    engagement: 'BECOME EMBED™',
    engagementWhy:
      'Subject to readiness: if the opportunity doesn’t yet have a validatable blueprint, we first run a short readiness gate.',
    cta: 'Build the capability',
  },

  'build-ai-enabled-products': {
    q: 'Want to create an AI-native experience?',
    answer:
      'If you’re looking for a new experience for customers or collaborators, you need to design the value, the intelligent behavior and the operation that sustains it.',
    signals: [
      'The idea depends on AI, but its user value is still generic.',
      'The product experience doesn’t define trust, explanation or escalation.',
      'It’s unclear what data and knowledge make the experience possible.',
      'The team needs to validate desirability, feasibility and viability.',
    ],
    problem:
      'An AI-native experience isn’t designed as a screen with a model behind it. Intelligent behavior is part of the product: what it knows, what it explains, when it hands off control and who operates it in production.',
    value:
      'We connect product thesis, user journey, intelligence, data, agent behavior, controls and operational ownership; prototype, validate and build the scope that can prove real value.',
    tools: ['AI-Native Value Map™', 'Inside Target State Canvas™', 'Agentic Workflow Blueprint™', 'Embed Scorecard™'],
    result: 'A validated, embeddable AI-native product or service capability.',
    engagement: 'BECOME EMBED™ or the full sequence',
    engagementWhy:
      'If the product thesis is still open, BECOME DISCOVER™ closes it before we build.',
    cta: 'Design the new experience',
  },

  'measure-and-govern-ai-value': {
    q: 'Need to measure and govern AI value?',
    answer:
      'If you have to demonstrate results, reduce risk and clarify who owns each decision, you need to measure against a baseline and govern what is already running.',
    signals: [
      'Activity gets reported — users, pilots, licences — but not results.',
      'There’s no baseline, so any improvement is arguable.',
      'Nobody knows who answers for it when a system gets something wrong.',
      'Leadership needs to decide on investment from evidence, not demos.',
      'There are no criteria for what gets scaled and what gets stopped.',
    ],
    problem:
      'Without a baseline there is no improvement to prove, only opinions about a demo. And with no named owners, control becomes a document nobody applies. Measurement and governance aren’t admin work at the end: they’re what separates a capability from an expensive experiment.',
    value:
      'We define what value means in your case, measure the starting point, assign owners and a review cadence, and set the controls — human oversight, traceability, quality and escalation — that make the result hold.',
    tools: ['Embed Scorecard™', 'Scale Readiness Gate™', 'Inside Readiness Index™'],
    result: 'Measurement that survives a hard question, and a governance model with names rather than good intentions.',
    engagement: 'BECOME DISCOVER™ or BECOME EMBED™',
    engagementWhy:
      'If what’s missing is the criteria, it starts in Discover. If something is already running and what’s missing is measuring and governing it, it belongs inside Embed.',
    cta: 'Define how it gets measured',
  },
};

/* Orientation map for the hub. Same rows and order as soluciones.js. */
export const ORIENTATION = [
  { q: 'Do your pilots never scale?', happens: 'Isolated prototypes with no owner, integration or adoption.', need: 'A systemic diagnosis, a target state and a decision on what to scale.', rec: 'BECOME DISCOVER™ → BECOME EMBED™' },
  { q: 'Need to prepare your teams to work with AI?', happens: 'Everyone uses AI their own way, with uneven results.', need: 'A shared method built on the team’s real processes, with criteria and controls.', rec: 'BECOME NOW™' },
  { q: 'Need to redesign a critical workflow?', happens: 'A slow, fragmented or decision-heavy process.', need: 'End-to-end redesign with roles, agents, data and controls.', rec: 'BECOME DISCOVER™ + BECOME EMBED™' },
  { q: 'Want to introduce agents without losing control?', happens: 'There’s an idea or a concrete need, but no operating design.', need: 'Design, autonomy boundaries, human oversight, build and adoption.', rec: 'BECOME EMBED™' },
  { q: 'Want AI to become part of your value proposition?', happens: 'You’re looking for new value for customers or collaborators.', need: 'Product thesis, experience design, data and agent architecture, and validation.', rec: 'BECOME EMBED™ or the full sequence' },
  { q: 'Need to measure and govern AI value?', happens: 'Activity gets reported, but not results, and nobody answers for the decisions.', need: 'Baseline, owners, review cadence and controls.', rec: 'BECOME DISCOVER™ or BECOME EMBED™' },
];
