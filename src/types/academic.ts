export type UserRole = 'admin' | 'parent' | 'educator';
export type ScreenKey = 'overview' | 'academics' | 'consultation' | 'messages';

export type AttendanceStatus = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit';
export type GradeStatus = 'Tuntas' | 'Remedial';
export type SessionMode = 'Tatap Muka' | 'Daring';
export type BookingStatus = 'Terjadwal' | 'Menunggu' | 'Dibatalkan';

export interface Student {
  id: string;
  name: string;
  nis: string;
  className: string;
  gradeLevel: number;
  homeroomTeacher: string;
  homeroomTeacherAvatar: string;
  counselorName: string;
  counselorAvatar: string;
  avatarUrl: string;
  attendanceRate: number;
  gpaAverage: number;
  completedTasks: number;
  totalTasks: number;
  meritPoints: number;
  semester: string;
}

export interface SubjectGrade {
  id: string;
  studentId: string;
  subject: string;
  teacherName: string;
  taskScore: number;
  midtermScore: number;
  finalExamScore: number;
  finalScore: number;
  kkm: number;
  status: GradeStatus;
  note: string;
  updatedAt: string;
}

export interface AssignmentItem {
  id: string;
  studentId: string;
  subject: string;
  title: string;
  dueDate: string;
  score: number | null;
  status: 'Tuntas' | 'Remedial' | 'Belum Dikumpulkan';
  feedback: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  dayLabel: string;
  checkInTime: string;
  status: AttendanceStatus;
  note: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  date: string;
  type: 'Izin' | 'Sakit';
  reason: string;
  submittedAt: string;
  verified: boolean;
}

export interface TimelineEntry {
  id: string;
  studentId: string;
  category: 'Kehadiran' | 'Akademik' | 'Konseling' | 'Agenda';
  title: string;
  description: string;
  timestamp: string;
  author: string;
  statusLabel: string;
  tone: 'success' | 'warning' | 'info' | 'danger';
}

export interface CounselingNote {
  id: string;
  studentId: string;
  date: string;
  counselorName: string;
  topic: string;
  summary: string;
  followUp: string;
}

export interface EducatorProfile {
  id: string;
  name: string;
  role: string;
  subjectOrUnit: string;
  avatarUrl: string;
  officeLocation: string;
}

export interface ConsultationSlot {
  id: string;
  educatorId: string;
  date: string;
  timeRange: string;
  mode: SessionMode;
  locationOrLink: string;
  isAvailable: boolean;
}

export interface ConsultationBooking {
  id: string;
  studentId: string;
  educatorId: string;
  slotId: string;
  date: string;
  timeRange: string;
  mode: SessionMode;
  locationOrLink: string;
  topic: string;
  notes: string;
  status: BookingStatus;
}

export interface ChatMessage {
  id: string;
  senderRole: 'school' | 'parent';
  senderName: string;
  content: string;
  timestamp: string;
}

export interface MessageThread {
  id: string;
  studentId: string;
  contactName: string;
  contactRole: string;
  contactAvatar: string;
  unreadCount: number;
  lastUpdated: string;
  messages: ChatMessage[];
}

export interface SchoolAgenda {
  id: string;
  title: string;
  date: string;
  timeRange: string;
  location: string;
  category: string;
  description: string;
  requiresConfirmation: boolean;
  confirmedByParent: boolean;
}
