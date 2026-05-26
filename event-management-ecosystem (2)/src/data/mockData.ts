import { 
  Event, Participant, Volunteer, Sponsor, SponsorshipPackage, 
  CommunicationRecord, FeedbackResponse, TaskAssignment, 
  CertificateTemplate, Achievement, ExpenseRecord, ChatMessage, Team, VolunteerShift
} from '../types';

export const initialEvents: Event[] = [
  {
    id: 'evt-1',
    name: 'Nexus Tech Hackathon 2026',
    description: 'A 48-hour challenge designed to build solutions for climate action, smart communities, and decentralized technology solutions.',
    date: '2026-06-12',
    venue: 'Grand Innovation Hall & Campus Quad',
    category: 'Hackathon',
    budget: 18000,
    bannerColor: 'from-blue-600 to-indigo-900',
    status: 'Planning'
  },
  {
    id: 'evt-2',
    name: 'AI & Generative Deep Dive Workshop',
    description: 'A hands-on workshop guiding students and engineering professionals through training architectures, transformer models, and real-time inference.',
    date: '2026-06-28',
    venue: 'Academic Computer Labs, Block B',
    category: 'Workshop',
    budget: 6500,
    bannerColor: 'from-emerald-600 to-teal-900',
    status: 'Active'
  },
  {
    id: 'evt-3',
    name: 'Genesis College Cultural Festival',
    description: 'The annual flagship college festival of music, arts, technology, dance, and collaborative exhibition streams.',
    date: '2026-07-15',
    venue: 'Main Auditorium & Exhibition Stadium',
    category: 'College Event',
    budget: 35000,
    bannerColor: 'from-amber-600 to-rose-950',
    status: 'Planning'
  }
];

export const initialParticipants: Participant[] = [
  {
    id: 'p-1',
    name: 'Aron Foster',
    email: 'aron.foster@university.edu',
    college: 'State Polytech',
    ticketType: 'General',
    eventId: 'evt-1',
    registeredAt: '2026-05-18T10:30:00Z',
    checkedIn: true,
    paymentStatus: 'Paid'
  },
  {
    id: 'p-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@mit.edu',
    college: 'MIT Engineering Block',
    ticketType: 'VIP',
    eventId: 'evt-1',
    registeredAt: '2026-05-20T14:15:00Z',
    checkedIn: false,
    paymentStatus: 'Paid'
  },
  {
    id: 'p-3',
    name: 'Marcus Brody',
    email: 'marcus.b@stanford.edu',
    college: 'Stanford Computer Science',
    ticketType: 'Observer',
    eventId: 'evt-1',
    registeredAt: '2026-05-24T09:00:00Z',
    checkedIn: false,
    paymentStatus: 'Free'
  },
  {
    id: 'p-4',
    name: 'Jane Wu',
    email: 'j.wu@digitalacademy.org',
    college: 'Stanford Computer Science',
    ticketType: 'General',
    eventId: 'evt-2',
    registeredAt: '2026-05-22T11:45:00Z',
    checkedIn: true,
    paymentStatus: 'Paid'
  },
  {
    id: 'p-5',
    name: 'David Kim',
    email: 'dkim@vanderbilt.edu',
    college: 'Vanderbilt CS',
    ticketType: 'General',
    eventId: 'evt-2',
    registeredAt: '2026-05-23T16:20:00Z',
    checkedIn: false,
    paymentStatus: 'Paid'
  },
  {
    id: 'p-6',
    name: 'Carlos Santana',
    email: 'santanac@artsacademy.edu',
    college: 'National Arts Academy',
    ticketType: 'VIP',
    eventId: 'evt-3',
    registeredAt: '2026-05-25T08:10:00Z',
    checkedIn: false,
    paymentStatus: 'Pending'
  }
];

export const initialVolunteers: Volunteer[] = [
  {
    id: 'vol-1',
    name: 'Johnathan Miller',
    email: 'j.miller@campusvolunteer.org',
    skills: ['Network Setup', 'Crowd Management', 'Hardware Triaging'],
    availability: 'Available',
    points: 380,
    badges: ['Lead Coord', 'First Responder']
  },
  {
    id: 'vol-2',
    name: 'Sarah Peterson',
    email: 'sarah.p@stateuniversity.edu',
    skills: ['Social Media', 'Graphic Design', 'Hospitality-Sponsor Guide'],
    availability: 'Available',
    points: 420,
    badges: ['Publicity Guru', 'Design Star']
  },
  {
    id: 'vol-3',
    name: 'Alex Chen',
    email: 'achen@techmail.net',
    skills: ['Python Scripting', 'QA', 'Audio/Video Systems'],
    availability: 'Part-time',
    points: 150,
    badges: ['AV Specialist']
  },
  {
    id: 'vol-4',
    name: 'Priya Patel',
    email: 'priya.patel@statepoly.edu',
    skills: ['Ticketing Operations', 'Logistics Coordinator'],
    availability: 'Available',
    points: 290,
    badges: ['Ticketing Champ']
  }
];

export const initialSponsors: Sponsor[] = [
  {
    id: 'spn-1',
    name: 'NVIDIA Academic',
    company: 'NVIDIA Corporation',
    industry: 'Hardware & Artificial Intelligence',
    budget: 8000,
    targetAudience: 'AI/ML Researchers and Senior Graduate Students',
    matchedEventId: 'evt-2'
  },
  {
    id: 'spn-2',
    name: 'RedBull Ventures',
    company: 'RedBull GmbH',
    industry: 'Energy & Recreation',
    budget: 5000,
    targetAudience: 'Creative Developers, Designers, Active Student Hackers',
    matchedEventId: 'evt-1'
  },
  {
    id: 'spn-3',
    name: 'Stripe Global Developer Guild',
    company: 'Stripe Payments',
    industry: 'Finance & Payments Infrastructure',
    budget: 4500,
    targetAudience: 'Fintech builders, entrepreneurs, full-stack programmers',
    matchedEventId: 'evt-1'
  },
  {
    id: 'spn-4',
    name: 'Figma Design Fund',
    company: 'Figma Inc.',
    industry: 'Creative UX Design & Tech Platform',
    budget: 3000,
    targetAudience: 'Student UI/UX designers, creators, illustrators',
    matchedEventId: 'evt-3'
  }
];

export const initialPackages: SponsorshipPackage[] = [
  {
    id: 'pkg-1',
    eventId: 'evt-1',
    name: 'Diamond Title Sponsor',
    price: 10000,
    benefits: ['Keynote presentation address', 'Large scale logo on all banners', 'Exclusive recruitment fast-pass channel', '8 complimentary hacker seats'],
    tier: 'Diamond'
  },
  {
    id: 'pkg-2',
    eventId: 'evt-1',
    name: 'Gold Associate Sponsor',
    price: 5000,
    benefits: ['Dedicated mentor desk representable', 'Vibrant banner branding logo', 'Branded prize highlight category slot'],
    tier: 'Gold'
  },
  {
    id: 'pkg-3',
    eventId: 'evt-2',
    name: 'Exclusive High-Performance Compute Sponsor',
    price: 4500,
    benefits: ['Host cloud resources demonstration', 'Dataset attribution logo', 'VIP tech panel seat positioning'],
    tier: 'Diamond'
  },
  {
    id: 'pkg-4',
    eventId: 'evt-3',
    name: 'Creative Stage Partner',
    price: 3000,
    benefits: ['Main stage backdrop display logo', 'Intermission social shoutout sessions', 'Dedicated registration gate kiosk'],
    tier: 'Silver'
  }
];

export const initialExpenses: ExpenseRecord[] = [
  {
    id: 'exp-1',
    eventId: 'evt-1',
    description: 'High-speed local ethernet infrastructure setup & dual fiber redundant nodes',
    amount: 4200,
    category: 'Logistics',
    date: '2026-05-15'
  },
  {
    id: 'exp-2',
    eventId: 'evt-1',
    description: 'Midnight energy catering fuel & artisan donut snack table',
    amount: 2800,
    category: 'Catering',
    date: '2026-05-20'
  },
  {
    id: 'exp-3',
    eventId: 'evt-1',
    description: 'Specialty customized trophies, 3D printed icons and hardware prizes',
    amount: 3500,
    category: 'Prizes',
    date: '2026-05-22'
  },
  {
    id: 'exp-4',
    eventId: 'evt-2',
    description: 'Vibrant custom vinyl badge printing and visual study notes handbooks',
    amount: 1500,
    category: 'Marketing',
    date: '2026-05-18'
  },
  {
    id: 'exp-5',
    eventId: 'evt-3',
    description: 'Sound deck rental, heavy bass setup, and projection hardware keys',
    amount: 12000,
    category: 'Logistics',
    date: '2026-05-24'
  }
];

export const initialTasks: TaskAssignment[] = [
  {
    id: 'ts-1',
    eventId: 'evt-1',
    volunteerId: 'vol-1',
    title: 'Deploy Wi-Fi Routers',
    description: 'Distribute 12 powerful Wi-Fi nodes along innovation bay and run high density network stress testing.',
    status: 'In Progress',
    points: 100,
    deadline: '2026-06-11'
  },
  {
    id: 'ts-2',
    eventId: 'evt-1',
    volunteerId: 'vol-2',
    title: 'Design Sponsorship Brochure',
    description: 'Incorporate approved corporate color schemas and print final versions for incoming corporate guide delegates.',
    status: 'Completed',
    points: 120,
    deadline: '2026-05-24'
  },
  {
    id: 'ts-3',
    eventId: 'evt-2',
    volunteerId: 'vol-3',
    title: 'Calibrate Lab Projectors',
    description: 'Sync dual monitors, connect audio splitters, and set initial slide templates on active lectern.',
    status: 'Assigned',
    points: 60,
    deadline: '2026-06-27'
  },
  {
    id: 'ts-4',
    eventId: 'evt-1',
    volunteerId: 'vol-4',
    title: 'Prepare Badge Print Queue',
    description: 'Format digital participant rosters and crosscheck ticket levels against database before high-speed batch output run.',
    status: 'Assigned',
    points: 80,
    deadline: '2026-06-11'
  }
];

export const initialCommunications: CommunicationRecord[] = [
  {
    id: 'comm-1',
    eventId: 'evt-1',
    sender: 'Sponsor Desk Coord',
    recipientGroup: 'Sponsors',
    subject: 'Confirming logistics desk locations',
    message: 'Hello partners, our booth mappings are complete! Please send your standard dimensional specifications (maximum standard backdrop size 8x10ft) by early June.',
    sentAt: '2026-05-24T15:00:00Z'
  },
  {
    id: 'comm-2',
    eventId: 'evt-2',
    sender: 'Lead ML Mentor',
    recipientGroup: 'Participants',
    subject: 'Pre-requisite dataset & environment configs',
    message: 'Greetings learners! To maximize workspace value, please fetch the hugging-face libraries, install Python 3.11+, and download the compressed sample parquet parameters shown in the prep guides.',
    sentAt: '2026-05-25T08:00:00Z'
  }
];

export const initialFeedback: FeedbackResponse[] = [
  {
    id: 'fb-1',
    eventId: 'evt-2',
    rating: 5,
    comment: 'The live demo regarding fine-tuning custom adapters was absolutely breathtaking! Extremely clear and well conceptualized.',
    sentiment: 'Positive',
    submittedAt: '2026-05-25T11:30:00Z'
  },
  {
    id: 'fb-2',
    eventId: 'evt-2',
    rating: 4,
    comment: 'Very informative labs, but it would have been absolute gold to have 30 more minutes of interactive troubleshooting time for Mac silicon architectures.',
    sentiment: 'Positive',
    submittedAt: '2026-05-25T12:00:00Z'
  }
];

export const initialCertificates: CertificateTemplate[] = [
  {
    id: 'cert-1',
    eventId: 'evt-2',
    title: 'Mastery of Transformer Models and Deep Custom Architecture Finetuning',
    signatureName: 'Dr. Evelyn Vasquez (Head of AI Department)',
    issueDate: '2026-06-28'
  },
  {
    id: 'cert-2',
    eventId: 'evt-1',
    title: 'Elite Creator Award - Climate Innovation Stream',
    signatureName: 'Director Samantha Vance (Startup Greenhouse Lead)',
    issueDate: '2026-06-14'
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    volunteerId: 'vol-1',
    title: 'Golden Node Master',
    description: 'Configured and structured heavy infrastructure for two sequential high-capacity events.',
    icon: 'Network',
    unlockedAt: '2026-05-15T18:00:00Z'
  },
  {
    id: 'ach-2',
    volunteerId: 'vol-2',
    title: 'Spotlight Catalyst',
    description: 'Managed dual channels and unlocked five active diamond packages via outstanding brochures.',
    icon: 'Award',
    unlockedAt: '2026-05-24T16:00:00Z'
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'm-1',
    senderName: 'Johnathan Miller (Volunteer)',
    senderRole: 'Volunteer',
    content: 'All Innovation Hall ethernet cables have been double routed! Can someone check if the premium router in room 12 gets the DHCP lease?',
    timestamp: '13:42'
  },
  {
    id: 'm-2',
    senderName: 'Sarah Peterson (Volunteer)',
    senderRole: 'Volunteer',
    content: 'Just updated the flyer on the social media handles! Stripe is retweeting us as we speak.',
    timestamp: '13:45'
  },
  {
    id: 'm-3',
    senderName: 'Aria Cruz (Organizer)',
    senderRole: 'Organizer',
    content: 'Incredible work team! Let\'s secure the main stadium audio calibration checklist next. Redbull reps arrive in exactly 20 minutes.',
    timestamp: '13:51'
  }
];

export const initialTeams: Team[] = [
  {
    id: 'team-1',
    name: 'CyberGuardians',
    projectDescription: 'Building a decentralized multi-factor auth protocol for community IoT devices with visual feedback indicators.',
    eventId: 'evt-1',
    members: ['p-1', 'p-2'],
    openRoles: ['ML Engineer', 'Security Lead'],
    tags: ['Next.js', 'Solidity', 'Tailwind'],
    contactEmail: 'aron.foster@university.edu',
    logoColor: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  },
  {
    id: 'team-2',
    name: 'EcoSustainers',
    projectDescription: 'Developing a zero-loss distribution tracker for local food banks matching surplus hotel catering directly to distribution centers.',
    eventId: 'evt-1',
    members: ['p-3'],
    openRoles: ['React Native Mobile Developer', 'Pitcher'],
    tags: ['React Native', 'Firebase', 'Maps API'],
    contactEmail: 'miranda@polytech.edu',
    logoColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    id: 'team-3',
    name: 'Code-X AI',
    projectDescription: 'Fine-tuning a small language model on local municipal code to auto-categorize zone exceptions for low-carbon builders.',
    eventId: 'evt-2',
    members: [],
    openRoles: ['Data Scientist', 'Technical Writer'],
    tags: ['Python', 'Gemini API', 'PyTorch'],
    contactEmail: 'alex.chen@mit.edu',
    logoColor: 'text-purple-600 bg-purple-50 border-purple-200'
  }
];

export const initialShifts: VolunteerShift[] = [
  {
    id: 'shft-1',
    volunteerId: 'vol-1',
    eventId: 'evt-1',
    date: '2026-06-12',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    role: 'Network Setup & Triaging',
    notes: 'Main deployment in Grand Innovation Hall and campus quad routers.',
    status: 'Scheduled'
  },
  {
    id: 'shft-2',
    volunteerId: 'vol-2',
    eventId: 'evt-1',
    date: '2026-06-12',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    role: 'Registration Gate & Kits',
    notes: 'Check badges, manage lines, issue lanyard accessories.',
    status: 'Scheduled'
  },
  {
    id: 'shft-3',
    volunteerId: 'vol-3',
    eventId: 'evt-2',
    date: '2026-06-28',
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    role: 'AV Control & Projection Screen',
    notes: 'Monitor projector scaling and verify slide microphones.',
    status: 'Scheduled'
  },
  {
    id: 'shft-4',
    volunteerId: 'vol-4',
    eventId: 'evt-3',
    date: '2026-07-15',
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    role: 'Crowd Flow & Information Counter',
    notes: 'Provide general answers on local venues map and parking layout.',
    status: 'Scheduled'
  }
];


