import React, { useMemo, useState } from 'react';
import { ChevronDown, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { AvatarImage } from './components/ui/AcademicCard';
import { AcademicsScreen } from './components/views/AcademicsScreen';
import { ConsultationScreen } from './components/views/ConsultationScreen';
import { MessagesAgendaScreen } from './components/views/MessagesAgendaScreen';
import { OverviewScreen } from './components/views/OverviewScreen';
import {
  EDUCATORS,
  INITIAL_AGENDAS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_BOOKINGS,
  INITIAL_CONSULTATION_SLOTS,
  INITIAL_COUNSELING_NOTES,
  INITIAL_GRADES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_STUDENTS,
  INITIAL_THREADS,
  INITIAL_TIMELINE,
} from './data/mockAcademicData';
import {
  AttendanceRecord,
  AttendanceStatus,
  ConsultationBooking,
  ConsultationSlot,
  LeaveRequest,
  MessageThread,
  SchoolAgenda,
  ScreenKey,
  Student,
  SubjectGrade,
  TimelineEntry,
  UserRole,
} from './types/academic';

const SCREEN_TITLES: Record<ScreenKey, { title: string; subtitle: string }> = {
  overview: {
    title: 'Ringkasan Perkembangan Siswa',
    subtitle: 'Pantau capaian akademik, presensi harian, dan agenda sekolah secara terpadu.',
  },
  academics: {
    title: 'Akademik, Nilai & Presensi',
    subtitle: 'Evaluasi ketuntasan mata pelajaran, rekam kehadiran, dan pengajuan izin.',
  },
  consultation: {
    title: 'Konsultasi Guru & Konselor',
    subtitle: 'Jadwalkan sesi pertemuan tatap muka atau daring bersama pendidik.',
  },
  messages: {
    title: 'Pesan Sekolah & Agenda Resmi',
    subtitle: 'Komunikasi langsung dengan wali kelas serta konfirmasi agenda sekolah.',
  },
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>('overview');
  const [userRole, setUserRole] = useState<UserRole>('parent');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(INITIAL_STUDENTS[0].id);
  const [mobileSwitcherOpen, setMobileSwitcherOpen] = useState(false);

  const [grades, setGrades] = useState<SubjectGrade[]>(INITIAL_GRADES);
  const [assignments] = useState(INITIAL_ASSIGNMENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [timeline, setTimeline] = useState<TimelineEntry[]>(INITIAL_TIMELINE);
  const [counselingNotes] = useState(INITIAL_COUNSELING_NOTES);
  const [slots, setSlots] = useState<ConsultationSlot[]>(INITIAL_CONSULTATION_SLOTS);
  const [bookings, setBookings] = useState<ConsultationBooking[]>(INITIAL_BOOKINGS);
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_THREADS);
  const [agendas, setAgendas] = useState<SchoolAgenda[]>(INITIAL_AGENDAS);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || students[0],
    [students, selectedStudentId]
  );

  const studentGrades = useMemo(
    () => grades.filter((g) => g.studentId === selectedStudent.id),
    [grades, selectedStudent.id]
  );

  const studentAssignments = useMemo(
    () => assignments.filter((a) => a.studentId === selectedStudent.id),
    [assignments, selectedStudent.id]
  );

  const studentAttendance = useMemo(
    () => attendance.filter((a) => a.studentId === selectedStudent.id),
    [attendance, selectedStudent.id]
  );

  const studentLeaveRequests = useMemo(
    () => leaveRequests.filter((l) => l.studentId === selectedStudent.id),
    [leaveRequests, selectedStudent.id]
  );

  const studentTimeline = useMemo(
    () => timeline.filter((t) => t.studentId === selectedStudent.id),
    [timeline, selectedStudent.id]
  );

  const studentCounseling = useMemo(
    () => counselingNotes.filter((c) => c.studentId === selectedStudent.id),
    [counselingNotes, selectedStudent.id]
  );

  const studentBookings = useMemo(
    () => bookings.filter((b) => b.studentId === selectedStudent.id),
    [bookings, selectedStudent.id]
  );

  const studentThreads = useMemo(
    () => threads.filter((t) => t.studentId === selectedStudent.id),
    [threads, selectedStudent.id]
  );

  const unreadMessagesCount = useMemo(
    () => studentThreads.reduce((sum, t) => sum + t.unreadCount, 0),
    [studentThreads]
  );

  const handleUpdateGradeScore = (
    gradeId: string,
    taskScore: number,
    midtermScore: number,
    finalExamScore: number,
    note: string
  ) => {
    const clampedTask = Math.max(0, Math.min(100, taskScore));
    const clampedMid = Math.max(0, Math.min(100, midtermScore));
    const clampedFinal = Math.max(0, Math.min(100, finalExamScore));
    const finalScore = Math.round((clampedTask + clampedMid + clampedFinal) / 3);

    const updatedGrades = grades.map((g) => {
      if (g.id !== gradeId) return g;
      return {
        ...g,
        taskScore: clampedTask,
        midtermScore: clampedMid,
        finalExamScore: clampedFinal,
        finalScore,
        status: finalScore >= g.kkm ? ('Tuntas' as const) : ('Remedial' as const),
        note,
        updatedAt: 'Baru saja',
      };
    });
    setGrades(updatedGrades);

    const currentStudentGrades = updatedGrades.filter(
      (g) => g.studentId === selectedStudent.id
    );
    const avg =
      currentStudentGrades.reduce((sum, g) => sum + g.finalScore, 0) /
      Math.max(1, currentStudentGrades.length);

    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent.id ? { ...s, gpaAverage: Number(avg.toFixed(1)) } : s
      )
    );
  };

  const handleSubmitLeaveRequest = (
    date: string,
    type: 'Izin' | 'Sakit',
    reason: string
  ) => {
    const newLeave: LeaveRequest = {
      id: `lv-${Date.now()}`,
      studentId: selectedStudent.id,
      date,
      type,
      reason,
      submittedAt: 'Baru saja',
      verified: false,
    };
    setLeaveRequests((prev) => [newLeave, ...prev]);

    const newTimeline: TimelineEntry = {
      id: `tl-${Date.now()}`,
      studentId: selectedStudent.id,
      category: 'Kehadiran',
      title: `Pengajuan Keterangan ${type} (${date})`,
      description: reason,
      timestamp: 'Baru saja',
      author: `Wali Murid ${selectedStudent.name}`,
      statusLabel: 'Menunggu',
      tone: 'warning',
    };
    setTimeline((prev) => [newTimeline, ...prev]);
  };

  const handleVerifyLeaveRequest = (leaveId: string) => {
    setLeaveRequests((prev) =>
      prev.map((lv) => (lv.id === leaveId ? { ...lv, verified: true } : lv))
    );
  };

  const handleAddTimelineEntry = (entry: Omit<TimelineEntry, 'id'>) => {
    setTimeline((prev) => [{ ...entry, id: `tl-${Date.now()}` }, ...prev]);
  };

  const handleQuickLogAttendance = (status: AttendanceStatus, note: string) => {
    const nowTime =
      status === 'Izin' || status === 'Sakit' ? '—' : '06:50 WIB';
    const newRec: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: selectedStudent.id,
      date: '13 Nov 2026',
      dayLabel: 'Jumat',
      checkInTime: nowTime,
      status,
      note,
    };
    setAttendance((prev) => [newRec, ...prev]);

    const tone =
      status === 'Hadir' ? 'success' : status === 'Terlambat' ? 'warning' : 'info';

    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}`,
        studentId: selectedStudent.id,
        category: 'Kehadiran',
        title: `Pembaruan Presensi: ${status}`,
        description: note,
        timestamp: 'Baru saja',
        author: selectedStudent.homeroomTeacher,
        statusLabel: status,
        tone,
      },
      ...prev,
    ]);
  };

  const handleBookSlot = (
    educatorId: string,
    slotId: string,
    topic: string,
    notes: string
  ) => {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return;

    const newBooking: ConsultationBooking = {
      id: `bk-${Date.now()}`,
      studentId: selectedStudent.id,
      educatorId,
      slotId,
      date: slot.date,
      timeRange: slot.timeRange,
      mode: slot.mode,
      locationOrLink: slot.locationOrLink,
      topic,
      notes,
      status: 'Terjadwal',
    };

    setBookings((prev) => [newBooking, ...prev]);
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, isAvailable: false } : s))
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'Dibatalkan' } : b
      )
    );
    if (target) {
      setSlots((prev) =>
        prev.map((s) =>
          s.id === target.slotId ? { ...s, isAvailable: true } : s
        )
      );
    }
  };

  const handleSendMessage = (threadId: string, content: string) => {
    const isEducator = userRole === 'educator';
    setThreads((prev) =>
      prev.map((thr) => {
        if (thr.id !== threadId) return thr;
        return {
          ...thr,
          unreadCount: 0,
          lastUpdated: 'Baru saja',
          messages: [
            ...thr.messages,
            {
              id: `m-${Date.now()}`,
              senderRole: isEducator ? 'school' : 'parent',
              senderName: isEducator
                ? selectedStudent.homeroomTeacher
                : `Orang Tua ${selectedStudent.name}`,
              content,
              timestamp: 'Baru saja',
            },
          ],
        };
      })
    );
  };

  const handleSelectThreadRead = (threadId: string) => {
    setThreads((prev) =>
      prev.map((thr) => (thr.id === threadId ? { ...thr, unreadCount: 0 } : thr))
    );
  };

  const handleToggleAgendaConfirm = (agendaId: string) => {
    setAgendas((prev) =>
      prev.map((a) =>
        a.id === agendaId ? { ...a, confirmedByParent: !a.confirmedByParent } : a
      )
    );
  };

  const handleAddAgenda = (
    agenda: Omit<SchoolAgenda, 'id' | 'confirmedByParent'>
  ) => {
    setAgendas((prev) => [
      { ...agenda, id: `agd-${Date.now()}`, confirmedByParent: false },
      ...prev,
    ]);
  };

  const screenMeta = SCREEN_TITLES[activeScreen];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#191C1E]">
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        students={students}
        selectedStudent={selectedStudent}
        onSelectStudent={setSelectedStudentId}
        userRole={userRole}
        onChangeRole={setUserRole}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Main Content Area */}
      <div className="md:pl-[76px] lg:pl-[268px] pb-20 md:pb-8">
        {/* Compact Mobile Top Bar (< 768px) */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0F294A] text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMobileSwitcherOpen((p) => !p)}
                className="flex items-center gap-1.5 text-left"
              >
                <span className="font-display font-bold text-sm text-[#0F294A] truncate max-w-[140px]">
                  {selectedStudent.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
              </button>
              {mobileSwitcherOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg p-1.5 z-50">
                  {students.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        setMobileSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs ${
                        s.id === selectedStudent.id
                          ? 'bg-[#EFF6FF] font-semibold text-[#0F294A]'
                          : 'text-[#191C1E]'
                      }`}
                    >
                      <AvatarImage
                        src={s.avatarUrl}
                        alt={s.name}
                        sizeClass="w-7 h-7"
                        fallbackInitials={s.name.slice(0, 2)}
                      />
                      <div className="min-w-0">
                        <p className="truncate">{s.name}</p>
                        <p className="text-[11px] text-[#64748B]">{s.className}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setUserRole((r) => (r === 'parent' ? 'educator' : 'parent'))
            }
            className="px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] text-[#0F294A] text-xs font-semibold flex items-center gap-1.5 shrink-0"
          >
            {userRole === 'parent' ? (
              <>
                <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Wali Murid</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Pendidik</span>
              </>
            )}
          </button>
        </header>

        {/* Desktop & Tablet Workspace Top Header */}
        <header className="hidden md:flex items-center justify-between gap-6 bg-white border-b border-slate-200/80 px-6 lg:px-8 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <span>SMP Taman Siswa</span>
              <span aria-hidden="true">/</span>
              <span>{selectedStudent.className}</span>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-[#0F294A]">
                {userRole === 'parent' ? 'Portal Orang Tua' : 'Ruang Kerja Pendidik'}
              </span>
            </div>
            <h1 className="font-display text-xl font-bold text-[#0F294A] mt-0.5 truncate">
              {screenMeta.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                setActiveScreen(
                  activeScreen === 'consultation' ? 'academics' : 'consultation'
                )
              }
              className="min-h-[40px] px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              {activeScreen === 'consultation'
                ? 'Lihat Nilai & Presensi'
                : 'Jadwalkan Konsultasi'}
            </button>
          </div>
        </header>

        {/* Fluid 12-Column Container (Max 1280px per spec) */}
        <main className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 pt-6">
          {activeScreen === 'overview' && (
            <OverviewScreen
              student={selectedStudent}
              userRole={userRole}
              grades={studentGrades}
              timeline={studentTimeline}
              counselingNotes={studentCounseling}
              agendas={agendas}
              onNavigate={setActiveScreen}
              onToggleAgendaConfirm={handleToggleAgendaConfirm}
              onAddTimelineEntry={handleAddTimelineEntry}
              onQuickLogAttendance={handleQuickLogAttendance}
            />
          )}

          {activeScreen === 'academics' && (
            <AcademicsScreen
              student={selectedStudent}
              userRole={userRole}
              grades={studentGrades}
              assignments={studentAssignments}
              attendance={studentAttendance}
              leaveRequests={studentLeaveRequests}
              onUpdateGradeScore={handleUpdateGradeScore}
              onSubmitLeaveRequest={handleSubmitLeaveRequest}
              onVerifyLeaveRequest={handleVerifyLeaveRequest}
            />
          )}

          {activeScreen === 'consultation' && (
            <ConsultationScreen
              student={selectedStudent}
              userRole={userRole}
              educators={EDUCATORS}
              slots={slots}
              bookings={studentBookings}
              onBookSlot={handleBookSlot}
              onCancelBooking={handleCancelBooking}
            />
          )}

          {activeScreen === 'messages' && (
            <MessagesAgendaScreen
              student={selectedStudent}
              userRole={userRole}
              threads={studentThreads}
              agendas={agendas}
              onSendMessage={handleSendMessage}
              onSelectThreadRead={handleSelectThreadRead}
              onToggleAgendaConfirm={handleToggleAgendaConfirm}
              onAddAgenda={handleAddAgenda}
            />
          )}
        </main>
      </div>
    </div>
  );
}
