(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SpeakerConferenceResearch = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const reviewedOn = '2026-11-15';
  const exact = 'exact-prior-edition';
  const related = 'related-organizer-evidence';
  const current = 'current-program-evidence';

  const items = [
    {
      opportunityId: 'data-saturday-denmark-2027',
      conferenceName: 'Data Saturday Denmark 2027', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: Data Saturday Denmark 2026 — 31 January 2026', url: 'https://datasaturdays.com/Event/20260131-datasaturday0074'},
      recurringPatterns: ['Practical Microsoft data-platform sessions mix Fabric, analytics, AI and cloud architecture.', 'AI sessions favor working demos, responsible use and production data pipelines over broad trend surveys.'],
      representativeSessions: [
        {title: 'From Code to Context - Decoding the Next Wave of AI', theme: 'RAG, agents and MCP applied to real data pipelines.', url: 'https://datasaturdays.com/Event/20260131-datasaturday0074#sz-session-997717', evidenceKind: exact},
        {title: 'Responsible and effective use of AI for technical documentation', theme: 'Governed, useful AI assistance in an engineering workflow.', url: 'https://datasaturdays.com/Event/20260131-datasaturday0074', evidenceKind: exact},
        {title: 'Empowering your data platform with AI', theme: 'Adding AI capabilities to an existing Microsoft data platform.', url: 'https://datasaturdays.com/Event/20260131-datasaturday0074', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'Reliable Data Agents on Azure: From Fabric Context to Observable Workflow', rationale: 'Connect the event’s data-platform focus to a live agent workflow with grounded context, retries, evaluations and telemetry.', baseTalkId: 'reliable-agentic-workflows'},
        {title: 'When the Data Agent Is Unsure: Human Approval for High-Impact Decisions', rationale: 'Extend the prior program’s responsible-AI theme with approval gates, traceable state and safe escalation for enterprise data work.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [{title: 'Official Data Saturday Denmark 2026 event and schedule', url: 'https://datasaturdays.com/Event/20260131-datasaturday0074'}],
      limitations: ['Session details are drawn from the official 2026 schedule; recommendations infer recurring preferences from that single verified prior edition.']
    },
    {
      opportunityId: 'datatune-2027-linkedin',
      conferenceName: 'DataTune 2027', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: DataTune 2026', url: 'https://datatuneconf.com/past-conference-2026.html'},
      recurringPatterns: ['The program joins data engineering, semantics, governance and AI rather than treating agents as a standalone topic.', 'Production readiness, trustworthy answers and practical Microsoft Fabric work recur across workshops and sessions.'],
      representativeSessions: [
        {title: 'From Hallucination to Trust: Grounding Enterprise LLMs with the Semantic Layer', theme: 'Governed semantics improve the trustworthiness of enterprise LLM answers.', url: 'https://datatuneconf.com/past-conference-2026.html#sessions', evidenceKind: exact},
        {title: "It's Fine to Start with Vibes: Just Don't End There! How to go from CLI to Prod", theme: 'Moving an AI experiment from informal prototype to production practice.', url: 'https://datatuneconf.com/past-conference-2026.html#sessions', evidenceKind: exact},
        {title: 'Unlocking the Power of Data Agents and Copilot in Microsoft Fabric', theme: 'Data agents and Copilot applied inside the Fabric ecosystem.', url: 'https://datatuneconf.com/past-conference-2026.html#sessions', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'From Semantic Context to Reliable Action: Production Data Agents on Azure', rationale: 'Pair DataTune’s semantic-layer and Fabric interests with a concrete workflow that evaluates grounding, tool calls and recovery.', baseTalkId: 'reliable-agentic-workflows'},
        {title: 'The Data Copilot Production Scorecard: Quality, Guardrails and Observability', rationale: 'Build directly on the prior edition’s prototype-to-production theme with measurable checks for grounded answers and governed data access.', baseTalkId: 'copilot-to-production'}
      ],
      sources: [{title: 'Official DataTune 2026 sessions, workshops and speakers archive', url: 'https://datatuneconf.com/past-conference-2026.html'}],
      limitations: ['The archive groups sessions on one page, so multiple representative titles share the same official sessions anchor.']
    },
    {
      opportunityId: 'sessionize-aws-community-day-bangladesh-2026',
      conferenceName: 'AWS Community Day Bangladesh 2026', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: AWS Community Day Bangladesh 2025 — 13 December 2025', url: 'https://web.archive.org/web/20260410182444/https://awsugbd.com/'},
      recurringPatterns: ['AWS-native generative AI, Bedrock, Nova and multi-agent architectures had clear program presence.', 'Security, platform automation and concrete deployment stories recur alongside introductory cloud material.'],
      representativeSessions: [
        {title: 'Building Next-Gen Generative AI Solutions: Deep Dive into Amazon Bedrock, Nova, and Agentic AI', theme: 'AWS-native foundations for agentic applications.', url: 'https://web.archive.org/web/20260410182444/https://awsugbd.com/#speakers', evidenceKind: exact},
        {title: 'Multi-Agent 101 on AWS', theme: 'Architecture and coordination patterns for multiple AWS-hosted agents.', url: 'https://web.archive.org/web/20260410182444/https://awsugbd.com/#speakers', evidenceKind: exact},
        {title: 'Automating Our Internal Developer Platform with AWS: Moving from Ticket-Based Ops to a Self-Driving Platform', theme: 'Practical platform automation and developer self-service.', url: 'https://web.archive.org/web/20260410182444/https://awsugbd.com/#speakers', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'Reliable Agentic Workflows Beyond the Demo: Cloud Patterns That Transfer to AWS', rationale: 'Frame the reusable workflow around provider-neutral state, retries, idempotency and observability, with AWS service mappings for this audience.', baseTalkId: 'reliable-agentic-workflows'},
        {title: 'Human Authority in AWS Multi-Agent Systems: Approval, Escalation and Recovery', rationale: 'Answer the prior edition’s multi-agent interest with controls for consequential actions, operator handoff and auditability.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [{title: 'Archived official AWS User Group Bangladesh 2025 program', url: 'https://web.archive.org/web/20260410182444/https://awsugbd.com/'}],
      limitations: ['The organizer domain is now parked; the verified prior program is therefore cited through a dated Internet Archive capture.']
    },
    {
      opportunityId: 'sessionize-ai-agents-day',
      conferenceName: 'AI Agents Day', reviewedOn,
      editionEvidence: {kind: 'current-program-only', label: 'No verified prior edition; nearest official evidence is the published 2026 program', url: 'https://aiagents.day/en/sessions/'},
      recurringPatterns: ['The published program centers on engineering details: memory, standards, security, runtime isolation and multi-agent design.', 'Architecture deep dives, workshops and demos target practitioners rather than general AI awareness.'],
      representativeSessions: [
        {title: 'Cuando los agentes de IA olvidan: cómo implementar Knowledge-Driven Development', theme: 'Preserving architectural and product knowledge for agent development.', url: 'https://aiagents.day/en/speakers/julian-dario-luna-patino/', evidenceKind: current},
        {title: 'From Prototype to Production: Deploying AI Agents with Docker', theme: 'Reproducible deployment, health checks, integration tests, security and operability for a RAG application.', url: 'https://aiagents.day/en/speakers/rami-krispin/', evidenceKind: current},
        {title: 'Give Your Agents Somewhere to Work', theme: 'Secure, repeatable and isolated environments where agent teams can run, test and return decisions.', url: 'https://aiagents.day/en/speakers/oleg-selajev/', evidenceKind: current}
      ],
      recommendations: [
        {title: 'The Production Agent Control Plane: Evaluations, Guardrails and Traces', rationale: 'Match the engineering-first program with a concrete control loop for testing behavior, enforcing policy and diagnosing tool calls.', baseTalkId: 'copilot-to-production'},
        {title: 'Humans as First-Class Nodes in Multi-Agent Workflows', rationale: 'Add explicit pause, approval, rejection and resume semantics to the event’s multi-agent architecture focus.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [
        {title: 'Official AI Agents Day schedule and talks', url: 'https://aiagents.day/en/sessions/'},
        {title: 'Official AI Agents Day event page', url: 'https://aiagents.day/en'},
        {title: 'Active AI Agents Day Sessionize CFP', url: 'https://sessionize.com/ai-agents-day'}
      ],
      limitations: ['No verified prior edition or organizer archive was located. The official program says 4 December 2026 while the active Sessionize CFP says 12 December 2026; the organizer should confirm the event date.']
    },
    {
      opportunityId: 'sessionize-london-containerdays-and-ai-context-2027',
      conferenceName: 'ContainerDays, AI Context & Physical AI London 2027', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: ContainerDays London 2026 with MCPconference — 11 February 2026', url: 'https://www.containerdays.io/containerdays-london-2026/mcpconference-agenda/'},
      recurringPatterns: ['Cloud-native operations, security and observability are applied directly to MCP and agent systems.', 'The program rewards technically deep production architecture, context management and multi-agent orchestration.'],
      representativeSessions: [
        {title: 'MCP Security: Keep Your AI Agents from Spilling the Tea', theme: 'Security controls for agents and tool-connected systems.', url: 'https://www.containerdays.io/containerdays-london-2026/mcpconference-agenda/', evidenceKind: exact},
        {title: 'Context Graphs for Explainable, Decision-Aware AI Agents', theme: 'Structured context and explainable agent decisions.', url: 'https://www.containerdays.io/containerdays-london-2026/mcpconference-agenda/', evidenceKind: exact},
        {title: 'From Kubernetes to Photons: Orchestrating Multi-Agent AI for Entertainment', theme: 'Multi-agent orchestration spanning cloud-native infrastructure and physical experiences.', url: 'https://www.containerdays.io/containerdays-london-2026/mcpconference-agenda/', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'Cloud-Native Reliability for Agentic Workflows: State, Retries and OpenTelemetry', rationale: 'Translate the Azure workflow into portable cloud-native primitives and traces that fit the ContainerDays audience.', baseTalkId: 'reliable-agentic-workflows'},
        {title: 'Human Approval Is an API: Control Boundaries for MCP and Multi-Agent Systems', rationale: 'Tie human authority to MCP tool permissions, durable workflow state and auditable escalation boundaries.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [
        {title: 'Official ContainerDays London 2026 MCPconference agenda', url: 'https://www.containerdays.io/containerdays-london-2026/mcpconference-agenda/'},
        {title: 'ContainerDays Conference 2025 recordings playlist', url: 'https://www.youtube.com/playlist?list=PLHhKcdBlprMcXioPQP4QVF7p16kayKUF5'}
      ],
      limitations: ['The 2027 brand adds AI Context and Physical AI; the most comparable prior evidence is the 2026 ContainerDays London MCPconference program.']
    },
    {
      opportunityId: 'sessionize-gppb-ng2027',
      conferenceName: 'Global Power Platform Bootcamp 2027 | Northern Germany (Hamburg)', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: Global Power Platform Bootcamp 2026 | Northern Germany in Hannover — 21 February 2026', url: 'https://global-power-platform-bootcamp-2026-haj.sessionize.com/schedule/day/20260221'},
      recurringPatterns: ['Copilot Studio agents are presented through concrete business workflows and service interfaces.', 'Governance, environment strategy, security and automation sit alongside low-code implementation demos.'],
      representativeSessions: [
        {title: 'Voice to Value – Turning Spoken Input into Forms and Documents using Copilot Agents', theme: 'A practical agent workflow from voice input to business documents.', url: 'https://global-power-platform-bootcamp-2026-haj.sessionize.com/session/1125135', evidenceKind: exact},
        {title: 'Meet Edgar the Enterprise Service Management Agent', theme: 'Specialist agents exposed through one service-management interface.', url: 'https://global-power-platform-bootcamp-2026-haj.sessionize.com/session/1136165', evidenceKind: exact},
        {title: 'Administrierst du noch oder automatisierst du schon?', theme: 'Repeatable administration through infrastructure as code, governance and compliance.', url: 'https://global-power-platform-bootcamp-2026-haj.sessionize.com/session/1133286', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'From Copilot Studio Demo to Governed Service: Test, Trace and Operate Your Agent', rationale: 'Build on prior hands-on agent content with a lifecycle for automated evaluation, policy checks and operational telemetry.', baseTalkId: 'copilot-to-production'},
        {title: 'One Front Door, Human Authority: Approval Patterns for Specialist Copilot Agents', rationale: 'Extend the prior multi-agent service pattern with explicit approval, escalation and resume flows for consequential work.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [{title: 'Official GPPB 2026 Northern Germany schedule', url: 'https://global-power-platform-bootcamp-2026-haj.sessionize.com/schedule/day/20260221'}],
      limitations: ['The verified prior edition was in Hannover; the 2027 Northern Germany edition moves to Hamburg.']
    },
    {
      opportunityId: 'sessionize-net-conf-2026-ahmedabad-in-person',
      conferenceName: '.NET Conf 2026 Ahmedabad (In-Person)', reviewedOn,
      editionEvidence: {kind: related, label: 'Related organizer evidence: M365 Ahmedabad User Group 2025 program; no earlier Ahmedabad .NET Conf-branded edition verified', url: 'https://www.meetup.com/m365ahmedabad/events/'},
      recurringPatterns: ['Organizer events favor practical Microsoft-stack demonstrations across Azure AI, Copilot Studio and developer tooling.', 'Short community sessions emphasize implementation steps and accessible entry points.'],
      representativeSessions: [
        {title: 'BYOD into Azure OpenAI', theme: 'Connecting organizational data to Azure OpenAI.', url: 'https://www.meetup.com/m365ahmedabad/events/304895569', evidenceKind: related},
        {title: 'Build your own agent using Microsoft Copilot Studio', theme: 'Practical low-code agent construction.', url: 'https://www.meetup.com/m365ahmedabad/events/304895569', evidenceKind: related},
        {title: 'Season of AI - Model Context Protocol (MCP)', theme: 'Community-oriented introduction to MCP and connected AI tools.', url: 'https://www.meetup.com/m365ahmedabad/events/311434250', evidenceKind: related}
      ],
      recommendations: [
        {title: 'Reliable AI Agents in .NET on Azure: A Live Workflow from Tool Call to Trace', rationale: 'Offer the organizer’s preferred practical format while adding .NET implementation, failure recovery and end-to-end observability.', baseTalkId: 'reliable-agentic-workflows'},
        {title: 'From Copilot Prototype to Production .NET Service', rationale: 'Connect Copilot Studio interest to evaluation, guardrails and telemetry that .NET developers can apply immediately.', baseTalkId: 'copilot-to-production'}
      ],
      sources: [
        {title: 'M365 Ahmedabad User Group organizer archive', url: 'https://www.meetup.com/m365ahmedabad/events/'},
        {title: 'Active .NET Conf 2026 Ahmedabad CFP', url: 'https://sessionize.com/net-conf-2026-ahmedabad-in-person'}
      ],
      limitations: ['No earlier Ahmedabad event with the exact .NET Conf branding was verified; all representative sessions are clearly labeled related organizer evidence.']
    },
    {
      opportunityId: 'sessionize-net-conf-2026-net-baires',
      conferenceName: '.NET Conf 2026 - .Net Baires', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: .NET Baires Conf 2025 — 15–18 December 2025', url: 'https://www.meetup.com/es/net-baires/events/311541156/'},
      recurringPatterns: ['Compact demos span .NET releases, Aspire, Blazor, MAUI, Azure Functions, MCP and Copilot Studio.', 'Agent Framework, orchestration, observability and data-connected agents were already prominent in 2025.'],
      representativeSessions: [
        {title: 'MCP Servers y Agent Framework', theme: 'MCP servers and Microsoft Agent Framework implementation in .NET.', url: 'https://www.youtube.com/watch?v=S4t9DFpsU6Q', evidenceKind: exact},
        {title: '.NET MAUI + Aspire', theme: 'Code-oriented combination of cross-platform applications and distributed-app tooling.', url: 'https://sebaleoperez.github.io/dotnet-baires-conf-2025-dia-2-en', evidenceKind: exact},
        {title: 'Del Dato a la Acción: Data Agents en Copilot Studio', theme: 'Connecting Microsoft Fabric data agents to Copilot Studio and exposing them through multiple channels.', url: 'https://www.youtube.com/watch?v=1ae3P-g7Cu8', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'Agentes que se pueden depurar: flujos multiagente en .NET con aprobación humana', rationale: 'Use a concise .NET demo with explicit transitions, approval gates, shared state and traces for a Spanish-speaking practitioner audience.', baseTalkId: 'human-loop-multi-agent'},
        {title: 'Del demo a producción: evaluación y observabilidad de agentes .NET', rationale: 'Build on the prior MCP and Agent Framework material with tests, guardrails and operational diagnostics.', baseTalkId: 'copilot-to-production'}
      ],
      sources: [
        {title: 'Official .NET Baires 2025 Meetup event', url: 'https://www.meetup.com/es/net-baires/events/311541156/'},
        {title: '.NET Baires Conf 2025 day notes and recordings', url: 'https://sebaleoperez.github.io/dotnet-baires-conf-2025-dia-4-en/'}
      ],
      limitations: ['Some session details come from organizer recordings and community-authored day notes rather than a single archived schedule page.']
    },
    {
      opportunityId: 'sessionize-devfest-budapest-2026-on-campus',
      conferenceName: 'DevFest Budapest 2026 - On Campus Conference', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: DevFest Budapest 2025 - The AI Conference', url: 'https://gdg.community.dev/events/details/google-gdg-budapest-presents-devfest-budapest-2025-the-ai-conference/'},
      recurringPatterns: ['The prior edition was explicitly AI-focused and mixed Google technologies with stack-neutral engineering practice.', 'Agent systems, production deployment and responsible design fit the practical developer-community format.'],
      representativeSessions: [
        {title: 'Navigating Agentic Frameworks: Practical guidance for developers', theme: 'Comparing LangGraph, CrewAI, OpenAI Agents SDK, Google ADK and AutoGen through a decision framework.', url: 'https://gdg.community.dev/events/details/google-gdg-budapest-presents-devfest-budapest-2025-the-ai-conference/', evidenceKind: exact},
        {title: 'The 30-Minute Agent: A Hands-On Live Build', theme: 'Live-building and deploying an agent with Gemini CLI, Agent Starter Pack and Google ADK.', url: 'https://gdg.community.dev/events/details/google-gdg-budapest-presents-devfest-budapest-2025-the-ai-conference/', evidenceKind: exact},
        {title: 'Agents to Zero: Experiments with Serverless Multi-Agent Architectures on Google Cloud', theme: 'Elastic multi-agent architecture, communication, stateless memory, cold starts, latency and concurrency.', url: 'https://gdg.community.dev/events/details/google-gdg-budapest-presents-devfest-budapest-2025-the-ai-conference/', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'When Agents Should Stop: Human Approval Patterns for Multi-Agent Systems', rationale: 'Complement the prior autonomous-agent focus with stack-neutral pause, escalation, approval and recovery patterns.', baseTalkId: 'human-loop-multi-agent'},
        {title: 'The Production Agent Scorecard: Evaluations, Guardrails and Observability Before Launch', rationale: 'Give student and professional developers a reusable checklist and demo for testing agents before deployment.', baseTalkId: 'copilot-to-production'}
      ],
      sources: [{title: 'Official GDG DevFest Budapest 2025 event page', url: 'https://gdg.community.dev/events/details/google-gdg-budapest-presents-devfest-budapest-2025-the-ai-conference/'}],
      limitations: ['The official event page is the verified prior-edition source, but it does not provide stable per-session URLs for every agenda item.']
    },
    {
      opportunityId: 'sessionize-dotnet-local-conf-2026-coimbatore',
      conferenceName: '.NET Conf 2026 - Coimbatore', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: .NET Conf 2025 Coimbatore — 22 November 2025', url: 'https://sessionize.com/dot-netconf-2025-coimbatore'},
      recurringPatterns: ['The agenda is implementation-oriented, with short talks on .NET agents, MCP, cloud delivery and developer tooling.', 'Introductory material is strongest when backed by a working demo and concrete architecture.'],
      representativeSessions: [
        {title: 'Building Intelligent Agents in .NET with the Microsoft Agent Framework', theme: 'Introductory agent implementation in .NET.', url: 'https://www.townscript.com/e/dot-net-conf-2025', evidenceKind: exact},
        {title: 'Demystifying MCP: Your First "AI Agent" with .NET 10', theme: 'A first working MCP-connected agent for .NET developers.', url: 'https://www.townscript.com/e/dot-net-conf-2025', evidenceKind: exact},
        {title: 'Cloud, DevOps & GitHub integration', theme: 'Cloud delivery and developer workflow integration.', url: 'https://www.townscript.com/e/dot-net-conf-2025', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'Beyond Your First .NET Agent: Reliable Workflows on Azure', rationale: 'Follow the prior introductory agent sessions with state, retries, tool-call safety and OpenTelemetry in a working .NET demo.', baseTalkId: 'reliable-agentic-workflows'},
        {title: 'Testing the .NET Agent You Just Built: Evals, Guardrails and Diagnostics', rationale: 'Turn the prior edition’s first-agent material into a practical next step for production quality.', baseTalkId: 'copilot-to-production'}
      ],
      sources: [
        {title: 'Prior .NET Conf 2025 Coimbatore event listing', url: 'https://sessionize.com/dot-netconf-2025-coimbatore'},
        {title: 'Archived ticket and agenda listing for .NET Conf 2025 Coimbatore', url: 'https://www.townscript.com/e/dot-net-conf-2025'}
      ],
      limitations: ['The former ticket site now shows a closure notice, so the exact prior event is identified through its Sessionize listing and the indexed agenda URL.']
    },
    {
      opportunityId: 'azureday-poland-2027',
      conferenceName: 'AzureDay Poland 2027', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: AzureDay Poland 2026 — 12 March 2026', url: 'https://web.archive.org/web/20260307124833/https://azureday.pl/'},
      recurringPatterns: ['The program asks for real-life Azure use cases and lessons across development, operations, DevOps, data, AI and security.', 'Architecture simplicity, identity automation, AI platforms and production delivery appear together rather than in isolated tracks.'],
      representativeSessions: [
        {title: 'The Future of Deployments: AI-Powered Infrastructure Onboarding on Azure', theme: 'A real-life AI-assisted internal developer platform case study.', url: 'https://sessionize.com/api/v2/tfqfsdms/view/Sessions', evidenceKind: exact},
        {title: 'Using Microsoft AutoGen framework to build multiagent AI applications', theme: 'Introductory multi-agent development with AutoGen.', url: 'https://sessionize.com/api/v2/tfqfsdms/view/Sessions', evidenceKind: exact},
        {title: 'Entra ID Security as Code: Automating Identity Protection', theme: 'Repeatable identity governance and security automation.', url: 'https://sessionize.com/api/v2/tfqfsdms/view/Sessions', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'Building Reliable Agentic Workflows on Azure: What Breaks After the Demo', rationale: 'Match the conference’s real-life lessons format with failure modes, durable state, evaluations and OpenTelemetry from an end-to-end Azure demo.', baseTalkId: 'reliable-agentic-workflows'},
        {title: 'Human Approval as Azure Architecture: Governing Multi-Agent Decisions', rationale: 'Join the prior multi-agent and identity themes through explicit authority boundaries, Entra-backed actions and auditable workflow state.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [
        {title: 'Archived official AzureDay Poland 2026 site', url: 'https://web.archive.org/web/20260307124833/https://azureday.pl/'},
        {title: 'Official embedded AzureDay Poland 2026 Sessionize sessions', url: 'https://sessionize.com/api/v2/tfqfsdms/view/Sessions'}
      ],
      limitations: ['The live conference site now describes 2027; the 2026 edition is preserved through a dated official-site archive and its embedded Sessionize schedule.']
    },
    {
      opportunityId: 'sessionize-colorcloud-hamburg-2027',
      conferenceName: 'ColorCloud Hamburg 2027', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: ColorCloud Hamburg 2026 — AI track', url: 'https://colorcloud.rocks/tracks/ai/'},
      recurringPatterns: ['The AI track emphasizes practical Copilot Studio and agent choices: MCP, Agent Builder comparisons, testing and business deployment.', 'Compliance, data boundaries, role-based access and traceability appear alongside usability and adoption.'],
      representativeSessions: [
        {title: 'MCP or not to MCP - that is THE question', theme: 'Choosing MCP only where it creates real architectural value.', url: 'https://colorcloud.rocks/tracks/ai/', evidenceKind: exact},
        {title: 'Rethinking Test Automation: Streamlining Agent Development with the Copilot Studio Kit', theme: 'Repeatable testing for custom Copilot Studio agents.', url: 'https://colorcloud.rocks/tracks/ai/', evidenceKind: exact},
        {title: 'From Vibe Coding to Agentic Engineering: Building Production-Ready Dataverse Code with AI', theme: 'Moving AI-assisted development toward tested Dataverse engineering.', url: 'https://colorcloud.rocks/speakers', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'Your Copilot Studio Agent Passed the Demo—Now Make It Pass Production', rationale: 'Extend the prior testing content with an evaluation suite, guardrails, trace review and release gates for business agents.', baseTalkId: 'copilot-to-production'},
        {title: 'The Approval Palette: Human Control Patterns for Multi-Agent Business Processes', rationale: 'Fit ColorCloud’s business-app audience with visual approval, escalation and recovery patterns across specialist agents.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [
        {title: 'Official ColorCloud Hamburg 2026 AI track', url: 'https://colorcloud.rocks/tracks/ai/'},
        {title: 'Official ColorCloud 2026 speaker catalog', url: 'https://colorcloud.rocks/speakers'}
      ],
      limitations: ['The official track pages are live-site content and may later be replaced; all evidence was reviewed on the stated date.']
    },
    {
      opportunityId: 'sessionize-alohai-2026',
      conferenceName: 'AlohAI 2026', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: AlohAI 2025 — 30 December 2025, Honolulu', url: 'https://www.communitydays.org/event/2025-12-30/alohai-power-platform-plus-ai'},
      recurringPatterns: ['The community event centers Power Platform, Copilot Studio, MCP and GitHub Copilot in practical local scenarios.', 'Business value, low-code accessibility and concrete demos matter more than abstract AI architecture.'],
      representativeSessions: [
        {title: 'Power Apps, Power Automate, Power BI, and Power Pages deep dives', theme: 'Practical low-code Microsoft business-application development.', url: 'https://www.communitydays.org/event/2025-12-30/alohai-power-platform-plus-ai', evidenceKind: exact},
        {title: 'Plan Designer generating enterprise models from natural language', theme: 'Natural-language assistance for business solution design.', url: 'https://www.communitydays.org/event/2025-12-30/alohai-power-platform-plus-ai', evidenceKind: exact},
        {title: 'Copilot Studio, MCP and GitHub Copilot demonstrations', theme: 'Hands-on agent and developer-assistance workflows.', url: 'https://alohaiconf.com/', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'From Island Business Story to Reliable Copilot Agent', rationale: 'Use a relatable local-service scenario to show testing, policy boundaries and telemetry without losing the accessible demo-first format.', baseTalkId: 'copilot-to-production'},
        {title: 'Keep a Human in the Lei: Approval Patterns for Community-Scale Agents', rationale: 'Adapt multi-agent controls to small organizations where trust, simple handoff and clear accountability matter.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [
        {title: 'Community Days AlohAI 2025 event archive', url: 'https://www.communitydays.org/event/2025-12-30/alohai-power-platform-plus-ai'},
        {title: 'Official AlohAI conference site', url: 'https://alohaiconf.com/'}
      ],
      limitations: ['The archived Community Days page exposes broad session descriptions rather than stable links for every individual talk.']
    },
    {
      opportunityId: 'sessionize-cncf-hosted-co-located-events-europe-2027',
      conferenceName: 'CNCF-Hosted Co-located Events Europe 2027', reviewedOn,
      editionEvidence: {kind: exact, label: 'Verified prior edition: CNCF-hosted Co-located Events Europe 2026 — 23 March 2026', url: 'https://events.linuxfoundation.org/archive/2026/kubecon-cloudnativecon-europe/co-located-events/cncf-hosted-co-located-schedule/'},
      recurringPatterns: ['Agentics content treats security, identity, authorization and operational readiness as platform concerns.', 'Observability and production operations use cloud-native signals and concrete deployment experience.'],
      representativeSessions: [
        {title: 'Keeping Your Agents in Check: Layered Security for Agentic Platforms in Production', theme: 'Layered guardrails, identity, authorization and prompt-injection defenses.', url: 'https://colocatedeventseu2026.sched.com/event/2DY7P/keeping-your-agents-in-check-layered-security-for-agentic-platforms-in-production-evaline-ju-ibm-research-kelly-abuelsaad-ibm', evidenceKind: exact},
        {title: 'Observability in the Matrix: Choosing the Right AI Agent To Escape the Chaos', theme: 'Metrics, logs, traces and root-cause analysis for autonomous agents.', url: 'https://colocatedeventseu2026.sched.com/event/2DY5f/observability-in-the-matrix-choosing-the-right-ai-agent-to-escape-the-chaos-henrik-rexed-dynatrace', evidenceKind: exact},
        {title: 'Rescue Agents from Prototype Purgatory: Operationalize Agent Readiness', theme: 'Readiness criteria and operational controls before production.', url: 'https://colocatedeventseu2026.sched.com/event/2DYGv/agentics-day-mcp-+-agents-sponsored-keynote-rescue-agents-from-prototype-purgatory-operationalize-agent-readiness-ignasi-barrera-tetrateio', evidenceKind: exact}
      ],
      recommendations: [
        {title: 'Agentic Workflows as Cloud-Native Systems: SLOs, Traces and Recovery', rationale: 'Reframe the reusable Azure implementation through portable workflow semantics, OpenTelemetry and platform SLOs.', baseTalkId: 'reliable-agentic-workflows'},
        {title: 'Human Approval at Platform Scale: Policy Gates for Multi-Agent Infrastructure', rationale: 'Connect human authority to identity, authorization and durable workflow state in a CNCF-ready architecture.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [
        {title: 'Official CNCF-hosted Co-located Events Europe 2026 schedule', url: 'https://events.linuxfoundation.org/archive/2026/kubecon-cloudnativecon-europe/co-located-events/cncf-hosted-co-located-schedule/'},
        {title: 'Official 2027 CNCF-hosted co-located events CFP hub', url: 'https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/co-located-events/cfp-colocated-events'}
      ],
      limitations: ['This umbrella CFP covers multiple co-located events; recommendations target the Agentics/MCP evidence in the 2026 umbrella schedule, not every hosted event.']
    },
    {
      opportunityId: 'sessionize-global-ai-dubai',
      conferenceName: 'Global AI Dubai', reviewedOn,
      editionEvidence: {kind: related, label: 'Related organizer evidence: Global AI Dubai chapter programs in 2025–2026; no exact prior conference edition verified', url: 'https://globalai.community/chapters/dubai/'},
      recurringPatterns: ['The chapter repeatedly features AI agents, orchestration, knowledge systems and real production failures.', 'Programs mix Microsoft Copilot Studio, AWS Bedrock and stack-neutral architecture for a broad practitioner audience.'],
      representativeSessions: [
        {title: 'Smart Orchestration: Multi-Agent Systems and Workflows', theme: 'Coordination patterns for multi-agent systems.', url: 'https://globalai.community/e/gy2e4drg', evidenceKind: related},
        {title: 'Build and extend agent experiences with Copilot Studio', theme: 'Practical Microsoft Copilot Studio agent development.', url: 'https://globalai.community/chapters/dubai/events/the-year-of-ai-agents', evidenceKind: related},
        {title: 'Agent Architecture for the Real World: Chaos on Production', theme: 'Production architecture, failure conditions and operational resilience.', url: 'https://globalai.community/chapters/dubai/events/the-year-of-ai-agents', evidenceKind: related}
      ],
      recommendations: [
        {title: 'From Agent Demo to Dubai-Scale Production: An Evaluation and Observability Playbook', rationale: 'Answer the chapter’s production-failure theme with stack-neutral release gates, guardrails and traces, illustrated through the reusable Copilot system.', baseTalkId: 'copilot-to-production'},
        {title: 'Multi-Agent Systems with a Human Decision Boundary', rationale: 'Build on recurring orchestration content with explicit authority, escalation and recovery for enterprise workflows.', baseTalkId: 'human-loop-multi-agent'}
      ],
      sources: [
        {title: 'Official Global AI Dubai chapter archive', url: 'https://globalai.community/chapters/dubai/'},
        {title: 'Official Global AI Dubai — The Year of AI Agents event', url: 'https://globalai.community/chapters/dubai/events/the-year-of-ai-agents'},
        {title: 'Official Global AI Dubai AI Agents Meetup', url: 'https://globalai.community/e/2cu6vzhj'}
      ],
      limitations: ['No exact prior edition of the active Global AI Dubai conference was verified; representative sessions are explicitly related chapter evidence, not claimed as a prior conference agenda.']
    }
  ];

  const byOpportunityId = Object.fromEntries(items.map(item => [item.opportunityId, item]));
  return {schemaVersion: 1, reviewedCount: items.length, scopeNote: '15 priority CFPs are researched; all other opportunities remain pending.', items, byOpportunityId};
});
