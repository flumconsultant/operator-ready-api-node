/**
 * Applies the canonical English industry copy to the six industries.
 *
 * ---- Why this is not a translation of the Spanish ----
 *
 * The Spanish document and the English one are two different pieces of writing
 * about the same six industries. The English one is shorter, flatter and more
 * declarative, because that is how enterprise English reads: a Spanish sentence
 * translated word for word arrives in English sounding like a brochure written
 * by someone who learned the language from brochures.
 *
 * So nothing here is derived from `aplicar-copy-08.mjs`. Same six industries,
 * same twenty fields, different text — which is exactly what the canonical
 * master asks for.
 *
 * ---- The one shape that had to be reconciled ----
 *
 * The English document gives «where AI can create value» as a flat list of
 * areas, while the page renders that field as two columns — where, and what
 * changes. Rather than invent a second column, the area goes in the first and
 * the second stays empty; the page already knows how to draw a row with only a
 * name. Inventing what changes in each area would be writing claims nobody
 * approved, which the master forbids in the same sentence where it forbids
 * inventing metrics.
 *
 * Only the `en` block is touched. Spanish is left exactly as it is.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const RUTA = 'src/content/industrias.json';

const COPY = {
  'banca-seguros-fintech': {
    nombre: 'Banking, insurance & fintech',
    menu: 'Credit, fraud, claims, KYC/AML, collections, reconciliation and customer operations.',
    h1: 'The advantage is not having more data. It is making better decisions with it.',
    lead: 'Financial institutions already operate with extensive data, policies and controls. The opportunity is to reduce the distance between information and action without weakening traceability, risk controls or human accountability.',
    contexto: [
      'Most of the friction does not sit inside the core system. It sits around it: incomplete files, alerts without context, exceptions moving between teams, reconciliations that require comparing sources.',
      'BECOME works on those points to connect data, documentation, policy, people, LLMs and agents inside a process that stays traceable.',
    ],
    oportunidadesTitular: 'Where AI can create value.',
    oportunidades: [
      ['Credit file preparation and decision support', ''],
      ['Fraud investigation and unrecognized-transaction analysis', ''],
      ['KYC/AML knowledge and case support', ''],
      ['Collections prioritization', ''],
      ['Claims and service-case triage', ''],
      ['Reconciliation and exception handling', ''],
      ['Policy and procedure knowledge', ''],
      ['Insurance reimbursement and guarantee-letter workflows', ''],
      ['Customer operations and back-office support', ''],
    ],
    workflowsTitular: 'Where the work starts.',
    workflows: ['Credit', 'Fraud', 'Operations', 'Claims', 'Compliance', 'Collections', 'Digital channels'],
    capacidades: [
      ['Credit decision copilot', 'Prepares a traceable view of customer information, policy criteria and missing evidence before human decision-making.', 'BECOME EMBED™'],
      ['Fraud investigation assistant', 'Brings together transaction context, alerts, policies and prior cases to support faster review.', 'BECOME EMBED™'],
      ['Reconciliation agent', 'Matches records across sources, identifies exceptions and routes unresolved cases.', 'BECOME EMBED™'],
      ['Compliance knowledge assistant', 'Retrieves internal policy and regulatory guidance with source references and access control.', 'Knowledge intelligence'],
      ['Claims operations assistant', 'Structures documents, identifies missing information and supports routing without replacing accountable decisions.', 'BECOME EMBED™'],
    ],
    tecnologiaTitular: 'AI can prepare a decision. It should not hide how it got there.',
    tecnologia: 'Enterprise knowledge retrieval, RAG and grounded responses, API integrations, permissions and auditability, human review for consequential decisions, evaluation against known cases, and traceability by source and action.',
    metricasTitular: 'What we measure.',
    metricas: [['Cycle time', ''], ['Manual handling', ''], ['Exception rate', ''], ['Rework', ''], ['Decision consistency', ''], ['Escalation rate', ''], ['Adoption by role', '']],
    empezarTitular: 'Where to start.',
    empezar: [
      'BECOME NOW™ when the challenge is how the team works.',
      'BECOME DISCOVER™ when the investment decision is still open.',
      'BECOME EMBED™ when a priority process has to reach operation.',
    ],
    cierre: 'Explore AI opportunities in financial services.',
    cierreTexto: 'Tell us which decision, process or experience needs to change. We will help you identify the right starting point.',
  },

  'mineria-energia': {
    nombre: 'Mining & energy',
    menu: 'Mine planning, maintenance, concentrator operations, shutdowns, logistics and operational knowledge.',
    h1: 'The operation already generates the signal. The challenge is turning it into action in time.',
    lead: 'A mine, plant or maintenance organization generates operational information continuously. Value is lost when that signal stays fragmented across reports, systems, spreadsheets, shift notes and specialist knowledge.',
    contexto: [
      'The work does not start from an AI use case. It starts where a supervisor, planner, engineer or maintainer has to gather too much information before acting.',
      'BECOME works on that gap, with the source, the context and the decision boundary explicit.',
    ],
    oportunidadesTitular: 'Where AI can create value.',
    oportunidades: [
      ['Geology and mine-planning knowledge', ''],
      ['Drilling and blasting information', ''],
      ['Loading and hauling exceptions', ''],
      ['Crusher and concentrator operations', ''],
      ['Grinding and flotation knowledge', ''],
      ['Maintenance and reliability', ''],
      ['Plant shutdown preparation', ''],
      ['Shift handover and reporting', ''],
      ['Tailings and water information', ''],
      ['Concentrate logistics', ''],
      ['Contractor and service management', ''],
      ['HSE and permit knowledge', ''],
    ],
    workflowsTitular: 'Where the work starts.',
    workflows: ['Planning', 'Mine', 'Concentrator', 'Maintenance', 'Safety', 'Logistics', 'Asset-intensive operations'],
    capacidades: [
      ['Shift copilot', 'Structures shift information, open issues, risks and follow-ups for the incoming team.', 'BECOME EMBED™'],
      ['Maintenance assistant', 'Combines work orders, manuals, history and operational context to support preparation and diagnosis.', 'BECOME EMBED™'],
      ['Shutdown preparation agent', 'Tracks dependencies, permits, contractors, critical-path items and missing information.', 'BECOME EMBED™'],
      ['Concentrator knowledge assistant', 'Retrieves operating procedures, equipment information and historical knowledge with sources.', 'Knowledge intelligence'],
      ['Haulage-delay analyst', 'Structures recurring delay reasons and helps identify patterns for operational review.', 'Decision intelligence'],
      ['Service-contract assistant', 'Supports review of obligations, milestones, evidence and exceptions.', 'BECOME EMBED™'],
    ],
    tecnologiaTitular: 'In safety-critical operations, AI prepares context. The person keeps the decision.',
    tecnologia: 'RAG over technical and operational knowledge, integration with maintenance and operational systems where appropriate, role-based access, human approval for operational actions, traceability and source citation, and evaluation against known operating scenarios.',
    metricasTitular: 'What we measure.',
    metricas: [['Preparation time', ''], ['Information-retrieval time', ''], ['Rework', ''], ['Handover quality', ''], ['Exception resolution time', ''], ['Compliance with planned work', ''], ['Adoption by planners, operators and maintainers', '']],
    empezarTitular: 'Where to start.',
    empezar: [
      'BECOME NOW™ when the challenge is how the team works.',
      'BECOME DISCOVER™ when the investment decision is still open.',
      'BECOME EMBED™ when a priority process has to reach operation.',
    ],
    cierre: 'Explore AI for mining operations.',
    cierreTexto: 'Show us where time is lost gathering background, preparing a shift, reviewing a shutdown or explaining a deviation.',
  },

  'retail-consumo-masivo': {
    nombre: 'Retail & consumer goods',
    menu: 'Inventory, category management, e-commerce, marketplace, fulfillment, returns and commercial operations.',
    h1: 'When the market changes every week, late decisions cost sales.',
    lead: 'Retail value is lost in the gaps between demand, stock, price, content, orders, stores, e-commerce and fulfillment. The opportunity is not another dashboard. It is faster, more consistent decisions across the commercial operation.',
    contexto: [
      'The bottleneck appears when the judgment needed to decide, publish or resolve an exception does not scale at the same rate as volume.',
      'AI helps when it prepares decisions, keeps information consistent across channels and resolves cases with better context.',
    ],
    oportunidadesTitular: 'Where AI can create value.',
    oportunidades: [
      ['Category management', ''], ['Inventory and availability', ''], ['Pricing and promotion support', ''],
      ['Product catalog enrichment', ''], ['E-commerce content operations', ''], ['Marketplace management', ''],
      ['Order and fulfillment exceptions', ''], ['Delivery and store pickup', ''], ['Returns and exchanges', ''],
      ['Customer service', ''], ['Trade marketing', ''], ['Sell-in / sell-out analysis', ''],
    ],
    workflowsTitular: 'Where the work starts.',
    workflows: ['Assortment', 'Inventory', 'Pricing', 'Promotions', 'E-commerce', 'Stores', 'Distribution', 'After-sales'],
    capacidades: [
      ['Category copilot', 'Combines sales, stock, promotion and assortment context to prepare commercial decisions.', 'BECOME EMBED™'],
      ['Catalog operations assistant', 'Structures and enriches product information while enforcing content standards.', 'BECOME EMBED™'],
      ['Order-exception agent', 'Identifies fulfillment issues, gathers context and routes exceptions to the right team.', 'BECOME EMBED™'],
      ['Marketplace operations assistant', 'Supports product, inventory and seller-operation workflows across marketplace environments.', 'BECOME EMBED™'],
      ['Returns intelligence assistant', 'Structures reasons, patterns and operational impact across return and exchange flows.', 'Knowledge intelligence'],
    ],
    tecnologiaTitular: 'AI can multiply output. Rules and approvals decide what can be published.',
    tecnologia: 'LLMs, a structured catalog, RAG over commercial policy, API integrations, brand rules, human review and logging.',
    metricasTitular: 'What we measure.',
    metricas: [['Time to decision', ''], ['Manual catalog effort', ''], ['Order exception time', ''], ['Return-resolution time', ''], ['Stock-related lost sales', ''], ['Commercial-team adoption', '']],
    empezarTitular: 'Where to start.',
    empezar: [
      'BECOME NOW™ when the challenge is how the team works.',
      'BECOME DISCOVER™ when the investment decision is still open.',
      'BECOME EMBED™ when a priority process has to reach operation.',
    ],
    cierre: 'Explore AI for retail operations.',
    cierreTexto: 'Pick the commercial or operational cycle that repeats every week, where speed and quality can be measured together.',
  },

  'turismo-hoteleria': {
    nombre: 'Travel & hospitality',
    menu: 'Reservations, revenue operations, guest service, housekeeping, groups, events and loyalty.',
    h1: 'The guest experience is won or lost across hundreds of small moments.',
    lead: 'Hospitality depends on coordination across reservations, pricing, front desk, service, housekeeping, maintenance, events and guest communication. AI creates value when it strengthens that operating system without making the experience feel automated.',
    contexto: [
      'The experience depends on the team having the right context at the right moment: availability, rate, policy, reservation, preferences, requests, benefits and open items.',
      'AI works when it brings that context closer to the service and reduces searching between teams, without turning an exception into an automatic decision.',
    ],
    oportunidadesTitular: 'Where AI can create value.',
    oportunidades: [
      ['Reservations', ''], ['Revenue-management support', ''], ['Pre-arrival communication', ''],
      ['Check-in and check-out support', ''], ['Guest service', ''], ['Housekeeping coordination', ''],
      ['Maintenance requests', ''], ['No-show and cancellation workflows', ''], ['Service recovery', ''],
      ['Groups and events', ''], ['Corporate accounts', ''], ['Loyalty and post-stay engagement', ''],
    ],
    workflowsTitular: 'Where the work starts.',
    workflows: ['Reservations', 'Revenue', 'Guest service', 'Hotel operations', 'Events', 'Reputation', 'Loyalty'],
    capacidades: [
      ['Reservation copilot', 'Supports agents with policy, availability context, guest history and next-best actions.', 'BECOME EMBED™'],
      ['Pre-arrival assistant', 'Coordinates relevant guest communication based on reservation context and operating rules.', 'BECOME EMBED™'],
      ['Guest-service agent', 'Handles defined requests and routes exceptions while keeping the operating team in control.', 'BECOME EMBED™'],
      ['Housekeeping coordination assistant', 'Structures room status, priorities, exceptions and handoffs.', 'BECOME EMBED™'],
      ['Service-recovery assistant', 'Brings together case history, policy and available actions to support faster resolution.', 'Knowledge intelligence'],
    ],
    tecnologiaTitular: 'AI brings the context closer to the service. The exception stays a human decision.',
    tecnologia: 'RAG over policy and procedure, scoped reservation and service agents, API integrations with authorized reservation and operations systems, permissions, traceability, human review and escalation rules.',
    metricasTitular: 'What we measure.',
    metricas: [['Response time', ''], ['Resolution time', ''], ['Manual handling', ''], ['Service-recovery time', ''], ['No-show reduction', ''], ['Team adoption', ''], ['Guest-experience indicators where available', '']],
    empezarTitular: 'Where to start.',
    empezar: [
      'BECOME NOW™ when the challenge is how the team works.',
      'BECOME DISCOVER™ when the investment decision is still open.',
      'BECOME EMBED™ when a priority process has to reach operation.',
    ],
    cierre: 'Explore AI for hospitality operations.',
    cierreTexto: 'Start with the moment where the guest is waiting and the team needs context.',
  },

  'inmobiliario-construccion': {
    nombre: 'Real estate & construction',
    menu: 'Sales, post-sale, project controls, BIM, RFIs, quantities, valuations and contract administration.',
    h1: 'A project changes every day. So does the information around it.',
    lead: 'Commercial, legal, engineering, site, suppliers, supervision and the client all work on documents, versions, commitments and dates that keep moving. AI helps where a decision depends on finding the right version, spotting an open item or gathering background before it becomes a delay.',
    contexto: [
      'Real estate: land and feasibility, product, commercial inventory, leads, reservation, financing, contract, handover and post-sale.',
      'Construction: planning, production control, BIM, technical queries, quantities, valuations, contract administration, changes, procurement and closeout.',
    ],
    oportunidadesTitular: 'Where AI can create value.',
    oportunidades: [
      ['Land and feasibility information', ''], ['Lead qualification', ''], ['Inventory and unit availability', ''],
      ['Reservation and down-payment workflows', ''], ['Approval-letter tracking', ''], ['Contract and closing documentation', ''],
      ['Handover', ''], ['Post-sale and warranty cases', ''], ['Planning and production control', ''],
      ['BIM knowledge', ''], ['RFIs and technical queries', ''], ['Quantities and progress', ''],
      ['Valuations', ''], ['Contract administration', ''], ['Changes and additional works', ''],
      ['Procurement and subcontractor information', ''], ['Project closeout and as-built documentation', ''],
    ],
    workflowsTitular: 'Where the work starts.',
    workflows: ['Land', 'Projects', 'Sales', 'Contracts', 'Site', 'Valuations', 'Handover', 'Post-sale'],
    capacidades: [
      ['Sales copilot', 'Answers on units, pricing, availability and conditions from approved inventory and documentation.', 'BECOME EMBED™'],
      ['Document-completeness agent', 'Tracks the path from lead to reservation to contract, with open items in view.', 'BECOME EMBED™'],
      ['RFI assistant', 'Retrieves specifications, drawings, background and prior answers before a query is prepared.', 'Knowledge intelligence'],
      ['Valuation-preparation agent', 'Structures progress, quantities, supporting evidence, observations and open items for review.', 'BECOME EMBED™'],
      ['Contract-knowledge assistant', 'Finds obligations, communications, milestones, deadlines and precedent across the contract record.', 'Knowledge intelligence'],
      ['Closeout knowledge assistant', 'Organizes punch lists, dossiers, as-built drawings, manuals, warranties and evidence.', 'BECOME EMBED™'],
    ],
    tecnologiaTitular: 'AI can compare and prepare. The technical, legal or commercial conclusion keeps an owner.',
    tecnologia: 'Document-grounded RAG, BIM and document integration where feasible, role-based access, approval flows, source traceability and exception handling.',
    metricasTitular: 'What we measure.',
    metricas: [['Search and review time', ''], ['RFI response preparation', ''], ['Document completeness', ''], ['Valuation preparation time', ''], ['Rework', ''], ['Post-sale resolution time', '']],
    empezarTitular: 'Where to start.',
    empezar: [
      'BECOME NOW™ when the challenge is how the team works.',
      'BECOME DISCOVER™ when the investment decision is still open.',
      'BECOME EMBED™ when a priority process has to reach operation.',
    ],
    cierre: 'Explore AI for real estate and construction.',
    cierreTexto: 'Start at the point in the project where a version, an open item or an approval can turn into a delay.',
  },

  'salud-farmaceutica': {
    nombre: 'Healthcare & pharma',
    menu: 'Appointments, admission, authorizations, billing, reimbursements, supply and administrative operations.',
    h1: 'Better operations create more room for care.',
    lead: 'Clinics, health networks, insurers and pharmaceutical companies run appointments, admission, authorizations, billing, reimbursements, supply, documentation and internal knowledge. BECOME applies AI to those processes to recover time and improve consistency.',
    contexto: [
      'The work starts in the administrative process, not in the consultation: what happens before and around care is where time is lost.',
      'Where a process approaches a clinical decision, the boundary is defined before anything is built and the decision stays with the responsible professional.',
    ],
    limite: {
      titulo: 'Where we do not operate.',
      texto: 'BECOME focuses on administrative and operational capabilities. We do not position these solutions as substitutes for diagnosis, treatment decisions or clinical judgment.',
    },
    oportunidadesTitular: 'Where AI can create value.',
    oportunidades: [
      ['Appointment and rescheduling workflows', ''], ['Admission', ''], ['Insurance and authorization support', ''],
      ['Guarantee-letter preparation', ''], ['Billing and reconciliation', ''], ['Reimbursements', ''],
      ['Administrative patient service', ''], ['Procurement and supply', ''], ['Internal procedures and knowledge', ''],
      ['Staff training and policy access', ''],
    ],
    workflowsTitular: 'Where the work starts.',
    workflows: ['Appointments', 'Admission', 'Authorizations', 'Billing', 'Supply', 'Documentation', 'Non-clinical operations'],
    capacidades: [
      ['Appointment operations assistant', 'Supports scheduling, rescheduling, reminders and exception handling.', 'BECOME EMBED™'],
      ['Authorization knowledge assistant', 'Retrieves internal policies, payer requirements and case context.', 'Knowledge intelligence'],
      ['Billing-reconciliation agent', 'Structures discrepancies and supports exception workflows.', 'BECOME EMBED™'],
      ['Reimbursement assistant', 'Helps organize documentation, missing information and status follow-up.', 'BECOME EMBED™'],
      ['Internal knowledge assistant', 'Provides grounded access to procedures, policies and operational guidance.', 'Knowledge intelligence'],
    ],
    tecnologiaTitular: 'The boundary is set before anything is built, and clinical judgment is never inside it.',
    tecnologia: 'Strict access controls, source-grounded responses, human review for consequential decisions, a clear boundary between administrative and clinical use, and traceability and logging.',
    metricasTitular: 'What we measure.',
    metricas: [['Administrative cycle time', ''], ['Rework', ''], ['Missing-document rate', ''], ['Resolution time', ''], ['Staff adoption', ''], ['Process consistency', '']],
    empezarTitular: 'Where to start.',
    empezar: [
      'BECOME NOW™ when the challenge is how the team works.',
      'BECOME DISCOVER™ when the investment decision is still open.',
      'BECOME EMBED™ when a priority process has to reach operation.',
    ],
    cierre: 'Explore AI for healthcare operations.',
    cierreTexto: 'Start with the administrative process that consumes time without forming part of the clinical decision.',
  },
};

const datos = JSON.parse(readFileSync(RUTA, 'utf8'));
const espanolAntes = JSON.stringify(datos.map((i) => i.es));
let campos = 0;

for (const industria of datos) {
  const slug = industria.slug?.es;
  const nuevo = COPY[slug];
  if (!nuevo) { console.error(`::error::No English copy for ${slug}`); process.exit(1); }
  for (const [k, v] of Object.entries(nuevo)) {
    if (JSON.stringify(industria.en[k]) !== JSON.stringify(v)) campos += 1;
    industria.en[k] = v;
  }
  console.log(`  ${industria.slug.en}: ${nuevo.oportunidades.length} value areas · ${nuevo.capacidades.length} things BECOME can build · ${nuevo.metricas.length} measures`);
}

/* Spanish must come out untouched. This is the whole point of the file. */
if (JSON.stringify(datos.map((i) => i.es)) !== espanolAntes) {
  console.error('::error::The Spanish side changed. It must not.');
  process.exit(1);
}

writeFileSync(RUTA, `${JSON.stringify(datos, null, 2)}\n`);
console.log(`\nEnglish industry copy applied · ${campos} fields changed · Spanish untouched`);
