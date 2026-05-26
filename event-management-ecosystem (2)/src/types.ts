export interface TimelineItem {
  id: string;
  time: string; // e.g. "09:00 AM"
  title: string;
  description: string;
  stage: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  completed: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  venue: string;
  category: 'Hackathon' | 'Workshop' | 'College Event';
  budget: number;
  bannerColor: string;
  status: 'Planning' | 'Active' | 'Completed';
  timeline?: TimelineItem[];
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  college: string;
  ticketType: 'General' | 'VIP' | 'Observer';
  eventId: string;
  registeredAt: string;
  checkedIn: boolean;
  paymentStatus: 'Paid' | 'Free' | 'Pending';
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  availability: 'Available' | 'Busy' | 'Part-time';
  points: number;
  badges: string[];
}

export interface Sponsor {
  id: string;
  name: string;
  company: string;
  industry: string;
  budget: number;
  targetAudience: string;
  matchedEventId?: string;
}

export interface SponsorshipPackage {
  id: string;
  name: string;
  eventId: string;
  price: number;
  benefits: string[];
  tier: 'Diamond' | 'Gold' | 'Silver';
}

export interface CommunicationRecord {
  id: string;
  eventId: string;
  sender: string;
  recipientGroup: string;
  subject: string;
  message: string;
  sentAt: string;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  participantId: string;
  checkInTime: string;
}

export interface FeedbackResponse {
  id: string;
  eventId: string;
  rating: number; // 1-5
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  submittedAt: string;
}

export interface PaymentDetail {
  id: string;
  participantId: string;
  amount: number;
  status: 'Completed' | 'Refunded' | 'Failed';
  timestamp: string;
}

export interface TaskAssignment {
  id: string;
  eventId: string;
  volunteerId: string;
  title: string;
  description: string;
  status: 'Assigned' | 'In Progress' | 'Completed';
  points: number;
  deadline: string;
}

export interface CertificateTemplate {
  id: string;
  eventId: string;
  title: string;
  signatureName: string;
  issueDate: string;
}

export interface Achievement {
  id: string;
  volunteerId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface ExpenseRecord {
  id: string;
  eventId: string;
  description: string;
  amount: number;
  category: 'Logistics' | 'Catering' | 'Marketing' | 'Prizes' | 'Licensing';
  date: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
}

export interface Team {
  id: string;
  name: string;
  projectDescription: string;
  eventId: string;
  members: string[]; // Array of participant IDs
  openRoles: string[]; // e.g. ["ML Engineer", "Front-end Developer"]
  tags: string[]; // e.g. ["Web", "AI", "Python"]
  contactEmail: string;
  logoColor: string;
}

export interface VolunteerShift {
  id: string;
  volunteerId: string;
  eventId: string;
  date: string; // e.g. "2026-06-12"
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "05:00 PM"
  role: string; // e.g. "Ticketing Desk", "Media & Video"
  notes?: string;
  status: 'Scheduled' | 'CheckedIn' | 'Completed';
}

