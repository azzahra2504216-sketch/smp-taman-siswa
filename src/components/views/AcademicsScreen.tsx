import React, { useState } from 'react';
import {
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Edit3,
  FileText,
  Search,
  Send,
} from 'lucide-react';
import {
  AssignmentItem,
  AttendanceRecord,
  LeaveRequest,
  Student,
  SubjectGrade,
  UserRole,
} from '../../types/academic';
import { AcademicCard } from '../ui/AcademicCard';
import { StatusIndicator } from '../ui/StatusIndicator';

interface AcademicsScreenProps {
  student: Student;
  userRole: UserRole;
  grades: SubjectGrade[];
  assignments: AssignmentItem[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  onUpdateGradeScore: (
    gradeId: string,
    taskScore: number,
    midtermScore: number,
    finalExamScore: number,
    note: string
  ) => void;
  onSubmitLeaveRequest: (date: string, type: 'Izin' | 'Sakit', reason: string) => void;
  onVerifyLeaveRequest: (leaveId: string) => void;
}

export const AcademicsScreen: React.FC<AcademicsScreenProps> = ({
  student,
  userRole,
  grades,
  assignments,
  attendance,
  leaveRequests,
  onUpdateGradeScore,
  onSubmitLeaveRequest,
  onVerifyLeaveRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'grades' | 'attendance' | 'assignments'>('grades');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Tuntas' | 'Remedial'>('Semua');

  // Inline grade editor state for Educator Mode
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<number>(80);
  const [editMid, setEditMid] = useState<number>(80);
  const [editFinal, setEditFinal] = useState<number>(80);
  const [editNote, setEditNote] = useState<string>('');

  // Leave request form state for Parent Mode
  const [leaveDate, setLeaveDate] = useState('2026-11-16');
  const [leaveType, setLeaveType] = useState<'Izin' | 'Sakit'>('Izin');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveFeedback, setLeaveFeedback] = useState<string | null>(null);

  const filteredGrades = grades.filter((g) => {
    const matchesSearch =
      g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' ? true : g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const startEditing = (grade: SubjectGrade) => {
    setEditingGradeId(grade.id);
    setEditTask(grade.taskScore);
    setEditMid(grade.midtermScore);
    setEditFinal(grade.finalExamScore);
    setEditNote(grade.note);
  };

  const handleSaveGrade = (gradeId: string) => {
    onUpdateGradeScore(gradeId, editTask, editMid, editFinal, editNote);
    setEditingGradeId(null);
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    const formattedDate = new Date(leaveDate).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    onSubmitLeaveRequest(formattedDate, leaveType, leaveReason.trim());
    setLeaveReason('');
    setLeaveFeedback('Pengajuan keterangan ketidakhadiran telah dikirim ke Wali Kelas.');
  };

  const attendanceSummary = {
    hadir: attendance.filter((a) => a.status === 'Hadir').length,
    terlambat: attendance.filter((a) => a.status === 'Terlambat').length,
    izinSakit: attendance.filter((a) => a.status === 'Izin' || a.status === 'Sakit').length,
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-3 sm:px-5">
        <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] border border-slate-200/80 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('grades')}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'grades'
                ? 'bg-white text-[#0F294A] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F294A]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#2563EB]" />
            <span>Evaluasi Nilai</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-white text-[#0F294A] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F294A]'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4 text-[#2563EB]" />
            <span>Rekam Kehadiran</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'bg-white text-[#0F294A] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F294A]'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-[#2563EB]" />
            <span>Tugas & Remedial</span>
          </button>
        </div>

        <p className="text-xs text-[#64748B] px-1">
          {student.name} · {student.className} · KKM Standar: <span className="font-mono font-semibold text-[#0F294A]">75</span>
        </p>
      </div>

      {/* TAB 1: EVALUASI NILAI */}
      {activeTab === 'grades' && (
        <AcademicCard
          title="Daftar Nilai Mata Pelajaran"
          subtitle={
            userRole === 'educator'
              ? 'Klik Ubah Nilai untuk memperbarui skor tugas, PTS, PAS, dan status ketuntasan.'
              : 'Rekapitulasi nilai tugas, PTS, PAS, serta catatan umpan balik guru mata pelajaran.'
          }
          icon={BookOpen}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari mapel atau guru..."
                  className="min-h-[40px] pl-9 pr-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] w-48 sm:w-56 academic-input"
                />
              </div>
              <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] border border-slate-200/80 rounded-lg">
                {(['Semua', 'Tuntas', 'Remedial'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      statusFilter === status
                        ? 'bg-white text-[#0F294A] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F294A]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          }
        >
          {filteredGrades.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#64748B]">
              Tidak ditemukan mata pelajaran yang cocok dengan filter pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-[#64748B]">
                    <th className="py-3 pr-4">Mata Pelajaran</th>
                    <th className="py-3 px-3 text-right">Tugas</th>
                    <th className="py-3 px-3 text-right">PTS</th>
                    <th className="py-3 px-3 text-right">PAS</th>
                    <th className="py-3 px-3 text-right">Nilai Akhir</th>
                    <th className="py-3 px-3 text-right">KKM</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 pl-3">Catatan Guru</th>
                    {userRole === 'educator' && <th className="py-3 pl-3 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-sm">
                  {filteredGrades.map((grade) => {
                    const isEditing = editingGradeId === grade.id;
                    return (
                      <tr
                        key={grade.id}
                        className="hover:bg-[#F8FAFC] transition-colors align-top"
                      >
                        <td className="py-4 pr-4">
                          <p className="font-semibold text-[#0F294A]">{grade.subject}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">{grade.teacherName}</p>
                        </td>

                        {isEditing ? (
                          <>
                            <td className="py-3 px-2 text-right">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={editTask}
                                onChange={(e) => setEditTask(Number(e.target.value))}
                                className="w-16 min-h-[36px] px-2 text-right rounded-md border border-slate-300 font-mono text-sm tabular-nums academic-input"
                              />
                            </td>
                            <td className="py-3 px-2 text-right">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={editMid}
                                onChange={(e) => setEditMid(Number(e.target.value))}
                                className="w-16 min-h-[36px] px-2 text-right rounded-md border border-slate-300 font-mono text-sm tabular-nums academic-input"
                              />
                            </td>
                            <td className="py-3 px-2 text-right">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={editFinal}
                                onChange={(e) => setEditFinal(Number(e.target.value))}
                                className="w-16 min-h-[36px] px-2 text-right rounded-md border border-slate-300 font-mono text-sm tabular-nums academic-input"
                              />
                            </td>
                            <td className="py-4 px-3 text-right font-mono font-bold text-[#2563EB] tabular-nums">
                              {Math.round((editTask + editMid + editFinal) / 3)}
                            </td>
                            <td className="py-4 px-3 text-right font-mono text-[#64748B] tabular-nums">
                              {grade.kkm}
                            </td>
                            <td className="py-4 px-3">
                              <StatusIndicator
                                label={
                                  Math.round((editTask + editMid + editFinal) / 3) >= grade.kkm
                                    ? 'Tuntas'
                                    : 'Remedial'
                                }
                                tone={
                                  Math.round((editTask + editMid + editFinal) / 3) >= grade.kkm
                                    ? 'success'
                                    : 'warning'
                                }
                              />
                            </td>
                            <td className="py-3 pl-3">
                              <input
                                type="text"
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value)}
                                className="w-full min-w-[180px] min-h-[36px] px-2.5 rounded-md border border-slate-300 text-xs academic-input"
                              />
                            </td>
                            <td className="py-3 pl-3 text-right whitespace-nowrap space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleSaveGrade(grade.id)}
                                className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
                              >
                                Simpan
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingGradeId(null)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-[#44474E] hover:bg-slate-50"
                              >
                                Batal
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-3 text-right font-mono text-[#191C1E] tabular-nums">
                              {grade.taskScore}
                            </td>
                            <td className="py-4 px-3 text-right font-mono text-[#191C1E] tabular-nums">
                              {grade.midtermScore}
                            </td>
                            <td className="py-4 px-3 text-right font-mono text-[#191C1E] tabular-nums">
                              {grade.finalExamScore}
                            </td>
                            <td className="py-4 px-3 text-right font-mono font-bold text-[#0F294A] tabular-nums">
                              {grade.finalScore}
                            </td>
                            <td className="py-4 px-3 text-right font-mono text-[#64748B] tabular-nums">
                              {grade.kkm}
                            </td>
                            <td className="py-4 px-3">
                              <StatusIndicator
                                label={grade.status}
                                tone={grade.status === 'Tuntas' ? 'success' : 'warning'}
                              />
                            </td>
                            <td className="py-4 pl-3 text-xs text-[#44474E] max-w-[260px] leading-relaxed">
                              <p>{grade.note}</p>
                              <p className="text-[11px] text-[#64748B] mt-1 tabular-nums">
                                Diperbarui {grade.updatedAt}
                              </p>
                            </td>
                            {userRole === 'educator' && (
                              <td className="py-4 pl-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => startEditing(grade)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-[#0F294A] hover:bg-[#EFF6FF] transition-colors whitespace-nowrap"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Ubah</span>
                                </button>
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AcademicCard>
      )}

      {/* TAB 2: REKAM KEHADIRAN */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <AcademicCard
              title="Log Kehadiran Harian"
              subtitle={`Rekam presensi gerbang sekolah · Hadir: ${attendanceSummary.hadir} · Terlambat: ${attendanceSummary.terlambat} · Izin/Sakit: ${attendanceSummary.izinSakit}`}
              icon={CalendarCheck2}
            >
              <div className="divide-y divide-[#F1F5F9]">
                {attendance.map((rec) => {
                  const tone =
                    rec.status === 'Hadir'
                      ? 'success'
                      : rec.status === 'Terlambat'
                      ? 'warning'
                      : 'info';
                  return (
                    <div
                      key={rec.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <span className="font-semibold text-[#0F294A]">
                            {rec.dayLabel}, {rec.date}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            Masuk: {rec.checkInTime}
                          </span>
                        </div>
                        <p className="text-sm text-[#44474E]">{rec.note}</p>
                      </div>
                      <StatusIndicator label={rec.status} tone={tone} />
                    </div>
                  );
                })}
              </div>
            </AcademicCard>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <AcademicCard
              title={
                userRole === 'parent'
                  ? 'Ajukan Keterangan Izin / Sakit'
                  : 'Daftar Pengajuan Izin Wali Murid'
              }
              subtitle={
                userRole === 'parent'
                  ? 'Kirim pemberitahuan ketidakhadiran langsung ke Wali Kelas'
                  : 'Verifikasi surat keterangan yang diajukan orang tua'
              }
              icon={FileText}
            >
              {userRole === 'parent' && (
                <form onSubmit={handleLeaveSubmit} className="space-y-4 mb-6 pb-6 border-b border-[#F1F5F9]">
                  {leaveFeedback && (
                    <div className="p-3 rounded-lg bg-[#ECFDF5] text-[#047857] text-xs font-medium">
                      {leaveFeedback}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        value={leaveDate}
                        onChange={(e) => setLeaveDate(e.target.value)}
                        className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                        Jenis Keterangan
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value as 'Izin' | 'Sakit')}
                        className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                      >
                        <option value="Izin">Izin Keluarga</option>
                        <option value="Sakit">Sakit</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                      Alasan / Keterangan Singkat
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="Tuliskan alasan ketidakhadiran atau informasi kondisi kesehatan anak..."
                      className="w-full p-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full min-h-[44px] px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pemberitahuan Izin</span>
                  </button>
                </form>
              )}

              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#64748B]">
                  Riwayat Pengajuan ({leaveRequests.length})
                </p>
                {leaveRequests.length === 0 ? (
                  <p className="text-sm text-[#64748B] py-3">
                    Belum ada pengajuan izin tercatat untuk {student.name}.
                  </p>
                ) : (
                  leaveRequests.map((lv) => (
                    <div
                      key={lv.id}
                      className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-[#0F294A] tabular-nums">
                          {lv.date} · {lv.type}
                        </span>
                        <StatusIndicator
                          label={lv.verified ? 'Diverifikasi' : 'Menunggu'}
                          tone={lv.verified ? 'success' : 'warning'}
                        />
                      </div>
                      <p className="text-sm text-[#44474E]">{lv.reason}</p>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-xs text-[#64748B] tabular-nums">
                          Dikirim {lv.submittedAt}
                        </span>
                        {userRole === 'educator' && !lv.verified && (
                          <button
                            type="button"
                            onClick={() => onVerifyLeaveRequest(lv.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verifikasi</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </AcademicCard>
          </div>
        </div>
      )}

      {/* TAB 3: TUGAS & REMEDIAL */}
      {activeTab === 'assignments' && (
        <AcademicCard
          title="Daftar Tugas & Program Penguatan (Remedial)"
          subtitle="Pantau tenggat waktu pengumpulan dan catatan evaluasi perbaikan"
          icon={ClipboardList}
        >
          <div className="divide-y divide-[#F1F5F9]">
            {assignments.map((asg) => {
              const tone =
                asg.status === 'Tuntas'
                  ? 'success'
                  : asg.status === 'Remedial'
                  ? 'warning'
                  : 'info';
              return (
                <div
                  key={asg.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      <span className="font-semibold text-[#0F294A]">{asg.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">Batas: {asg.dueDate}</span>
                    </div>
                    <h3 className="font-display text-[15px] font-semibold text-[#0F294A]">
                      {asg.title}
                    </h3>
                    <p className="text-sm text-[#44474E]">{asg.feedback}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-[11px] text-[#64748B]">Skor</p>
                      <p className="font-mono text-base font-bold text-[#0F294A] tabular-nums">
                        {asg.score !== null ? asg.score : '—'}
                      </p>
                    </div>
                    <StatusIndicator label={asg.status} tone={tone} />
                  </div>
                </div>
              );
            })}
          </div>
        </AcademicCard>
      )}
    </div>
  );
};
