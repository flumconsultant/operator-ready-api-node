/**
 * English content for the six use-case pages. Mirrors use-cases.js field for
 * field — see that file for why the structure and block order are fixed.
 */

export const USE_CASE_CONTENT = {
  'por-donde-empezar-con-ia': {
    q: 'Not sure where to start with AI?',
    answer:
      'If you’re looking for a shared direction to invest, prioritize and govern AI, you need an BECOME DISCOVER™.',
    signals: [
      'Every area proposes its own use cases.',
      'The executive committee doesn’t share an AI-native ambition.',
      'Technology receives demands with no single value criterion.',
      'Pilots exist, but there’s no portfolio or integrated business case.',
    ],
    problem:
      'The symptom is dispersion, but the cause is the absence of a company thesis that orders the decisions. Without a shared ambition, every initiative competes for budget on its own area’s argument, and none is measured against the same outcome.',
    value:
      'We align ambition and outcomes, assess readiness, identify value pools, prioritize capabilities and design the target operating model and roadmap.',
    tools: ['Business Ambition Canvas™', 'Inside Readiness Index™', 'AI-Native Value Map™', 'Inside Target State Canvas™'],
    result: 'An executable strategy and a first capability chosen with explicit criteria.',
    engagement: 'BECOME DISCOVER™',
    engagementWhy:
      'The strategic layer is missing: direction, priority and the design of the future model. Building before that multiplies the number of pilots, not the value.',
    cta: 'Define where to start',
  },

  'pilotos-que-no-escalan': {
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

  'redisenar-workflow-critico': {
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

  'construir-agent-o-copilot': {
    q: 'Want to build an agent or copilot?',
    answer:
      'If you already have a prioritized opportunity, you need to turn it into a capability with defined autonomy boundaries, integration, adoption and accountability.',
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

  'experiencia-ai-native': {
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

  'demostrar-valor-en-90-dias': {
    q: 'Need to prove value in 90 days?',
    answer:
      'If you need fast evidence, you need to narrow the scope without lowering the bar: a viable capability, a real environment and measurable outcomes.',
    signals: [
      'There’s an executive sponsor and urgency.',
      'The opportunity looks clear, but still has no baseline.',
      'There’s a risk of producing another demo with no adoption.',
      'The team needs an investment decision based on evidence.',
    ],
    problem:
      'Deadline pressure pushes teams to show something, and showing something is exactly what fails to generate evidence. Without a baseline and real use, 90 days later there’s a better demo and the same doubt.',
    value:
      'We apply a readiness gate, scope the workflow and the outcomes, build the minimum operational scope, roll it out in a controlled way, and measure usage, trust, performance, control and value.',
    tools: ['Agentic Workflow Blueprint™', 'Embed Scorecard™', 'Scale Readiness Gate™'],
    result: 'Enough evidence to decide whether to iterate, integrate, scale or stop.',
    engagement: 'BECOME EMBED™',
    engagementWhy:
      'Subject to prioritization. If the case still isn’t sufficiently defined, we don’t force the deadline: a poorly scoped sprint spends the 90 days without producing the decision.',
    cta: 'Define a value sprint',
  },
};

/* Orientation map for the hub. Same rows and order as use-cases.js. */
export const ORIENTATION = [
  { q: 'Not sure where to start with AI?', happens: 'Many ideas, executive pressure and scattered priorities.', need: 'Ambition, value pools, choices and roadmap.', rec: 'BECOME DISCOVER™' },
  { q: 'Do your pilots never scale?', happens: 'Isolated prototypes with no ownership, integration or adoption.', need: 'Systemic diagnosis, target state and a decision on what to scale.', rec: 'BECOME DISCOVER™ → BECOME EMBED™' },
  { q: 'Need to redesign a critical workflow?', happens: 'A slow, fragmented or decision-heavy process.', need: 'End-to-end workflow redesign with roles, agents, data and controls.', rec: 'BECOME DISCOVER™ + BECOME EMBED™' },
  { q: 'Want to build an agent or copilot?', happens: 'An idea or functional need exists, but operational design is missing.', need: 'Blueprint, autonomy boundaries, human-in-the-loop, build and adoption.', rec: 'BECOME EMBED™' },
  { q: 'Want to create an AI-native experience?', happens: 'New value is sought for customers or collaborators.', need: 'Product thesis, experience design, data/agent architecture and validation.', rec: 'BECOME EMBED™ or the full sequence' },
  { q: 'Need to prove value in 90 days?', happens: 'Pressure to show outcomes without producing another demo.', need: 'Viable scope, baseline, working capability, adoption and scorecard.', rec: 'BECOME EMBED™' },
];
