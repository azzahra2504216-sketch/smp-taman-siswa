import React, { useState } from 'react';
import {
  Award,
  BookCheck,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock,
  FilePlus2,
  MessageSquarePlus,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { CAMPUS_BANNER_URL } from '../../data/mockAcademicData';
import {
  AttendanceStatus,
  CounselingNote,
  SchoolAgenda,
  ScreenKey,
  Student,
  SubjectGrade,
  TimelineEntry,
  UserRole,
} from '../../types/academic';
import { AcademicCard, AvatarImage } from '../ui/AcademicCard';
import { StatusIndicator } from '../ui/StatusIndicator';

interface OverviewScreenProps {
  student: Student;
  userRole: UserRole;
  grades: SubjectGrade[];
  timeline: TimelineEntry[];
  counselingNotes: CounselingNote[];
  agendas: SchoolAgenda[];
  onNavigate: (screen: ScreenKey) => void;
  onToggleAgendaConfirm: (agendaId: string) => void;
  onAddTimelineEntry: (entry: Omit<TimelineEntry, 'id'>) => void;
  onQuickLogAttendance: (status: AttendanceStatus, note: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  student,
  userRole,
  grades,
  timeline,
  counselingNotes,
  agendas,
  onNavigate,
  onToggleAgendaConfirm,
  onAddTimelineEntry,
  onQuickLogAttendance,
}) => {
  const [timelineFilter, setTimelineFilter] = useState<'Semua' | 'Akademik' | 'Kehadiran' | 'Konseling'>('Semua');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteDesc, setNewNoteDesc] = useState('');
  const [newNoteCat, setNewNoteCat] = useState<'Akademik' | 'Konseling'>('Akademik');
  const [quickAttendanceStatus, setQuickAttendanceStatus] = useState<AttendanceStatus>('Hadir');
  const [educatorNotice, setEducatorNotice] = useState<string | null>(null);

  const filteredTimeline = timeline.filter((item) =>
    timelineFilter === 'Semua' ? true : item.category === timelineFilter
  );

  const remedialCount = grades.filter((g) => g.status === 'Remedial').length;

  const handlePublishNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteDesc.trim()) return;
    onAddTimelineEntry({
      studentId: student.id,
      category: newNoteCat,
      title: newNoteTitle.trim(),
      description: newNoteDesc.trim(),
      timestamp: 'Baru saja',
      author: student.homeroomTeacher,
      statusLabel: newNoteCat === 'Konseling' ? 'Tuntas' : 'Info',
      tone: newNoteCat === 'Konseling' ? 'success' : 'info',
    });
    setNewNoteTitle('');
    setNewNoteDesc('');
    setEducatorNotice('Catatan perkembangan siswa telah diterbitkan ke portal wali murid.');
  };

  const handleLogAttendance = () => {
    onQuickLogAttendance(
      quickAttendanceStatus,
      `Dicatat langsung oleh ${student.homeroomTeacher} melalui dasbor pendidik.`
    );
    setEducatorNotice(`Presensi hari ini (${quickAttendanceStatus}) berhasil disimpan.`);
  };

  return (
    <div className="space-y-6">
      {/* Student Campus Context Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-[#0F294A] text-white">
        <img
          src={CAMPUS_BANNER_URL}
          alt="Halaman gedung SMP Taman Siswa"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative bg-gradient-to-r from-[#0F294A] via-[#0F294A]/92 to-[#0F294A]/70 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
            <AvatarImage
              src={student.avatarUrl}
              alt={student.name}
              sizeClass="w-16 h-16 ring-2 ring-white/25"
              fallbackInitials={student.name.slice(0, 2)}
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#B0C8F1] mb-1">
                {userRole === 'parent' ? 'Ringkasan Perkembangan Siswa' : 'Panel Wali Kelas & Pendidik'}
              </p>
              <h1 className="font-display text-2xl md:text-[28px] font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
                {student.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-[#D5E3FF] mt-1.5">
                <span className="tabular-nums">NIS {student.nis}</span>
                <span aria-hidden="true">·</span>
                <span>{student.className}</span>
                <span aria-hidden="true">·</span>
                <span>{student.semester}</span>
                <span aria-hidden="true">·</span>
                <span>Wali Kelas: {student.homeroomTeacher}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('academics')}
              className="min-h-[44px] px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/18 border border-white/20 text-sm font-medium text-white transition-colors whitespace-nowrap"
            >
              Lihat Rapor & Presensi
            </button>
            <button
              type="button"
              onClick={() => onNavigate('consultation')}
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-sm font-semibold text-white transition-colors whitespace-nowrap"
            >
              Jadwalkan Konsultasi
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column Metric Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Kehadiran Semester</p>
            <p className="font-display text-2xl font-bold text-[#0F294A] mt-1.5 tabular-nums">
              {student.attendanceRate.toFixed(1)}%
            </p>
            <p className="text-xs text-[#047857] mt-1.5 font-medium">
              Kategori Disiplin Baik
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Rata-Rata Nilai</p>
            <p className="font-display text-2xl font-bold text-[#0F294A] mt-1.5 tabular-nums">
              {student.gpaAverage.toFixed(1)}
            </p>
            <p className="text-xs text-[#64748B] mt-1.5 tabular-nums">
              {remedialCount > 0 ? `${remedialCount} mapel perlu penguatan` : 'Seluruh mapel tuntas'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Ketuntasan Tugas</p>
            <p className="font-display text-2xl font-bold text-[#0F294A] mt-1.5 tabular-nums">
              {student.completedTasks}/{student.totalTasks}
            </p>
            <p className="text-xs text-[#64748B] mt-1.5 tabular-nums">
              {Math.round((student.completedTasks / student.totalTasks) * 100)}% tugas selesai
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <BookCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#64748B]">Poin Apresiasi</p>
            <p className="font-display text-2xl font-bold text-[#0F294A] mt-1.5 tabular-nums">
              {student.meritPoints}
            </p>
            <p className="text-xs text-[#64748B] mt-1.5">
              Aktif KIR & literasi pagi
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Educator Quick Workspace Panel (Visible in Mode Pendidik) */}
      {userRole === 'educator' && (
        <AcademicCard
          title="Ruang Aksi Pendidik — Pembaruan Cepat"
          subtitle={`Input langsung untuk profil ${student.name} (${student.className})`}
          icon={FilePlus2}
        >
          {educatorNotice && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-[#ECFDF5] text-[#047857] text-sm font-medium flex items-center justify-between gap-3">
              <span>{educatorNotice}</span>
              <button
                type="button"
                onClick={() => setEducatorNotice(null)}
                className="text-xs underline shrink-0"
              >
                Tutup
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form onSubmit={handlePublishNote} className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                    Judul Catatan / Evaluasi Baru
                  </label>
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Contoh: Apresiasi Presentasi Proyek IPA"
                    className="w-full min-h-[44px] px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={newNoteCat}
                    onChange={(e) => setNewNoteCat(e.target.value as 'Akademik' | 'Konseling')}
                    className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Konseling">Konseling</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                  Ringkasan untuk Orang Tua
                </label>
                <textarea
                  rows={2}
                  value={newNoteDesc}
                  onChange={(e) => setNewNoteDesc(e.target.value)}
                  placeholder="Tuliskan observasi pembelajaran atau arahan tindak lanjut di rumah..."
                  className="w-full p-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                />
              </div>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors inline-flex items-center gap-2"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Terbitkan ke Linimasa</span>
              </button>
            </form>

            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-5 lg:pt-0 lg:pl-6 flex flex-col justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#0F294A] mb-1.5">
                  Catat Presensi Hari Ini
                </p>
                <p className="text-xs text-[#64748B] mb-3">
                  Pembaruan presensi otomatis dikirim ke halaman orang tua.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(['Hadir', 'Terlambat', 'Izin', 'Sakit'] as AttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setQuickAttendanceStatus(st)}
                      className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        quickAttendanceStatus === st
                          ? 'bg-[#EFF6FF] border-[#2563EB] text-[#0F294A]'
                          : 'bg-white border-slate-200 text-[#44474E] hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogAttendance}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-slate-300 text-[#0F294A] hover:bg-[#EFF6FF] text-sm font-semibold transition-colors"
              >
                Simpan Presensi ({quickAttendanceStatus})
              </button>
            </div>
          </div>
        </AcademicCard>
      )}

      {/* Main 12-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Chronological Learning & Attendance Timeline + Upcoming Agendas */}
        <div className="lg:col-span-7 space-y-6">
          <AcademicCard
            title="Linimasa Perkembangan & Kehadiran"
            subtitle="Rekaman kronologis aktivitas belajar dan kedisiplinan terbaru"
            icon={Clock}
            action={
              <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] border border-slate-200/80 rounded-lg">
                {(['Semua', 'Akademik', 'Kehadiran', 'Konseling'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTimelineFilter(tab)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      timelineFilter === tab
                        ? 'bg-white text-[#0F294A] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F294A]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            }
          >
            {filteredTimeline.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#64748B]">
                Belum ada catatan pada kategori ini.
              </div>
            ) : (
              <div className="relative pl-5 space-y-0">
                <div
                  className="absolute left-[7px] top-2 bottom-3 w-px bg-slate-200"
                  aria-hidden="true"
                />
                {filteredTimeline.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className={`relative pb-5 ${
                      idx !== filteredTimeline.length - 1 ? 'border-b border-[#F1F5F9] mb-5' : ''
                    }`}
                  >
                    <span
                      className="absolute -left-5 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#2563EB]"
                      aria-hidden="true"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 text-xs text-[#64748B]">
                        <span className="font-medium text-[#0F294A]">{entry.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{entry.timestamp}</span>
                      </div>
                      <StatusIndicator label={entry.statusLabel} tone={entry.tone} />
                    </div>
                    <h3 className="font-display text-[15px] font-semibold text-[#0F294A] leading-snug">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-[#44474E] mt-1 leading-relaxed">
                      {entry.description}
                    </p>
                    <p className="text-xs text-[#64748B] mt-2">Oleh: {entry.author}</p>
                  </div>
                ))}
              </div>
            )}
          </AcademicCard>

          <AcademicCard
            title="Agenda Sekolah Mendatang"
            subtitle="Kegiatan resmi dan konfirmasi kehadiran orang tua"
            icon={CalendarDays}
            action={
              <button
                type="button"
                onClick={() => onNavigate('messages')}
                className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap"
              >
                Semua Agenda →
              </button>
            }
          >
            <div className="divide-y divide-[#F1F5F9]">
              {agendas.slice(0, 2).map((agenda) => (
                <div key={agenda.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
                        <span>{agenda.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{agenda.date}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{agenda.timeRange}</span>
                      </div>
                      <h3 className="font-display text-[15px] font-semibold text-[#0F294A]">
                        {agenda.title}
                      </h3>
                    </div>
                    <StatusIndicator label={agenda.location} tone="info" iconType="map" />
                  </div>
                  <p className="text-sm text-[#44474E]">{agenda.description}</p>
                  {agenda.requiresConfirmation && (
                    <label className="inline-flex items-center gap-2.5 pt-1 cursor-pointer select-none min-h-[36px]">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={agenda.confirmedByParent}
                        onClick={() => onToggleAgendaConfirm(agenda.id)}
                        className={`w-5 h-5 rounded-[4px] flex items-center justify-center border transition-colors ${
                          agenda.confirmedByParent
                            ? 'bg-[#2563EB] border-[#2563EB] text-white'
                            : 'bg-white border-[#94A3B8] text-transparent hover:border-[#2563EB]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </button>
                      <span className="text-xs font-medium text-[#0F294A]">
                        {agenda.confirmedByParent
                          ? 'Kehadiran telah dikonfirmasi orang tua'
                          : 'Konfirmasi kehadiran pada agenda ini'}
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </AcademicCard>
        </div>

        {/* Right 5 Columns: Subject Performance Snapshot + Counseling Notes */}
        <div className="lg:col-span-5 space-y-6">
          <AcademicCard
            title="Capaian Evaluasi Mata Pelajaran"
            subtitle="Perbandingan nilai akhir terhadap batas KKM 75"
            icon={ClipboardCheck}
            action={
              <button
                type="button"
                onClick={() => onNavigate('academics')}
                className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap"
              >
                Rincian Nilai →
              </button>
            }
          >
            <div className="space-y-4">
              {grades.map((grade) => {
                const isRemedial = grade.status === 'Remedial';
                return (
                  <div key={grade.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0F294A] truncate">
                          {grade.subject}
                        </p>
                        <p className="text-xs text-[#64748B] truncate">
                          {grade.teacherName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="font-mono text-sm font-semibold text-[#0F294A] tabular-nums">
                          {grade.finalScore}
                        </span>
                        <StatusIndicator
                          label={grade.status}
                          tone={isRemedial ? 'warning' : 'success'}
                        />
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isRemedial ? 'bg-amber-500' : 'bg-[#2563EB]'
                        }`}
                        style={{ width: `${Math.min(100, grade.finalScore)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </AcademicCard>

          <AcademicCard
            title="Catatan Bimbingan Konseling"
            subtitle="Ringkasan pendampingan karakter & kesiapan belajar"
            icon={Award}
            action={
              <button
                type="button"
                onClick={() => onNavigate('consultation')}
                className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap"
              >
                Temu Konselor →
              </button>
            }
          >
            <div className="space-y-4 divide-y divide-[#F1F5F9]">
              {counselingNotes.map((note) => (
                <div key={note.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
                    <span className="font-medium text-[#0F294A]">
                      {note.counselorName}
                    </span>
                    <span className="tabular-nums">{note.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#0F294A]">
                    {note.topic}
                  </h3>
                  <p className="text-sm text-[#44474E] leading-relaxed">
                    {note.summary}
                  </p>
                  <div className="p-3 rounded-xl bg-[#EFF6FF] text-xs text-[#0F294A]">
                    <span className="font-semibold">Tindak Lanjut: </span>
                    <span>{note.followUp}</span>
                  </div>
                </div>
              ))}
            </div>
          </AcademicCard>
        </div>
      </div>
    </div>
  );
};
