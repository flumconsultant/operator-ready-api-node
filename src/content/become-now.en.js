/**
 * BECOME NOW™ — Applied AI Enablement. English content.
 *
 * Mirrors content/become-now.js field by field. Kept separate rather than
 * parameterizing the Spanish file because the Spanish version is the working
 * source of truth and this avoids re-verifying it. Slugs stay identical to
 * the Spanish version — only the copy inside each entry is translated — so
 * the /en/services/become-now/:slug route can reuse the same param.
 */

export const TAGLINE = 'Learn today. Apply tomorrow. Build capability that stays.';

export const PROMISE =
  'Your company doesn’t learn AI from generic examples. It learns by applying it to what it needs to solve today.';

export const PERSONALIZATION_NOTE =
  'This curriculum is a reference. The final program is designed after understanding your company’s processes, documents, tools, roles and objectives.';

export const PROGRAM_GROUPS = [
  { title: 'Business & Growth', slugs: ['finanzas', 'finanzas-inmobiliarias', 'ventas', 'marketing-comunicaciones', 'customer-service-cx', 'strategy-liderazgo'] },
  { title: 'Operations & People', slugs: ['supply-chain-compras', 'operaciones', 'recursos-humanos', 'legal-compliance-risk', 'project-management-pmo'] },
  { title: 'Product, Data & Technology', slugs: ['product-innovacion', 'data-analytics', 'technology-engineering'] },
];

export const PROGRAMS = {
  'finanzas': {
    menu: 'AI applied to Finance',
    area: 'Finance',
    h1: 'Turn AI into a new capability for the finance team.',
    body: 'A program adapted to the company’s reporting, budgeting, forecasting, cash management, analysis and financial communication processes.',
    who: ['Finance', 'FP&A', 'Accounting', 'Treasury', 'Management Control', 'Controllers', 'CFO Office'],
    route: [
      ['AI fundamentals and financial prompting', 'A financial assistant with defined instructions, limits and formats.'],
      ['Reporting, close and reconciliation', 'A reviewer of financial information and inconsistency detector.'],
      ['Budget and forecast', 'A copilot to analyze assumptions and update projections.'],
      ['Cash flow and scenarios', 'A scenario simulator for revenue, costs, rate, term and cash.'],
      ['Variance analysis', 'A radar for variances between budget, forecast and actuals.'],
      ['Communication to Management', 'An executive narrator that turns analysis into findings, risks and recommendations.'],
    ],
    deliverables: ['Financial Prompt Library', 'Information review template', 'Scenario simulator', 'Variance report', 'Executive Finance Brief', 'Validation protocol'],
    cta: 'Adapt this program to Finance',
  },

  'finanzas-inmobiliarias': {
    menu: 'AI applied to Real Estate Finance',
    area: 'Real Estate Finance',
    h1: 'Cut down the time spent gathering information. Increase the time spent deciding.',
    body: 'Training applied to contracts, sales, collections, costs, construction progress, financing and cash flow of real-estate projects.',
    who: ['Real estate finance', 'Project control', 'Treasury', 'Accounting', 'Project Finance', 'Real-estate project management'],
    route: [
      ['Generative AI and financial instruction', 'Project Financial Assistant.'],
      ['Contracts and financing conditions', 'Contract and Financing Reviewer.'],
      ['Reconciliation and data quality', 'Project Data Consolidator.'],
      ['Cash flow and investment scenarios', 'Investment Scenario Simulator.'],
      ['Budget, actuals and alerts', 'Variance Radar.'],
      ['Decision summary', 'Executive Management Narrator.'],
    ],
    processes: ['Purchase agreements', 'Construction contracts', 'Financing conditions', 'Covenants', 'Sales and collections', 'Costs', 'Construction progress', 'Cash flow', 'Profitability', 'Reports to banks and investors'],
    deliverables: ['Contract matrix with evidence', 'Data-quality diagnostic', 'Scenario comparison', 'Variance report', 'Financial agent library', 'Traceability protocol'],
    cta: 'Design the program for your project',
  },

  'ventas': {
    menu: 'AI applied to Sales',
    area: 'Sales',
    h1: 'Help your sales team research better, respond faster and sell with more context.',
    body: 'A program applied to prospecting, meeting preparation, qualification, proposals, follow-up and pipeline management.',
    who: ['B2B and B2C Sales', 'Key Account Managers', 'Business Development', 'Inside Sales', 'Sales Operations', 'Customer Success'],
    route: [
      ['AI for the sales process', 'A Sales Copilot adapted to product, customer and sales methodology.'],
      ['Account and opportunity research', 'Account Research Assistant.'],
      ['Qualification and prioritization', 'Lead Qualification Assistant with sales criteria.'],
      ['Meeting preparation', 'Meeting Preparation Copilot.'],
      ['Proposals and objection handling', 'Proposal and Objection Assistant.'],
      ['Follow-up and pipeline', 'Pipeline Narrative and Next-Best-Action Assistant.'],
    ],
    deliverables: ['Account brief', 'Lead scoring guide', 'Message library', 'Meeting template', 'Proposal assistant', 'Follow-up workflow', 'Pipeline summary'],
    cta: 'Adapt this program to Sales',
  },

  'marketing-comunicaciones': {
    menu: 'AI applied to Marketing & Communications',
    area: 'Marketing & Communications',
    h1: 'Turn AI into a research, creation and optimization capability.',
    body: 'A program applied to insights, content strategy, campaigns, corporate communication, reputation and measurement.',
    who: ['Marketing', 'Brand', 'Communications', 'Content', 'Growth', 'Public Relations', 'Social Media', 'Employee Advocacy'],
    route: [
      ['AI for Marketing and Communications', 'Marketing and Communications Copilot.'],
      ['Research and consumer insights', 'Research and Insight Synthesizer.'],
      ['Content strategy', 'Content Strategy Assistant.'],
      ['Campaigns and multichannel adaptation', 'Campaign Content System.'],
      ['Reputation and corporate communication', 'Reputation and Corporate Messaging Assistant.'],
      ['Performance and optimization', 'Campaign Analysis and Learning Assistant.'],
    ],
    deliverables: ['Insight brief', 'Message house', 'Content system', 'Campaign assistant', 'Reputation Q&A', 'Executive communication brief', 'Performance narrative'],
    cta: 'Design the program for Marketing',
  },

  'supply-chain-compras': {
    menu: 'AI applied to Supply Chain & Procurement',
    area: 'Supply Chain & Procurement',
    h1: 'Turn data, exceptions and suppliers into faster decisions.',
    body: 'A program applied to demand, inventory, procurement, suppliers, contracts, risks and supply-chain tracking.',
    who: ['Supply Chain', 'Procurement', 'Planning', 'Logistics', 'Inventory Management', 'Supplier Management', 'Sourcing'],
    route: [
      ['AI for Supply Chain', 'Supply Chain Copilot.'],
      ['Demand and inventory', 'Demand and Inventory Insight Assistant.'],
      ['Supplier evaluation', 'Supplier Evaluation Assistant.'],
      ['Procurement and contracts', 'Procurement and Contract Review Assistant.'],
      ['Risks and exceptions', 'Supply Chain Risk Radar.'],
      ['Control tower and communication', 'Executive Supply Chain Brief.'],
    ],
    deliverables: ['Supplier scorecard', 'Demand summary', 'Inventory exception report', 'Contract review matrix', 'Risk radar', 'Procurement brief', 'Supply Chain executive report'],
    cta: 'Adapt this program to Supply Chain',
  },

  'operaciones': {
    menu: 'AI applied to Operations',
    area: 'Operations',
    h1: 'Redesign operational work before automating it.',
    body: 'A program applied to processes, SOPs, exceptions, root-cause analysis, tracking and continuous improvement.',
    who: ['Operations', 'Process Excellence', 'Shared Services', 'Quality', 'Back Office', 'Continuous Improvement'],
    route: [
      ['AI for operations', 'Operations Copilot.'],
      ['Understanding and documenting processes', 'Process Documentation Assistant.'],
      ['SOPs and operational knowledge', 'SOP and Knowledge Assistant.'],
      ['Exceptions and incidents', 'Exception Management Assistant.'],
      ['Root cause and continuous improvement', 'Root-Cause Analysis Copilot.'],
      ['Operational performance', 'Operations Performance Brief.'],
    ],
    deliverables: ['Process map', 'SOP library', 'Exception register', 'Root-cause template', 'Improvement backlog', 'Operations report'],
    cta: 'Design the program for Operations',
  },

  'recursos-humanos': {
    menu: 'AI applied to Human Resources',
    area: 'Human Resources',
    h1: 'Help HR work with more context while keeping human judgment.',
    body: 'A program applied to recruitment, onboarding, learning, employee experience, performance and people analytics.',
    who: ['Human Resources', 'Talent Acquisition', 'Learning and Development', 'People Analytics', 'Employee Experience', 'HR Business Partners'],
    route: [
      ['Responsible AI for Human Resources', 'HR Copilot with usage limits and human review.'],
      ['Recruitment and profiles', 'Job Profile and Interview Assistant.'],
      ['Onboarding', 'Onboarding Journey Assistant.'],
      ['Learning and development', 'Learning Path Designer.'],
      ['Performance and feedback', 'Feedback Preparation Assistant.'],
      ['People insights and communication', 'People Insight and Communication Assistant.'],
    ],
    guardrails: [
      'Never delegate hiring decisions to an LLM.',
      'Avoid the use of unauthorized personal data.',
      'Review for bias and discriminatory criteria.',
      'Maintain human accountability.',
      'Document sources and decisions.',
    ],
    deliverables: ['Profile library', 'Interview guide', 'Onboarding assistant', 'Learning plan', 'Feedback templates', 'People insight brief', 'Responsible AI guide for HR'],
    cta: 'Adapt this program to Human Resources',
  },

  'customer-service-cx': {
    menu: 'AI applied to Customer Service & CX',
    area: 'Customer Service & CX',
    h1: 'Turn customer conversations into answers, insights and improvements.',
    body: 'A program applied to support, knowledge management, quality, complaints, Voice of Customer and customer journeys.',
    who: ['Customer Service', 'Contact Center', 'Customer Experience', 'Service Design', 'Quality', 'Customer Operations'],
    route: [
      ['AI for service and experience', 'Customer Service Copilot.'],
      ['Voice of Customer', 'Customer Feedback Synthesizer.'],
      ['Knowledge management', 'Knowledge Base Assistant.'],
      ['Responses and complex cases', 'Response and Escalation Assistant.'],
      ['Quality and conversation analysis', 'Conversation Quality Reviewer.'],
      ['Customer journey and improvement', 'CX Improvement Assistant.'],
    ],
    deliverables: ['VOC report', 'Knowledge assistant', 'Response library', 'Escalation matrix', 'Quality rubric', 'CX improvement backlog'],
    cta: 'Design the program for Customer Experience',
  },

  'legal-compliance-risk': {
    menu: 'AI applied to Legal, Compliance & Risk',
    area: 'Legal, Compliance & Risk',
    h1: 'Expand your capacity to review, compare and monitor without delegating professional judgment.',
    body: 'A program applied to contracts, obligations, policies, regulation, risks and executive communication.',
    who: ['Legal', 'Compliance', 'Risk', 'Internal Control', 'Corporate Affairs', 'Audit'],
    route: [
      ['Responsible AI in Legal and Risk', 'Legal and Risk Copilot with defined limits.'],
      ['Contract review', 'Contract Review Assistant.'],
      ['Obligations and regulation', 'Regulatory Obligation Mapper.'],
      ['Policies and controls', 'Policy and Control Assistant.'],
      ['Incidents and risks', 'Risk and Incident Synthesizer.'],
      ['Executive reporting', 'Legal and Risk Executive Brief.'],
    ],
    guardrails: [
      'Output does not replace legal advice.',
      'Every interpretation requires professional review.',
      'Sources must remain traceable.',
      'Confidential information is used only in authorized environments.',
      'Risks must distinguish facts, assumptions and interpretation.',
    ],
    deliverables: ['Contract matrix', 'Obligations register', 'Policy assistant', 'Control mapping', 'Risk brief', 'Executive legal report'],
    cta: 'Adapt this program to Legal and Risk',
  },

  'product-innovacion': {
    menu: 'AI applied to Product & Innovation',
    area: 'Product & Innovation',
    h1: 'Speed up product learning without speeding up the wrong decisions.',
    body: 'A program applied to discovery, customer insights, product definition, prioritization, experimentation and communication.',
    who: ['Product Management', 'Product Owners', 'Innovation', 'UX Research', 'Service Design', 'Digital Business'],
    route: [
      ['AI for Product and Innovation', 'Product Copilot.'],
      ['Discovery and customer insights', 'Research Synthesis Assistant.'],
      ['Problem framing and opportunities', 'Opportunity Definition Assistant.'],
      ['Product requirements and backlog', 'PRD and Backlog Assistant.'],
      ['Prototyping and experimentation', 'Experiment Design Copilot.'],
      ['Roadmap and communication', 'Product Decision Brief.'],
    ],
    deliverables: ['Research synthesis', 'Opportunity map', 'Product brief', 'PRD assistant', 'Experiment backlog', 'Product decision memo'],
    cta: 'Design the program for Product',
  },

  'strategy-liderazgo': {
    menu: 'AI applied to Strategy & Leadership',
    area: 'Strategy & Leadership',
    h1: 'Use AI to widen the analysis, not to delegate the decision.',
    body: 'A program for leaders who need to research, compare scenarios, prepare decisions and communicate with more clarity.',
    who: ['C-Level', 'Directors', 'Business Unit Leaders', 'Strategy', 'Transformation', 'Corporate Development'],
    route: [
      ['AI for executive work', 'Executive AI Copilot.'],
      ['Research and market intelligence', 'Executive Research Assistant.'],
      ['Scenarios and strategic choices', 'Scenario Planning Copilot.'],
      ['Decision memos', 'Executive Decision Memo Assistant.'],
      ['Meetings and follow-up', 'Meeting and Commitment Assistant.'],
      ['Portfolio and communication', 'Strategy Portfolio Brief.'],
    ],
    deliverables: ['Executive prompt system', 'Market brief', 'Scenario matrix', 'Decision memo', 'Meeting workflow', 'Portfolio narrative'],
    cta: 'Design the program for leaders',
  },

  'project-management-pmo': {
    menu: 'AI applied to Project Management & PMO',
    area: 'Project Management & PMO',
    h1: 'Reduce tracking overhead. Increase visibility to decide.',
    body: 'A program applied to planning, status reporting, risks, dependencies, meetings and portfolio management.',
    who: ['Project Managers', 'Program Managers', 'PMO', 'Transformation Offices', 'Delivery Leads', 'Scrum Masters'],
    route: [
      ['AI for Project Management', 'Project Management Copilot.'],
      ['Charter and planning', 'Project Planning Assistant.'],
      ['Meetings and decisions', 'Meeting and Decision Tracker.'],
      ['Status and tracking', 'Status Report Assistant.'],
      ['Risks and dependencies', 'Risk and Dependency Radar.'],
      ['Portfolio and communication', 'PMO Executive Brief.'],
    ],
    deliverables: ['Project charter', 'Planning assistant', 'Decision log', 'Status report', 'Risk register', 'Portfolio summary'],
    cta: 'Adapt this program to your PMO',
  },

  'data-analytics': {
    menu: 'AI applied to Data & Analytics',
    area: 'Data & Analytics',
    h1: 'Use LLMs to speed up analysis without losing control over the data.',
    body: 'A program applied to data quality, exploratory analysis, interpretation, scenarios, reporting and decision support.',
    who: ['Data Analysts', 'Business Intelligence', 'Business Analysts', 'Analytics', 'Controllers', 'Decision Support Teams'],
    route: [
      ['LLMs for data analysis', 'Data Analysis Copilot.'],
      ['Quality and preparation', 'Data Quality Assistant.'],
      ['Exploratory analysis', 'Exploratory Analysis Assistant.'],
      ['Variances and scenarios', 'Variance and Scenario Copilot.'],
      ['Visualization and narrative', 'Data Storytelling Assistant.'],
      ['Decision support', 'Executive Decision Pack.'],
    ],
    deliverables: ['Data quality checklist', 'Analysis workflow', 'Scenario templates', 'Visualization brief', 'Data narrative', 'Decision pack'],
    cta: 'Design the program for Data',
  },

  'technology-engineering': {
    menu: 'AI applied to Technology & Engineering',
    area: 'Technology & Engineering',
    h1: 'Build the judgment to work with LLMs, agents and AI systems.',
    body: 'The program connects practical use of ChatGPT, Claude, Gemini and other foundation models with the concepts needed to design enterprise solutions: APIs, context engineering, RAG, tool calling, MCP, evaluations, guardrails and observability. The goal isn’t to turn everyone into an AI engineer: it’s to help technical teams make better decisions about how AI should be built, integrated and governed. It applies to requirements, architecture, coding, testing, documentation, incidents and engineering knowledge.',
    who: ['Software Engineering', 'Architecture', 'QA', 'DevOps', 'IT Operations', 'Technology Leadership'],
    route: [
      ['LLMs, foundation models and prompt engineering', 'Engineering Copilot with usage rules, boundaries and review criteria.'],
      ['Context engineering, RAG and embeddings', 'An assistant connected to the team’s technical knowledge through vector search and grounding.'],
      ['APIs, tool calling and MCP', 'A requirements assistant that queries real systems instead of answering from memory.'],
      ['Agentic workflows and model routing', 'A coding and review workflow with automated steps and human review points.'],
      ['Evaluations, guardrails and testing', 'A test design assistant and an evaluation set to measure behaviour before trusting it.'],
      ['Observability, incidents and cost governance', 'A technical knowledge system with tracing, monitoring and runbooks.'],
    ],
    deliverables: ['Engineering prompt library', 'Context and RAG design', 'Requirement templates', 'Code-review checklist', 'Evaluation set (evals)', 'Guardrails and human-in-the-loop', 'Incident runbook', 'Documentation assistant'],
    cta: 'Adapt this program to Technology',
  },
};

export const SITUATIONS = [
  'The company hands out licenses, but adoption stays low.',
  'Teams use AI for isolated tasks.',
  'Nobody reuses what works.',
  'Results have no shared validation criteria.',
  'There are doubts about privacy and data handling.',
  'Previous training was too generic.',
  'Teams know the tool but don’t know how to apply it to their processes.',
  'The company can’t demonstrate productivity or value.',
];

export const EXISTING_MATERIAL = [
  'Current processes', 'Documents', 'Contracts', 'Reports', 'Presentations',
  'Databases', 'Spreadsheets', 'Emails', 'Policies', 'Operating guides',
  'Indicators', 'Tracking formats', 'Available tools and licenses',
];

export const SESSION_ZERO = [
  ['Business objectives', 'What the area expects to improve, which indicators matter, what pressure led to the training, and what outcomes it must produce.'],
  ['Current processes', 'Recurring activities, key decisions, bottlenecks, handoffs, rework, exceptions and dependencies between areas.'],
  ['Information and tools', 'Documents, data sources, spreadsheets, systems, reports, available ChatGPT, Claude or Gemini licenses, and access restrictions.'],
  ['Users and adoption level', 'Participating roles, prior experience, frequency of use, confidence and differences between profiles.'],
  ['Security and responsible use', 'Sensitive information, personal data, intellectual property, internal rules, authorized tools and human-review criteria.'],
  ['Case selection', 'Which processes get worked on, which agents get built, what outputs are expected and by what criteria they’re validated.'],
];

export const SESSION_ZERO_OUTPUTS = [
  'Understanding Brief', 'Map of the current process', 'AI Fluency Baseline',
  'Case prioritization', 'Adapted curriculum', 'List of required information',
  'Tool definition', 'Security criteria', 'Program metrics',
];

export const SESSION_FLOW = [
  ['Business challenge', 'The real problem the area needs to solve gets presented.'],
  ['AI concept', 'Only the AI concept needed to tackle that problem gets taught.'],
  ['Applied demonstration', 'Demonstrated with ChatGPT, Claude or Gemini on a case close to the team’s reality.'],
  ['Build', 'Each participant configures a reusable assistant, agent, workflow or template.'],
  ['Validate', 'The result is compared against criteria defined by the area.'],
  ['Transfer', 'The asset is documented so it can be used after the training ends.'],
];

export const FORMATS = [
  { name: 'Essential Program', hours: '12 contact hours', sessions: '4 sessions of 3 hours', items: ['Prior understanding session', 'Four cases or capabilities', 'Initial instruction library', 'Final report'] },
  { name: 'Complete Program', hours: '18 contact hours', sessions: '6 sessions of 3 hours', items: ['Prior understanding session', 'Six cases or capabilities', 'Workflow library', 'Validation protocols', 'Follow-up measurement'] },
  { name: 'Comprehensive Program', hours: '24 contact hours', sessions: '8 sessions of 3 hours', items: ['Prior understanding session', 'Six training sessions', 'Lab on real cases', 'Implementation consulting', 'Adoption plan for the area'] },
];

export const IS_IS_NOT = [
  ['AI applied to the real work of each area.', 'A generic course on ChatGPT.'],
  ['A program built on the company’s own processes.', 'A list of magic prompts.'],
  ['Work with existing documents, data and formats.', 'A demo disconnected from the operation.'],
  ['Building reusable assistants, agents and workflows.', 'A full automation of systems.'],
  ['Validation criteria and human review.', 'A replacement for professional judgment.'],
  ['Capabilities usable from the next day.', 'Theory with no application.'],
  ['A program adaptable to ChatGPT, Claude or Gemini.', 'Training locked to a single platform.'],
];

export const INDICATORS = [
  ['Adoption', 'Active participants, frequency of use, reused workflows and cases folded into everyday work.'],
  ['Productivity', 'Preparation and response time, reduction of manual tasks, and speed to a first useful output.'],
  ['Quality', 'Consistency, detected errors, format compliance, rework and level of traceability.'],
  ['Trust', 'Ability to verify results, clarity about limits, and appropriate use of information.'],
  ['Value', 'Improved processes, enabled decisions, installed capabilities and cases ready for BECOME EMBED™.'],
];

export const GENERAL_DELIVERABLES = [
  'AI Fluency Baseline', 'Understanding Brief', 'Process and opportunity map',
  'Customized curriculum', 'Instruction library', 'Configured assistants or agents',
  'Prompt systems', 'Applied Workflow Canvas', 'Area templates',
  'Validation protocols', 'Responsible Use Guide', 'AI Champions Kit',
  'Adoption Scorecard', 'Final report for Management', 'Recommendations for the next 90 days',
];

export const FAQ = [
  ['Is the training the same for every company?', 'No. Every program starts with an understanding session. The curriculum, cases, documents and exercises are adapted to the company’s real processes.'],
  ['Is the program focused on ChatGPT?', 'No. BECOME NOW™ is vendor-neutral. The program can work with ChatGPT, Claude, Gemini, Microsoft Copilot or other models and tools approved by the organization. The choice depends on the technology stack, use cases and internal policies.'],
  ['Do we work with company accounts and documents?', 'Session 0 defines what information, tools and environments may be used during the program. Exercises must follow each organization’s security, privacy and AI-use policies.'],
  ['Does BECOME work with a single AI model or provider?', 'No. Our approach is vendor-neutral. Selection depends on the use case, your data, internal policies, required level of autonomy, architecture and total operating cost. Depending on the context, we evaluate ecosystems such as OpenAI/ChatGPT, Anthropic/Claude, Google/Gemini, Microsoft Copilot and other alternatives available within the organization’s stack.'],
  ['Do we need to share confidential information?', 'Not necessarily. The company can work with real, anonymized or simulated information. How it’s handled gets defined during the understanding session.'],
  ['Is this a prompting course?', 'No. Prompting is an enabling skill. The goal is to build assistants, agents, workflows and deliverables that improve the area’s work.'],
  ['Do participants need technical knowledge?', 'No. The curriculum adapts to the participants’ level. The functional programs are designed for business teams.'],
  ['Does BECOME automate processes during the training?', 'The standard program focuses on capability building and configuration within authorized tools. Integrations and development can be addressed afterward through BECOME EMBED™.'],
  ['How many people can take part?', 'Group size is set based on the level of support required. Small cohorts are recommended when each participant needs to build and validate their own workflows.'],
  ['Can a program be created for an area that isn’t on the menu?', 'Yes. The catalog shows the most common routes, but BECOME can design programs for any area, role, industry or specific process.'],
  ['What’s left after the training?', 'Applicable capabilities, a reusable library, documented workflows, validation criteria and adoption recommendations.'],
];

export const PROGRAM_LIST = PROGRAM_GROUPS.flatMap((g) =>
  g.slugs.map((slug) => ({
    slug,
    group: g.title,
    ...PROGRAMS[slug],
    to: `/en/services/become-now/${slug}`,
  }))
);
