import React, { useState } from 'react';
import {
  BookOpen,
  CalendarClock,
  Check,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { ScreenKey, Student, UserRole } from '../../types/academic';
import { AvatarImage } from '../ui/AcademicCard';

interface SidebarProps {
  activeScreen: ScreenKey;
  onSelectScreen: (screen: ScreenKey) => void;
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (studentId: string) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  unreadMessagesCount: number;
}

const NAV_ITEMS: { key: ScreenKey; label: string; shortLabel: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'overview', label: 'Ringkasan', shortLabel: 'Beranda', icon: LayoutDashboard },
  { key: 'academics', label: 'Akademik & Presensi', shortLabel: 'Akademik', icon: BookOpen },
  { key: 'consultation', label: 'Konsultasi Guru', shortLabel: 'Konsultasi', icon: CalendarClock },
  { key: 'messages', label: 'Pesan & Agenda', shortLabel: 'Pesan', icon: MessageSquareText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onSelectScreen,
  students,
  selectedStudent,
  onSelectStudent,
  userRole,
  onChangeRole,
  unreadMessagesCount,
}) => {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <>
      {/* Desktop (lg) Fixed Sidebar & Tablet (md) Compact Icon Rail */}
      <aside
        className="hidden md:flex flex-col justify-between fixed inset-y-0 left-0 z-30 bg-[#0F294A] text-white md:w-[76px] lg:w-[268px] border-r border-[#00142F]/40 transition-all duration-200"
        aria-label="Navigasi utama"
      >
        <div className="p-3 lg:p-5 space-y-6">
          {/* Institutional Brand */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="font-display font-bold text-[15px] tracking-tight text-white truncate">
                SMP Taman Siswa
              </p>
              <p className="text-xs text-[#B0C8F1] truncate">
                Kemitraan Akademik
              </p>
            </div>
          </div>

          {/* Student Switcher (Spec Platform Component) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSwitcherOpen((prev) => !prev)}
              aria-expanded={switcherOpen}
              aria-label="Pilih siswa"
              className="w-full min-h-[48px] flex items-center justify-between gap-2.5 p-2 lg:px-3 lg:py-2.5 rounded-xl bg-[#1A375D] hover:bg-[#214370] border border-white/10 transition-colors text-left academic-focus"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <AvatarImage
                  src={selectedStudent.avatarUrl}
                  alt={selectedStudent.name}
                  sizeClass="w-8 h-8"
                  fallbackInitials={selectedStudent.name.slice(0, 2)}
                />
                <div className="hidden lg:block min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {selectedStudent.name}
                  </p>
                  <p className="text-xs text-[#B0C8F1] truncate tabular-nums">
                    {selectedStudent.className} · NIS {selectedStudent.nis}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`hidden lg:block w-4 h-4 text-[#B0C8F1] shrink-0 transition-transform duration-150 ${
                  switcherOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {switcherOpen && (
              <div
                className="absolute left-0 mt-2 w-64 bg-white text-[#191C1E] rounded-xl border border-slate-200 shadow-[0_12px_32px_-4px_rgba(15,41,74,0.16)] p-1.5 z-50"
                role="listbox"
                aria-label="Daftar siswa terdaftar"
              >
                <p className="px-2.5 py-1.5 text-[11px] font-medium text-[#64748B]">
                  {userRole === 'parent'
                    ? 'Putra/Putri Terdaftar'
                    : 'Pilih Profil Siswa'}
                </p>
                {students.map((student) => {
                  const isSelected = student.id === selectedStudent.id;
                  return (
                    <button
                      key={student.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectStudent(student.id);
                        setSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-[#EFF6FF] text-[#0F294A]'
                          : 'hover:bg-[#F8FAFC] text-[#191C1E]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <AvatarImage
                          src={student.avatarUrl}
                          alt={student.name}
                          sizeClass="w-8 h-8"
                          fallbackInitials={student.name.slice(0, 2)}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {student.name}
                          </p>
                          <p className="text-xs text-[#64748B] truncate tabular-nums">
                            {student.className} · NIS {student.nis}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1.5" aria-label="Menu utama">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelectScreen(item.key)}
                  title={item.label}
                  className={`w-full min-h-[44px] flex items-center justify-center lg:justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap academic-focus ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : 'text-[#D5E3FF] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="hidden lg:inline truncate">{item.label}</span>
                  </span>
                  {item.key === 'messages' && unreadMessagesCount > 0 && (
                    <span
                      className={`hidden lg:inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold tabular-nums ${
                        isActive
                          ? 'bg-white text-[#2563EB]'
                          : 'bg-[#EFF6FF] text-[#0F294A]'
                      }`}
                    >
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Role Mode Switcher */}
        <div className="p-3 lg:p-5 border-t border-white/10">
          <div className="hidden lg:block mb-2.5">
            <p className="text-xs font-medium text-[#B0C8F1]">Ruang Kerja Aktif</p>
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-1 p-1 rounded-lg bg-[#00142F]/60">
            <button
              type="button"
              onClick={() => onChangeRole('parent')}
              title="Mode Orang Tua"
              className={`min-h-[36px] flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                userRole === 'parent'
                  ? 'bg-white text-[#0F294A]'
                  : 'text-[#B0C8F1] hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">Wali Murid</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeRole('educator')}
              title="Mode Pendidik"
              className={`min-h-[36px] flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                userRole === 'educator'
                  ? 'bg-white text-[#0F294A]'
                  : 'text-[#B0C8F1] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">Pendidik</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (< 768px, capped well below 15% height) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around"
        aria-label="Navigasi seluler"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectScreen(item.key)}
              className={`min-h-[44px] flex-1 flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#64748B]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
