import {
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CaseStudy {
  problem: string;
  approach: string[];
  outcome: string;
}

export interface TradeOff {
  decision: string;
  why: string;
}

export interface Metric {
  label: string;
  value: string;
  context: string;
}

export interface Project {
  id: string;
  cat: string;
  name: string;
  badge?: string;
  desc: string;
  proof: string;
  tech: string[];
  featured?: boolean;
  roleCategories: ('fullstack' | 'backend' | 'ai')[];
  caseStudy: CaseStudy;
  /** Stages of the production pipeline, rendered as a flow diagram in the case study. */
  pipeline?: string[];
  /** Index of the stage that acts as the safety gate. */
  gate?: number;
  /** What happens when the gate rejects. */
  gateNote?: string;
  /** Key engineering trade-offs and architectural decisions. */
  tradeoffs?: TradeOff[];
  /** Measurable real-world production metrics. */
  metrics?: Metric[];
}

export interface Impact {
  hi: string;
  label: string;
  desc: string;
}

export interface Capability {
  title: string;
  blurb: string;
  chips: string[];
}

export interface Job {
  role: string;
  org: string;
  period: string;
  points: string[];
  /** Pre-engineering history: kept for accuracy, rendered at lower visual weight. */
  prior?: boolean;
}

export interface Signal {
  label: string;
  value: string;
}

export interface Fit {
  title: string;
  desc: string;
}

export interface Tech {
  name: string;
  url: string;
  category: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  name = 'Murala Thirupathi';
  initials = 'MTR';
  email = 'thirupathiraomurala@gmail.com';
  phone = '+91 96400 46001';
  location = 'Hyderabad, Telangana, India';
  linkedin = 'https://www.linkedin.com/in/thirupathi-murala/';
  github = 'https://github.com/murala-thirupathi';
  year = new Date().getFullYear();

  theme: 'dark' | 'light' = 'dark';
  menuOpen = false;
  resumeOpen = false;
  copied = false;
  resumeCopied = false;
  photoOk = true;
  scrollProgress = 0;
  activeSection = 'top';
  hydTime = '';

  selectedRole: 'all' | 'fullstack' | 'backend' | 'ai' = 'all';

  activeTabMap: Record<string, 'pipeline' | 'tradeoffs' | 'metrics'> = {
    clinical: 'pipeline',
    'capital-approvals': 'pipeline',
    vision: 'pipeline',
    voice: 'pipeline'
  };

  private timer: ReturnType<typeof setInterval> | null = null;
  private observers: IntersectionObserver[] = [];
  private unlistenScroll: (() => void) | null = null;

  sections = ['top', 'work', 'proof', 'craft', 'experience', 'trajectory', 'contact'];
  navItems = [
    { id: 'work', label: 'Work' },
    { id: 'proof', label: 'Proof' },
    { id: 'craft', label: 'Craft' },
    { id: 'experience', label: 'Experience' },
    { id: 'trajectory', label: 'Next' }
  ];

  headline = 'Murala Thirupathi';
  roleLine = 'I turn complex enterprise workflows into software that stays fast, resilient, and correct in production.';
  intro =
    'Backend-first full-stack developer with 5+ years building Java, Spring Boot, and Angular products across HRMS, health, fleet, invoicing, and security. At Aititude IT I introduced the platform’s first production AI features, tuned high-latency queries with Redis, and built scalable multi-tenant architectures teams trust every day.';

  signals: Signal[] = [
    { label: 'Core Stack', value: 'Java 17 · Spring Boot 3 · Angular 18' },
    { label: 'Experience', value: '5+ Years Building Multi-Tenant SaaS' },
    { label: 'Notice Period', value: 'Immediate / Serving Notice (Ready to Join)' },
    { label: 'Location / Work Mode', value: 'Hyderabad · Hybrid or Remote' }
  ];

  fitMatrix: Fit[] = [
    {
      title: 'Full-Stack Product Engineer',
      desc: 'Owns the database schema, Spring Boot APIs, and Angular interfaces end-to-end without losing business context.'
    },
    {
      title: 'Java Backend Specialist',
      desc: 'Deep expertise in REST APIs, JdbcTemplate query tuning, JPA/Hibernate, tenant-aware security, and production debugging.'
    },
    {
      title: 'Practical AI Integrator',
      desc: 'Integrates OpenAI, Gemini, and LangGraph RAG systems with strict validation, fallbacks, and required human review.'
    }
  ];

  impact: Impact[] = [
    {
      hi: '1st',
      label: 'Production AI in the Product',
      desc: 'Architected the platform\'s first OpenAI-powered clinical assistant and fleet vision capture workflows with validation gates.'
    },
    {
      hi: '20+',
      label: 'Production Features Delivered',
      desc: 'Shipped high-impact modules across HRMS, fleet, health, invoices, RBAC security, careers, incident tracking, and approvals.'
    },
    {
      hi: '35+',
      label: 'Business Domains Handled',
      desc: 'Built features across a multi-tenant platform spanning workforce, payroll, billing, assets, fleet, and compliance.'
    },
    {
      hi: '5',
      label: 'Developer Team Led',
      desc: 'Technical lead on a capital approval platform with SHA-256 tamper-evident hash chaining and QR code verification.'
    }
  ];

  projects: Project[] = [
    {
      id: 'clinical',
      roleCategories: ['fullstack', 'backend', 'ai'],
      pipeline: ['Request', 'Prompt + Context', 'Model', 'Validate', 'Doctor Review', 'Persist'],
      gate: 3,
      gateNote: 'Nothing reaches the electronic patient record until a doctor approves it. Model output failing schema validation is discarded.',
      cat: 'AI + Health',
      name: 'AI Clinical Assistant',
      badge: 'OpenAI in Production',
      featured: true,
      desc: 'Contextual clinical support for doctors with prescription-template suggestions, structured validation, and required clinical review.',
      proof: 'First production AI feature shipped in the product.',
      tech: ['OpenAI', 'Spring Boot', 'Angular', 'Schema Validation'],
      caseStudy: {
        problem: 'Doctors lost consultation time to repetitive charting, and the product lacked contextual clinical documentation assistance.',
        approach: [
          'Designed prompt context budgeting, model integration, validation schemas, and review workflows from scratch.',
          'Enforced strict JSON output schemas, validating suggested medicine dosages and contraindications before presentation.',
          'Kept doctor review strictly mandatory: AI outputs are never blindly committed to the medical record.',
          'Integrated the service cleanly into the multi-tenant Spring Boot backend and responsive Angular UI.'
        ],
        outcome: 'Shipped AI-assisted clinical suggestions with an absolute safety checkpoint, creating a reusable enterprise AI pattern.'
      },
      tradeoffs: [
        {
          decision: 'Mandatory Doctor Approval Gate',
          why: 'Never let LLM suggestions auto-commit to patient records. A doctor reviews and approves every suggestion before it reaches a patient record.'
        },
        {
          decision: 'Strict JSON Schema Validation',
          why: 'Free-form text is fragile. We enforce structured JSON output and validate medicine codes against clinical databases.'
        },
        {
          decision: 'Backend Context Redaction',
          why: 'Patient PII is scrubbed before prompt dispatch, safeguarding confidentiality and optimizing token consumption.'
        }
      ],
      metrics: [
        { label: 'Doctor Approval', value: 'Required', context: 'No suggestion reaches a patient record without explicit clinician sign-off' },
        { label: 'Model Output', value: 'Schema-validated', context: 'Strict JSON schema checked against product rules before persistence' },
        { label: 'Invalid Output', value: 'Fail-closed', context: 'Unparsable or rule-violating model text is discarded, never stored' }
      ]
    },
    {
      id: 'capital-approvals',
      roleCategories: ['fullstack', 'backend'],
      pipeline: ['Raise Request', 'Slab Routing', 'Parallel Approvers', 'Completion Rules', 'Budget Commit', 'Audit Trail'],
      gate: 3,
      gateNote: 'Completion rules evaluate approval state. Every step is cryptographically hash-chained to prevent silent tampering.',
      cat: 'Finance & Governance',
      name: 'Capital Approval Platform',
      badge: 'Technical Lead',
      featured: true,
      desc: 'Configurable multi-level approvals, budget tracking, and a tamper-evident audit trail for high-value spend governance.',
      proof: 'Led system architecture and designed the approval engine.',
      tech: ['Java 17', 'Spring Boot 3', 'SQL Server', 'React', 'Cryptography'],
      caseStudy: {
        problem: 'High-value capital approvals required dynamic amount-based routing, real-time budget reservations, and non-repudiable audit logs.',
        approach: [
          'Set up project architecture and engineered the approval state engine: slab-based routing, parallel sign-offs, and custom completion rules.',
          'Implemented atomic budget commitment checks to prevent concurrent expenditure overruns.',
          'Hash-chained every audit log entry to its predecessor using SHA-256, exposing a verification endpoint triggered via printed QR codes.',
          'Led architecture and technical delivery while mentoring a team of five developers building client-facing modules.'
        ],
        outcome: 'Delivered an auditable, transparent capital spend platform where documents can be verified against the blockchain-style hash chain.'
      },
      tradeoffs: [
        {
          decision: 'SHA-256 Hash Chaining vs. Plain DB Audits',
          why: 'Database rows can be quietly modified by DBAs. Cryptographic chaining makes alterations detectable immediately.'
        },
        {
          decision: 'Declarative Slab State Machine',
          why: 'Dynamic financial limits dictated varying approvals (Director -> VP -> CFO). A state machine prevented deadlock cycles.'
        },
        {
          decision: 'Atomic Budget Reservation',
          why: 'Dual approvals against the same cost center could cause budget overrun; implemented atomic database locks.'
        }
      ],
      metrics: [
        { label: 'Team Leadership', value: '5 Devs', context: 'Architected core engine and guided full sprint delivery' },
        { label: 'Audit Trail', value: 'SHA-256', context: 'Hash-chained records, tamper-evident and verifiable by QR scan' },
        { label: 'Routing Rules', value: 'Amount-slab', context: 'Parallel approvers, completion rules and budget encumbrance' }
      ]
    },
    {
      id: 'vision',
      roleCategories: ['fullstack', 'backend', 'ai'],
      pipeline: ['Photo Upload', 'Compress', 'Vision Model', 'Validate + Confidence', 'Manual Check', 'Structured Record'],
      gate: 3,
      gateNote: 'Extractions falling below the confidence threshold automatically route to a human verification queue.',
      cat: 'AI + Computer Vision',
      name: 'Vision Data Capture',
      badge: 'Field Operations',
      featured: true,
      desc: 'Extracts odometer readings and fuel receipt details from mobile field uploads into verified structured database records.',
      proof: 'Eliminated manual field data entry with automated extraction.',
      tech: ['OpenAI Vision', 'Spring Boot', 'AWS S3', 'Audit Trails'],
      caseStudy: {
        problem: 'Field workers manually keyed in odometer readings and fuel receipts, causing frequent transcription mistakes and expense disputes.',
        approach: [
          'Built an automated ingestion pipeline: client-side image compression, S3 archival, model extraction, and rule validation.',
          'Extracted structured fields including numerical readings, fuel quantity, monetary amount, and invoice date.',
          'Engineered confidence scoring fallbacks: ambiguous photos are queued for staff review rather than blindly accepted.',
          'Integrated original photo URLs into audit reports for dispute resolution.'
        ],
        outcome: 'Faster field expense processing, with the original photograph linked to every extracted record for dispute resolution.'
      },
      tradeoffs: [
        {
          decision: 'Confidence-Based Human Fallback',
          why: 'Field photos often have glare or poor lighting. Routing low-confidence scans prevents corrupt database records.'
        },
        {
          decision: 'Client-Side Canvas Compression',
          why: 'Compressed mobile photos in the browser before upload, cutting transfer size on spotty field networks.'
        },
        {
          decision: 'Permanent Immutable S3 Archival',
          why: 'Stored original photos with signed URLs for seamless audit evidence during tax and reimbursement reconciliations.'
        }
      ],
      metrics: [
        { label: 'Confidence Gate', value: 'Enforced', context: 'Low-confidence extractions are rejected rather than trusted' },
        { label: 'Capture Types', value: '2', context: 'Odometer readings and fuel receipts from field photographs' },
        { label: 'Human Review', value: 'Required', context: 'Extracted values are confirmed before they become records' }
      ]
    },
    {
      id: 'voice',
      roleCategories: ['ai', 'backend'],
      pipeline: ['Speech In', 'Intent Parsing', 'Vector RAG', 'Guard Node', 'Model Reply', 'Speech Out'],
      gate: 3,
      gateNote: 'Deterministic guard nodes verify appointment availability before the voice agent utters a confirmation.',
      cat: 'AI + Voice Systems',
      name: 'Conversational Voice-AI Agent',
      badge: 'LangGraph & RAG',
      featured: true,
      desc: 'Multilingual, multi-tenant voice-agent platform: graph-based orchestration, retrieval over a vector database, and automatic speech pipeline failover.',
      proof: 'Designed and built end-to-end, including safety guards.',
      tech: ['LangGraph', 'Gemini', 'Vector RAG', 'Python', 'FastAPI'],
      caseStudy: {
        problem: 'Voice booking assistants frequently hallucinate confirmations or struggle when conversations deviate from rigid scripts.',
        approach: [
          'Modelled the conversational agent as a typed state machine in LangGraph so every conversation branch is testable.',
          'Grounded clinic knowledge with hybrid vector retrieval, caching frequent queries for ultra-low latency.',
          'Constructed dual speech pipelines (speech-to-speech with cascaded STT/LLM/TTS failover) with mid-call automatic switching.',
          'Implemented deterministic guardrails: the agent cannot claim a booking without a successful backend API 201 response.'
        ],
        outcome: 'Engineered a dependable voice assistant whose spoken claims strictly reflect database state, not model speculation.'
      },
      tradeoffs: [
        {
          decision: 'LangGraph State Machine vs. Linear Chains',
          why: 'Linear chains crash when users digress. A graph-based state machine handles interruptions and backtrack questions seamlessly.'
        },
        {
          decision: 'Cascaded Failover Pipeline',
          why: 'Speech-to-speech APIs can lag or drop. The system switches to a cascaded STT->LLM->TTS path automatically, without dropping the call.'
        },
        {
          decision: 'Deterministic API Confirmation Guard',
          why: 'Spoken confirmations require a verified 201 Created HTTP response, preventing hallucinated bookings.'
        }
      ],
      metrics: [
        { label: 'Supported Languages', value: '3 Languages', context: 'Dynamic prompt localization and acoustic models' },
        { label: 'Speech Pipelines', value: '2', context: 'Primary and cascaded paths with automatic mid-call failover' },
        { label: 'Booking Guard', value: 'Deterministic', context: 'Agent cannot confirm a booking without a successful tool call' }
      ]
    },
    {
      id: 'hrms',
      roleCategories: ['fullstack', 'backend'],
      cat: 'HRMS',
      name: 'Employee Onboarding & Hierarchy',
      desc: 'Client and unit mapping, roles, permissions, reporting hierarchies, and policy setup across the enterprise HR module.',
      proof: 'Reduced administrative setup time in a multi-tenant HR workflow.',
      tech: ['Spring Boot', 'Angular', 'JWT', 'RBAC'],
      caseStudy: {
        problem: 'Onboarding required complex organization mapping and granular role assignments without error-prone spreadsheets.',
        approach: [
          'Engineered onboarding workflows linking client accounts, departmental units, and shift policies.',
          'Modelled reporting hierarchies and dynamic role assignments.',
          'Enforced multi-tenant isolation using JWT claims and RBAC guards.',
          'Delivered Spring Boot REST APIs and responsive Angular screens end-to-end.'
        ],
        outcome: 'A self-service onboarding engine where new units land immediately with correct structure and security.'
      }
    },
    {
      id: 'incident',
      roleCategories: ['fullstack', 'backend'],
      cat: 'Operations',
      name: 'Incident Management System',
      desc: 'Assignment groups, Kanban workflow, immutable audit trails, and exportable reports for operations teams.',
      proof: 'Transformed ad-hoc ticket tracking into an auditable enterprise workflow.',
      tech: ['Spring Boot', 'Angular', 'MySQL', 'Reports'],
      caseStudy: {
        problem: 'Support and operations teams lacked a structured mechanism to record, route, resolve, and audit incidents against SLAs.',
        approach: [
          'Built assignment group routing based on severity and category.',
          'Implemented an interactive Kanban board from intake to resolution.',
          'Recorded every transition with timestamped audit trails.',
          'Added exportable CSV/PDF reports for SLA compliance reviews.'
        ],
        outcome: 'An operational incident workflow delivering total accountability, SLA tracking, and visibility.'
      }
    },
    {
      id: 'patrol',
      roleCategories: ['fullstack', 'backend'],
      cat: 'Security & Field',
      name: 'Field Patrol SLA Compliance',
      desc: 'GPS checkpoint capture, Google Maps route visualization, and automated PDF exports for customer SLA validation.',
      proof: 'Made physical security visits verifiable and auditable.',
      tech: ['Google Maps API', 'Spring Boot', 'Angular', 'PDF Generation'],
      caseStudy: {
        problem: 'Security agencies needed verifiable proof that security guards completed patrol routes on time.',
        approach: [
          'Logged tamper-resistant GPS coordinates and timestamps during physical checkpoint scans.',
          'Rendered patrol routes interactively on Google Maps for inspection.',
          'Automated daily PDF report compilation for client SLA validation.',
          'Integrated seamless role-based views for guards, supervisors, and enterprise clients.'
        ],
        outcome: 'Location-verified patrol reporting that eliminated billing disputes and built client trust.'
      }
    },
    {
      id: 'kyc',
      roleCategories: ['backend', 'fullstack'],
      cat: 'Identity & Compliance',
      name: 'Identity Verification Framework',
      desc: 'Unified third-party verification for 10+ Indian government identity documents with fuzzy matching and face validation.',
      proof: 'One secure integration pattern for diverse identity documents.',
      tech: ['Spring Boot', 'AWS', 'REST Integrations', 'Security'],
      caseStudy: {
        problem: 'Identity verification was fragmented across multiple vendor APIs with inconsistent schemas and error handling.',
        approach: [
          'Created a resilient integration abstraction layer over verification providers.',
          'Supported 10+ Indian identity documents (national ID, tax ID, driving licence, voter ID and similar) behind a clean API.',
          'Implemented name fuzzy matching and facial recognition checks for anti-fraud.',
          'Secured token handling and PII storage with encryption at rest.'
        ],
        outcome: 'A unified identity verification framework accelerating compliance and onboarding across all products.'
      }
    }
  ];

  expertise: Capability[] = [
    {
      title: 'Backend Architecture & APIs',
      blurb:
        'Production-tested Java and Spring Boot design: high-throughput REST APIs, optimized SQL via JdbcTemplate, JPA/Hibernate, multi-tenant database isolation, Redis caching, and JWT/RBAC security.',
      chips: ['Java 17', 'Spring Boot 3', 'REST APIs', 'JdbcTemplate', 'JPA/Hibernate', 'MySQL', 'SQL Server', 'Redis', 'JWT/RBAC']
    },
    {
      title: 'Enterprise Frontend & UI',
      blurb:
        'Angular applications engineered for dense enterprise workflows: complex reactive forms, Kanban boards, tabular data with virtual scrolling, real-time validations, and clean state architecture.',
      chips: ['Angular 16-18', 'TypeScript', 'RxJS', 'Standalone Components', 'HTML5/CSS3', 'Bootstrap 5', 'Responsive Design']
    },
    {
      title: 'Practical AI & System Safety',
      blurb:
        'Production AI integrations designed with engineering discipline: prompt engineering, OpenAI & Gemini APIs, LangGraph state machines, RAG with vector search, and deterministic human-in-the-loop safety gates.',
      chips: ['OpenAI API', 'Google Gemini', 'LangGraph', 'RAG', 'Vector Search', 'Prompt Guardrails', 'Structured Outputs']
    },
    {
      title: 'DevOps & Technical Leadership',
      blurb:
        'Clean engineering delivery: leading architectural decisions, code reviews, writing clear technical specifications, database schema migrations, Docker containerization, and mentoring junior engineers.',
      chips: ['AWS S3/EC2', 'Docker', 'Git / GitHub Actions', 'CI/CD', 'Linux', 'Code Review', 'Mentoring', 'Agile/Scrum']
    }
  ];

  // Icons self-hosted from devicon (MIT) in public/tech/ rather than loaded
  // from a CDN: corporate networks often block third-party CDNs, and this
  // row is 40KB total.
  stack: Tech[] = [
    { name: 'Java', url: 'tech/java.svg', category: 'Backend' },
    { name: 'Spring Boot', url: 'tech/spring.svg', category: 'Backend' },
    { name: 'Angular', url: 'tech/angular.svg', category: 'Frontend' },
    { name: 'TypeScript', url: 'tech/typescript.svg', category: 'Frontend' },
    { name: 'MySQL', url: 'tech/mysql.svg', category: 'Database' },
    { name: 'Redis', url: 'tech/redis.svg', category: 'Cache' },
    { name: 'React', url: 'tech/react.svg', category: 'Frontend' },
    { name: 'Python', url: 'tech/python.svg', category: 'AI' },
    { name: 'Git', url: 'tech/git.svg', category: 'Tools' }
  ];

  learning = [
    'LangGraph multi-agent orchestration',
    'Hybrid vector search & RAG reranking',
    'Gemini 2.0 & OpenAI structured reasoning',
    'Event-driven architectures with Kafka',
    'Docker & containerized AWS deployments',
    'OpenTelemetry production observability'
  ];

  experience: Job[] = [
    {
      role: 'Full-Stack Developer',
      org: 'AITITUDE IT Pvt Ltd — Multi-tenant SaaS Product Company',
      period: 'Feb 2021 – Present · Hyderabad, India',
      points: [
        'Introduced the platform’s first production AI capabilities using OpenAI: an AI clinical assistant for physicians and an automated field vision extraction pipeline.',
        'Technical lead on the Capital Spend Approval Platform: engineered amount-slab routing, parallel approver workflows, and an immutable SHA-256 hash-chained audit trail verifiable via QR code.',
        'Delivered 20+ production features across HRMS, fleet logistics, health, invoicing, careers, and incident tracking within a JWT-secured, tenant-isolated architecture.',
        'Optimized high-latency database queries with custom JdbcTemplate SQL and added Redis caching for hot read paths, significantly accelerating heavy reporting screens.',
        'Contributed as part of the core team to modernizing the platform from Angular 16 to Angular 18 with standalone components and Bootstrap 5.'
      ]
    },
    {
      role: 'Lecturer & Head of Department, Computer Science',
      prior: true,
      org: 'Suvidya Degree College & Sri Chaitanya',
      period: '2008 – 2021 · Telangana, India',
      points: [
        'Taught Java, Data Structures, OOP, and Database Management to undergraduate students, establishing a deep foundational mastery of computer science and software design.',
        'Led the Computer Science department, mentored hundreds of students into engineering careers, and honed high-clarity technical communication.'
      ]
    }
  ];

  resumeData = {
    name: 'Murala Thirupathi',
    title: 'Full-Stack Developer (Java · Spring Boot · Angular · AI)',
    email: 'thirupathiraomurala@gmail.com',
    phone: '+91 96400 46001',
    location: 'Hyderabad, Telangana, India (Open to Remote / Relocation)',
    linkedin: 'https://www.linkedin.com/in/thirupathi-murala/',
    github: 'https://github.com/murala-thirupathi',
    summary:
      'Backend-first Full-Stack Developer with 5+ years of production experience engineering multi-tenant SaaS platforms at AITITUDE IT. Specialist in Java 17, Spring Boot 3, and Angular 18, with proven ability to ship production AI capabilities (OpenAI, Gemini, LangGraph, RAG) with deterministic validation and human review gates. Proven technical leadership designing high-stakes financial approval engines with cryptographic audit trails, query optimization with Redis, and clean API design.',
    skills: [
      { category: 'Backend & Systems', items: ['Java 17', 'Spring Boot 3', 'REST APIs', 'JdbcTemplate', 'JPA/Hibernate', 'Microservices', 'MySQL', 'SQL Server', 'Redis', 'JWT/RBAC'] },
      { category: 'Frontend Engineering', items: ['Angular 16-18', 'TypeScript', 'RxJS', 'Standalone Components', 'HTML5/CSS3', 'Responsive Design', 'Bootstrap 5'] },
      { category: 'AI & Intelligent Systems', items: ['OpenAI API', 'Google Gemini', 'LangGraph', 'RAG (Retrieval-Augmented Generation)', 'Vector Search', 'Prompt Guardrails', 'Structured JSON Output'] },
      { category: 'DevOps & Tools', items: ['AWS S3/EC2', 'Docker', 'Git / GitHub Actions', 'CI/CD', 'Linux', 'Maven', 'Postman', 'Agile / Scrum'] }
    ]
  };

  constructor() {
    try {
      const saved = localStorage.getItem('mtr-theme') as 'dark' | 'light' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = saved ?? (prefersDark ? 'dark' : 'light');
    } catch {
      this.theme = 'dark';
    }
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  get filteredFeaturedProjects(): Project[] {
    const role = this.selectedRole;
    if (role === 'all') {
      return this.projects.filter((p) => p.featured);
    }
    return this.projects.filter((p) => p.featured && p.roleCategories.includes(role));
  }

  get filteredMoreProjects(): Project[] {
    const role = this.selectedRole;
    if (role === 'all') {
      return this.projects.filter((p) => !p.featured);
    }
    return this.projects.filter((p) => !p.featured && p.roleCategories.includes(role));
  }

  get featuredProjects(): Project[] {
    return this.projects.filter((p) => p.featured);
  }

  get moreProjects(): Project[] {
    return this.projects.filter((p) => !p.featured);
  }

  setRoleFilter(role: 'all' | 'fullstack' | 'backend' | 'ai'): void {
    this.selectedRole = role;
  }

  getProjectTab(id: string): 'pipeline' | 'tradeoffs' | 'metrics' {
    return this.activeTabMap[id] || 'pipeline';
  }

  setProjectTab(id: string, tab: 'pipeline' | 'tradeoffs' | 'metrics'): void {
    this.activeTabMap[id] = tab;
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    try {
      localStorage.setItem('mtr-theme', this.theme);
    } catch {
      // Local storage may be unavailable in private contexts.
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  openResume(): void {
    this.resumeOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeResume(): void {
    this.resumeOpen = false;
    document.body.style.overflow = '';
  }

  printResume(): void {
    window.print();
  }

  copyResumeText(): void {
    const text = `MURALA THIRUPATHI
${this.resumeData.title}
Email: ${this.email} | Phone: ${this.phone} | Location: ${this.location}
LinkedIn: ${this.linkedin} | GitHub: ${this.github}

PROFESSIONAL SUMMARY
${this.resumeData.summary}

CORE SKILLS
${this.resumeData.skills.map((s) => `${s.category}: ${s.items.join(', ')}`).join('\n')}

EXPERIENCE
${this.experience
  .map(
    (exp) => `${exp.role} — ${exp.org} (${exp.period})
${exp.points.map((p) => `• ${p}`).join('\n')}`
  )
  .join('\n\n')}`;

    try {
      navigator.clipboard.writeText(text);
      this.resumeCopied = true;
      setTimeout(() => (this.resumeCopied = false), 2000);
    } catch {
      this.resumeCopied = false;
    }
  }

  copyEmail(): void {
    try {
      navigator.clipboard.writeText(this.email);
      this.copied = true;
      setTimeout(() => (this.copied = false), 1700);
    } catch {
      this.copied = false;
    }
  }

  onPhotoError(): void {
    this.photoOk = false;
  }

  iconFor(project: Project): string {
    const cat = project.cat.toLowerCase();
    if (cat.includes('health')) return 'pulse';
    if (cat.includes('vision')) return 'scan';
    if (cat.includes('finance')) return 'flow';
    if (cat.includes('voice')) return 'voice';
    if (cat.includes('hrms')) return 'people';
    if (cat.includes('operations')) return 'board';
    if (cat.includes('security')) return 'pin';
    if (cat.includes('identity') || cat.includes('kyc')) return 'shield';
    return 'spark';
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.resumeOpen) {
      this.closeResume();
    } else if (this.menuOpen) {
      this.closeMenu();
    }
  }

  ngOnInit(): void {
    // Seed before the first change-detection pass; doing this in
    // ngAfterViewInit mutates an already-checked binding (NG0100).
    this.tickTime();
  }

  ngAfterViewInit(): void {
    this.timer = setInterval(() => {
      this.tickTime();
      this.cdr.markForCheck();
    }, 30000);
    this.initScrollListener();
    this.initReveal();
    this.initCardEffects();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.unlistenScroll) {
      this.unlistenScroll();
    }
    this.observers.forEach((observer) => observer.disconnect());
  }

  private tickTime(): void {
    try {
      this.hydTime = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      })
        .format(new Date())
        .toUpperCase();
    } catch {
      this.hydTime = '';
    }
  }

  /**
   * Runs scroll detection outside Angular Zone to avoid triggering
   * change detection cycles on every scroll event.
   */
  private initScrollListener(): void {
    this.ngZone.runOutsideAngular(() => {
      const scrollHandler = () => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        const progress = max > 0 ? (el.scrollTop / max) * 100 : 0;

        const progressBar = document.querySelector('.progress') as HTMLElement;
        if (progressBar) {
          progressBar.style.width = `${progress}%`;
        }

        const cursor = el.scrollTop + 140;
        let current = 'top';
        for (const id of this.sections) {
          const section = document.getElementById(id);
          if (section && section.offsetTop <= cursor) {
            current = id;
          }
        }

        if (this.activeSection !== current) {
          this.ngZone.run(() => {
            this.activeSection = current;
            this.cdr.markForCheck();
          });
        }
        this.revealInView();
      };

      window.addEventListener('scroll', scrollHandler, { passive: true });
      this.unlistenScroll = () => window.removeEventListener('scroll', scrollHandler);
      // Run once on load:
      scrollHandler();
    });
  }

  private revealEls: HTMLElement[] = [];

  private initReveal(): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.revealEls = Array.from(this.host.nativeElement.querySelectorAll('.reveal')) as HTMLElement[];

    if (reduce || !('IntersectionObserver' in window)) {
      this.revealEls.forEach((el) => el.classList.add('in-view'));
      return;
    }

    document.documentElement.classList.add('js-reveal');

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    this.revealEls.forEach((el) => revealObserver.observe(el));
    this.observers.push(revealObserver);

    this.revealInView();
    setTimeout(() => this.revealInView(), 400);
    setTimeout(() => this.revealInView(), 1200);
    setTimeout(() => this.revealEls.forEach((el) => el.classList.add('in-view')), 2500);
  }

  private revealInView(): void {
    if (this.revealEls.length === 0) return;
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    this.revealEls.forEach((el) => {
      if (el.classList.contains('in-view')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < viewport * 0.94 && rect.bottom > 0) {
        el.classList.add('in-view');
      }
    });
  }

  /**
   * Initializes subtle 3D card tilt & cursor glow outside Angular Zone
   * so it renders at 120fps with zero layout thrashing.
   */
  private initCardEffects(): void {
    this.ngZone.runOutsideAngular(() => {
      const heroGrid = this.host.nativeElement.querySelector('.hero-grid') as HTMLElement;
      if (heroGrid) {
        heroGrid.addEventListener(
          'mousemove',
          (e: MouseEvent) => {
            const rect = heroGrid.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroGrid.style.setProperty('--hero-x', `${(x * 10).toFixed(2)}px`);
            heroGrid.style.setProperty('--hero-y', `${(y * 10).toFixed(2)}px`);
            heroGrid.style.setProperty('--rx', `${(x * 6).toFixed(2)}deg`);
            heroGrid.style.setProperty('--ry', `${(-y * 6).toFixed(2)}deg`);
          },
          { passive: true }
        );

        heroGrid.addEventListener(
          'mouseleave',
          () => {
            heroGrid.style.setProperty('--hero-x', '0px');
            heroGrid.style.setProperty('--hero-y', '0px');
            heroGrid.style.setProperty('--rx', '0deg');
            heroGrid.style.setProperty('--ry', '0deg');
          },
          { passive: true }
        );
      }

      const cards = this.host.nativeElement.querySelectorAll(
        '.impact-card, .mini, .capability, .case'
      ) as NodeListOf<HTMLElement>;

      cards.forEach((card) => {
        card.addEventListener(
          'mousemove',
          (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
          },
          { passive: true }
        );

        card.addEventListener(
          'mouseleave',
          () => {
            card.style.setProperty('--mx', '-500px');
            card.style.setProperty('--my', '-500px');
          },
          { passive: true }
        );
      });
    });
  }
}
