/**
 * English content for the six solution pages. Mirrors soluciones.js field for
 * field — see that file for why the structure and block order are fixed.
 */

/**
 * ---- Por qué cada página tiene ahora su propio titular en cada bloque ----
 *
 * Las seis compartían el andamiaje: el mismo titular para las señales, el mismo
 * para «qué cambia dentro», el mismo párrafo de las cinco capas y el mismo
 * cierre. Medido sobre el HTML publicado, eso era el 46 % del texto de cada
 * página, y dejaba el grupo con un 52-59 % de texto propio y hasta un 43 % de
 * solapamiento entre dos de ellas: el punto más débil del sitio.
 *
 * No faltaba contenido —las señales, el problema, el valor y el resultado ya
 * eran propios— sino un titular verificable en cada bloque. Es lo mismo que
 * llevó a las páginas de programa del 20 % al 90 % de texto propio.
 *
 * `dentroTexto` es el que más importa: antes las seis decían que el trabajo
 * cruza las cinco capas, que es verdad y es la misma verdad seis veces. Ahora
 * cada una dice cuál pesa en SU situación y por qué.
 */
export const SOLUCION_CONTENIDO = {
  'scale-ai-beyond-pilots': {
    seoTitulo: 'Scale AI pilots into operations | BECOME',
    seoDesc: 'If your prototypes work in a demo but not in operation, you need to identify what’s missing around the technology before scaling.',
    q: 'Do your AI pilots struggle to scale?',
    answer: 'If your prototypes work in a demo but not in operation, you need to identify what’s missing around the technology before scaling.',
    senalesTitular: 'The pilot works. The system around it does not—yet.',
    signals: [
      'No operational owner exists after the pilot.',
      'The real workflow didn’t change.',
      'Data, integrations or controls depend on manual work.',
      'Users try the solution but don’t adopt it.',
      'There’s no baseline or scale-readiness criteria.',
    ],
    problemaTitular: 'The pilot was not designed to survive the demo.',
    problem: 'The pilot doesn’t fail because of the model. It fails because it was built alongside the real work instead of inside it: no one owns the result, the process stayed the same, and there’s no measure to decide against.',
    valorTitular: 'Scaling starts by deciding what must change around the model.',
    value: 'We assess the pilot as part of a People, Data, Agents, Products and Operations system; decide whether it should stop, be redesigned or become a capability; then build the conditions for adoption and scale.',
    tools: [
      'Inside Readiness Index™',
      'Agentic Workflow Blueprint™',
      'Embed Scorecard™',
      'Scale Readiness Gate™',
    ],
    result: 'An informed decision and, where warranted, a capability ready to operate.',
    engagement: 'BECOME DISCOVER™ → BECOME EMBED™',
    engagementWhy: 'The diagnosis is strategic and the solution is operational. Skipping the first usually produces a second, equally isolated pilot.',
    dentroTitular: 'From an isolated initiative to an owned capability.',
    dentroTexto: 'Operations brings the solution into the real workflow and assigns ownership. Data no longer depends on manual preparation. Agents operate within evaluation criteria and limits. People adopt a new way of working, while Products turns the pilot into a capability that can evolve.',
    cierreTitular: 'Not every pilot should scale. Every pilot deserves a decision.',
    cierreTexto: 'Bring us the pilot, its business case and what happened after the demo. We will identify whether the missing condition is adoption, data, integration, control—or a strong enough reason to keep investing.',
    cta: 'Turn the pilot into a capability',
  },

  'prepare-teams-for-ai': {
    seoTitulo: 'Applied AI training for teams | BECOME',
    seoDesc: 'If your teams already use AI tools with no shared method, that scattered use has to become a common way of working, with criteria and controls.',
    q: 'Do your teams need to work better with AI?',
    answer: 'If your teams already use AI tools with no shared method, that scattered use has to become a common way of working, with criteria and controls.',
    senalesTitular: 'Usage is growing faster than the method.',
    signals: [
      'Everyone uses AI their own way, with uneven results.',
      'General training happened and day-to-day work didn’t change.',
      'Nobody knows what a tool can reasonably be asked to do, and what it can’t.',
      'What works in one team never reaches the others.',
      'There’s no shared standard for what counts as an acceptable output.',
    ],
    problemaTitular: 'The gap is not access. It is application.',
    problem: 'A generic course teaches a tool; the work doesn’t change because nobody looked at the team’s real process. Capability appears when each team works on its own documents, its own cases and its own constraints — and keeps something reusable.',
    valorTitular: 'We turn individual learning into shared capability.',
    value: 'We start from the work each area does today: we map its process, pick the priority cases, work on its real documents, and leave assistants, templates and validation criteria that stay in the company.',
    tools: [
      'Applied Workflow Canvas',
      'Adoption Scorecard',
      'Inside Readiness Index™',
    ],
    result: 'Teams working with AI on their own processes, with a reusable library and shared quality criteria.',
    engagement: 'BECOME NOW™',
    engagementWhy: 'It’s the service built for this. If deciding where to invest as a company is also missing, Discover orders that decision before or alongside it.',
    dentroTitular: 'Change begins with People and becomes durable through Operations.',
    dentroTexto: 'People build the judgment and confidence to use AI. Operations turns learned cases into repeatable workflows. Data defines what information is permitted, and Agents move from isolated tools into specific tasks with shared review and quality standards.',
    cierreTitular: 'Training should show up in tomorrow\'s work.',
    cierreTexto: 'Tell us which teams will take part, which tasks they need to improve and which tools are approved. We will design the program around that work—not examples that disappear when the session ends.',
    cta: 'Design your team’s program',
  },

  'redesign-critical-workflows': {
    seoTitulo: 'Redesign critical workflows with AI | BECOME',
    seoDesc: 'If you’re looking to improve a critical operation, you need to redesign the workflow end-to-end — not automate isolated tasks.',
    q: 'Does a critical workflow need to be redesigned?',
    answer: 'If you’re looking to improve a critical operation, you need to redesign the workflow end-to-end — not automate isolated tasks.',
    senalesTitular: 'The bottleneck moves. It does not disappear.',
    signals: [
      'Multiple handoffs and rework exist.',
      'Decisions depend on fragmented information.',
      'Specialists spend time on repetitive tasks.',
      'Exceptions have no owner or consistent criteria.',
      'The process is slow, variable or hard to audit.',
    ],
    problemaTitular: 'A faster task does not create a better workflow.',
    problem: 'Automating a task inside a process that doesn’t change just moves the bottleneck. Time recovered in one step is lost in the next, because the decisions, the data and the exceptions stay exactly where they were.',
    valorTitular: 'We redesign the decision before automating the task.',
    value: 'We redesign events, decisions, roles, agent tasks, data, exceptions, human oversight, controls and metrics as a single workflow; then we build and validate the priority capability.',
    tools: [
      'Inside Target State Canvas™',
      'Agentic Workflow Blueprint™',
      'Embed Scorecard™',
    ],
    result: 'A faster, more consistent, controlled workflow capable of learning.',
    engagement: 'BECOME DISCOVER™ + BECOME EMBED™',
    engagementWhy: 'The redesign needs a systems view, and the improvement is only real once the new workflow runs in production.',
    dentroTitular: 'Operations carries the redesign. Data and Agents remove the friction.',
    dentroTexto: 'Operations redefines the end-to-end flow, handoffs and exceptions. Data reaches the point where a decision needs it. Agents take on bounded tasks and escalate what they cannot resolve. People retain judgment and ownership, while Products makes the experience visible to those using or receiving the workflow.',
    cierreTitular: 'Start with the workflow that hides the most cost.',
    cierreTexto: 'Show us where waiting, rework and exceptions accumulate. We will reconstruct the real workflow and define what should disappear, what AI may assist and which decisions must remain human.',
    cta: 'Redesign the workflow',
  },

  'deploy-governed-ai-agents': {
    seoTitulo: 'Governed AI agents and copilots | BECOME',
    seoDesc: 'We design the workflow before selecting the model: what the agent does, which data it reaches, when it asks for approval and who owns the result.',
    q: 'Do you want to build a governed AI agent or copilot?',
    answer: 'We design the work before selecting the technology: what the agent may do, which decisions stay with a person, what information it can access and what happens when it cannot continue safely.',
    senalesTitular: 'The prototype responds. Operations still cannot govern it.',
    signals: [
      'The team knows the task, but not the operating model.',
      'It’s unclear what the agent decides and what the person keeps.',
      'Exception paths, permissions or quality criteria are missing.',
      'The prototype isn’t integrated into the real workflow.',
      'There are no evaluations or alerts to detect when behavior drifts.',
    ],
    problemaTitular: 'The challenge is not granting autonomy. It is designing its limits.',
    problem: 'An agent without an operating model is a demo with permissions. What decides its fate isn’t the quality of its answers, but who responds when it gets something wrong and what happens to the cases that don’t fit.',
    valorTitular: 'We build the operating system around the agent.',
    value: 'We validate the blueprint, design human-in-the-loop oversight and controls, build and integrate the agent or copilot, support adoption, and measure trust, performance, control and value.',
    tools: [
      'Agentic Workflow Blueprint™',
      'Embed Scorecard™',
      'Scale Readiness Gate™',
    ],
    result: 'An agent or copilot that participates in real work with explicit ownership.',
    engagement: 'BECOME EMBED™',
    engagementWhy: 'Subject to readiness: if the opportunity doesn’t yet have a validatable blueprint, we first run a short readiness gate.',
    dentroTitular: 'Agents never operate alone: Operations defines when they act and who answers.',
    dentroTexto: 'Agents execute within explicit limits. Operations defines the workflow, exceptions and accountable owner. Data controls sources, access and traceability. People supervise and know when to intervene. Products makes the interaction understandable to the person using it.',
    cierreTitular: 'Before building, make its decision rights visible.',
    cierreTexto: 'Tell us which task the agent would take on, which systems it must consult and which error you cannot afford. That is enough to begin defining autonomy, controls and the right point for human review.',
    cta: 'Build the capability',
  },

  'build-ai-enabled-products': {
    seoTitulo: 'Build AI-enabled products and services | BECOME',
    seoDesc: 'To create a new experience for customers or teams, you need to design the value, the intelligent behaviour and the operation that sustains it.',
    q: 'Do you want to build an AI-native product or service?',
    answer: 'If you are creating a new experience for customers or employees, its value, intelligent behavior and operating model must be designed together.',
    senalesTitular: 'The idea uses AI. The product still needs a reason to exist.',
    signals: [
      'The idea depends on AI, but its user value is still generic.',
      'The product experience doesn’t define trust, explanation or escalation.',
      'It’s unclear what data and knowledge make the experience possible.',
      'The team needs to validate desirability, feasibility and viability.',
      'No metric shows whether intelligence actually improves the experience.',
    ],
    problemaTitular: 'Putting a model inside the experience does not make it AI-native.',
    problem: 'An AI-native experience isn’t designed as a screen with a model behind it. Intelligent behavior is part of the product: what it knows, what it explains, when it hands off control and who operates it in production.',
    valorTitular: 'We design value, behavior and operations as one product.',
    value: 'We connect product thesis, user journey, intelligence, data, agent behavior, controls and operational ownership; prototype, validate and build the scope that can prove real value.',
    tools: [
      'AI-Native Value Map™',
      'Inside Target State Canvas™',
      'Agentic Workflow Blueprint™',
      'Embed Scorecard™',
    ],
    result: 'A validated AI-native product or service with an explicit path into operations.',
    engagement: 'BECOME EMBED™ or BECOME DISCOVER™ → BECOME EMBED™',
    engagementWhy: 'If the product thesis is still open, BECOME DISCOVER™ closes it before we build.',
    dentroTitular: 'The Products layer defines the promise. The others make it deliverable.',
    dentroTexto: 'The Products layer defines value and experience. Agents provide intelligent behavior. Data determines what the product may know and explain. Operations sustains the service when errors and exceptions appear. People preserves trust, oversight and the capability to evolve it.',
    cierreTitular: 'The question is not where to add AI. It is what experience can now exist.',
    cierreTexto: 'Tell us who would use the product, which outcome they cannot achieve today and why intelligence is essential. We will validate that proposition before turning technical capability into a market promise.',
    cta: 'Design the new experience',
  },

  'measure-and-govern-ai-value': {
    seoTitulo: 'Measure and govern AI value | BECOME',
    seoDesc: 'To demonstrate results and clarify who owns each decision, you need to measure against a baseline and govern what is already running.',
    q: 'Do you need to measure and govern AI value?',
    answer: 'If you have to demonstrate results, reduce risk and clarify who owns each decision, you need to measure against a baseline and govern what is already running.',
    senalesTitular: 'Activity is visible. Value is not.',
    signals: [
      'Activity gets reported — users, pilots, licences — but not results.',
      'There’s no baseline, so any improvement is arguable.',
      'Nobody knows who answers for it when a system gets something wrong.',
      'Leadership needs to decide on investment from evidence, not demos.',
      'There are no criteria for what gets scaled and what gets stopped.',
    ],
    problemaTitular: 'Without a baseline, every result is an interpretation.',
    problem: 'Without a baseline there is no improvement to prove, only opinions about a demo. And with no named owners, control becomes a document nobody applies. Measurement and governance aren’t admin work at the end: they’re what separates a capability from an expensive experiment.',
    valorTitular: 'We turn value and control into recurring decisions.',
    value: 'We define what value means in your case, measure the starting point, assign owners and a review cadence, and set the controls — human oversight, traceability, quality and escalation — that make the result hold.',
    tools: ['Embed Scorecard™', 'Scale Readiness Gate™', 'Inside Readiness Index™'],
    result: 'Measurement that survives a hard question, and a governance model with names rather than good intentions.',
    engagement: 'BECOME DISCOVER™ or BECOME EMBED™',
    engagementWhy: 'If what’s missing is the criteria, it starts in Discover. If something is already running and what’s missing is measuring and governing it, it belongs inside Embed.',
    dentroTitular: 'Governance is not a sixth layer. It is how all five answer.',
    dentroTexto: 'People assigns accountability. Data preserves evidence and traceability. Agents operate within measurable limits. Products owns the outcome it promises, and Operations embeds review, controls and escalation into everyday work. Governance then becomes a decision system—not a document review.',
    cierreTitular: 'If it cannot be explained, it cannot be scaled.',
    cierreTexto: 'Show us which initiatives exist, what gets reported today and which question the steering committee still cannot answer. We will define a baseline, accountable owners and criteria to invest, correct, scale or stop.',
    cta: 'Define the value system',
  },
};

export const ORIENTATION = [
  { q: 'Do your pilots never scale?', happens: 'Isolated prototypes with no owner, integration or adoption.', need: 'A systemic diagnosis, a target state and a decision on what to scale.', rec: 'BECOME DISCOVER™ → BECOME EMBED™' },
  { q: 'Need to prepare your teams to work with AI?', happens: 'Everyone uses AI their own way, with uneven results.', need: 'A shared method built on the team’s real processes, with criteria and controls.', rec: 'BECOME NOW™' },
  { q: 'Need to redesign a critical workflow?', happens: 'A slow, fragmented or decision-heavy process.', need: 'End-to-end redesign with roles, agents, data and controls.', rec: 'BECOME DISCOVER™ + BECOME EMBED™' },
  { q: 'Want to introduce agents without losing control?', happens: 'There’s an idea or a concrete need, but no operating design.', need: 'Design, autonomy boundaries, human oversight, build and adoption.', rec: 'BECOME EMBED™' },
  { q: 'Want AI to become part of your value proposition?', happens: 'You’re looking for new value for customers or collaborators.', need: 'Product thesis, experience design, data and agent architecture, and validation.', rec: 'BECOME EMBED™ or the full sequence' },
  { q: 'Need to measure and govern AI value?', happens: 'Activity gets reported, but not results, and nobody answers for the decisions.', need: 'Baseline, owners, review cadence and controls.', rec: 'BECOME DISCOVER™ or BECOME EMBED™' },
];
