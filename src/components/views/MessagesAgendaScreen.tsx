import React, { useState } from 'react';
import {
  CalendarDays,
  Check,
  Megaphone,
  MessageSquareText,
  Send,
} from 'lucide-react';
import {
  MessageThread,
  SchoolAgenda,
  Student,
  UserRole,
} from '../../types/academic';
import { AcademicCard, AvatarImage } from '../ui/AcademicCard';
import { StatusIndicator } from '../ui/StatusIndicator';

interface MessagesAgendaScreenProps {
  student: Student;
  userRole: UserRole;
  threads: MessageThread[];
  agendas: SchoolAgenda[];
  onSendMessage: (threadId: string, content: string) => void;
  onSelectThreadRead: (threadId: string) => void;
  onToggleAgendaConfirm: (agendaId: string) => void;
  onAddAgenda: (agenda: Omit<SchoolAgenda, 'id' | 'confirmedByParent'>) => void;
}

export const MessagesAgendaScreen: React.FC<MessagesAgendaScreenProps> = ({
  student,
  userRole,
  threads,
  agendas,
  onSendMessage,
  onSelectThreadRead,
  onToggleAgendaConfirm,
  onAddAgenda,
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    threads[0]?.id || ''
  );
  const [messageInput, setMessageInput] = useState('');

  // Educator mode new agenda state
  const [agendaTitle, setAgendaTitle] = useState('');
  const [agendaDate, setAgendaDate] = useState('Senin, 30 Nov 2026');
  const [agendaTime, setAgendaTime] = useState('08:00 – 10:00 WIB');
  const [agendaLocation, setAgendaLocation] = useState('Aula SMP Taman Siswa');
  const [agendaDesc, setAgendaDesc] = useState('');
  const [agendaRequiresConfirm, setAgendaRequiresConfirm] = useState(true);

  const activeThread =
    threads.find((t) => t.id === selectedThreadId) || threads[0] || null;

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    onSelectThreadRead(threadId);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !messageInput.trim()) return;
    onSendMessage(activeThread.id, messageInput.trim());
    setMessageInput('');
  };

  const handlePublishAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaTitle.trim() || !agendaDesc.trim()) return;
    onAddAgenda({
      title: agendaTitle.trim(),
      date: agendaDate.trim(),
      timeRange: agendaTime.trim(),
      location: agendaLocation.trim(),
      category: 'Pengumuman Resmi',
      description: agendaDesc.trim(),
      requiresConfirmation: agendaRequiresConfirm,
    });
    setAgendaTitle('');
    setAgendaDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Two-panel Messaging Center */}
      <AcademicCard
        title="Pesan Resmi Sekolah & Wali Kelas"
        subtitle={`Saluran komunikasi langsung untuk ${student.name} (${student.className})`}
        icon={MessageSquareText}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Contact Thread List */}
          <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-[#F1F5F9] pb-4 lg:pb-0 lg:pr-4">
            {threads.length === 0 ? (
              <p className="text-sm text-[#64748B] py-4">
                Belum ada percakapan untuk siswa ini.
              </p>
            ) : (
              threads.map((thr) => {
                const isSelected = activeThread?.id === thr.id;
                const latestMsg = thr.messages[thr.messages.length - 1];
                return (
                  <button
                    key={thr.id}
                    type="button"
                    onClick={() => handleSelectThread(thr.id)}
                    className={`w-full p-3 rounded-xl text-left transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#EFF6FF] border border-[#2563EB]/30'
                        : 'hover:bg-[#F8FAFC] border border-transparent'
                    }`}
                  >
                    <AvatarImage
                      src={thr.contactAvatar}
                      alt={thr.contactName}
                      sizeClass="w-10 h-10"
                      fallbackInitials={thr.contactName.slice(0, 2)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#0F294A] truncate">
                          {thr.contactName}
                        </p>
                        {thr.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#2563EB] text-white text-[11px] font-semibold tabular-nums">
                            {thr.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] truncate">{thr.contactRole}</p>
                      {latestMsg && (
                        <p className="text-xs text-[#44474E] truncate mt-1">
                          {latestMsg.content}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Active Conversation */}
          <div className="lg:col-span-8 flex flex-col justify-between min-h-[340px]">
            {activeThread ? (
              <>
                <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-3 min-w-0">
                    <AvatarImage
                      src={activeThread.contactAvatar}
                      alt={activeThread.contactName}
                      sizeClass="w-9 h-9"
                      fallbackInitials={activeThread.contactName.slice(0, 2)}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F294A] truncate">
                        {activeThread.contactName}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">
                        {activeThread.contactRole} · Siswa: {student.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mb-4">
                  {activeThread.messages.map((msg) => {
                    const isSchool = msg.senderRole === 'school';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isSchool ? 'items-start' : 'items-end'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            isSchool
                              ? 'bg-[#EFF6FF] text-[#0F294A]'
                              : 'bg-[#0F294A] text-white'
                          }`}
                        >
                          <p className="text-xs font-semibold opacity-80 mb-1">
                            {msg.senderName}
                          </p>
                          <p>{msg.content}</p>
                        </div>
                        <span className="text-[11px] text-[#64748B] mt-1 px-1 tabular-nums">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSend} className="flex items-center gap-2.5 pt-3 border-t border-[#F1F5F9]">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      userRole === 'educator'
                        ? `Tulis pesan untuk orang tua ${student.name}...`
                        : `Tulis balasan kepada ${activeThread.contactName}...`
                    }
                    className="flex-1 min-h-[44px] px-4 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors inline-flex items-center gap-2 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Kirim</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="py-12 text-center text-sm text-[#64748B]">
                Pilih kontak di sebelah kiri untuk membuka riwayat pesan.
              </div>
            )}
          </div>
        </div>
      </AcademicCard>

      {/* Official School Agenda & Parent Confirmation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={userRole === 'educator' ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <AcademicCard
            title="Agenda & Pengumuman Resmi SMP Taman Siswa"
            subtitle="Jadwal kegiatan sekolah yang memerlukan perhatian atau konfirmasi orang tua"
            icon={CalendarDays}
          >
            <div className="divide-y divide-[#F1F5F9]">
              {agendas.map((agenda) => (
                <div key={agenda.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-1">
                        <span className="font-medium text-[#2563EB]">{agenda.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{agenda.date}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{agenda.timeRange}</span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-[#0F294A]">
                        {agenda.title}
                      </h3>
                    </div>
                    <StatusIndicator label={agenda.location} tone="info" iconType="map" />
                  </div>
                  <p className="text-sm text-[#44474E] leading-relaxed">
                    {agenda.description}
                  </p>
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
                          ? 'Terkonfirmasi: Orang tua telah membaca dan menyetujui agenda ini'
                          : 'Centang untuk mengonfirmasi kehadiran / persetujuan orang tua'}
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </AcademicCard>
        </div>

        {userRole === 'educator' && (
          <div className="lg:col-span-5">
            <AcademicCard
              title="Terbitkan Agenda Sekolah Baru"
              subtitle="Pengumuman akan tampil langsung pada dasbor seluruh wali murid"
              icon={Megaphone}
            >
              <form onSubmit={handlePublishAgenda} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                    Judul Kegiatan / Pengumuman
                  </label>
                  <input
                    type="text"
                    required
                    value={agendaTitle}
                    onChange={(e) => setAgendaTitle(e.target.value)}
                    placeholder="Contoh: Sosialisasi Persiapan Asesmen Akhir Semester"
                    className="w-full min-h-[44px] px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                      Tanggal
                    </label>
                    <input
                      type="text"
                      value={agendaDate}
                      onChange={(e) => setAgendaDate(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                      Waktu
                    </label>
                    <input
                      type="text"
                      value={agendaTime}
                      onChange={(e) => setAgendaTime(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={agendaLocation}
                    onChange={(e) => setAgendaLocation(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                    Deskripsi Kegiatan
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={agendaDesc}
                    onChange={(e) => setAgendaDesc(e.target.value)}
                    placeholder="Jelaskan rincian kegiatan dan hal yang perlu disiapkan..."
                    className="w-full p-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
                  />
                </div>
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={agendaRequiresConfirm}
                    onClick={() => setAgendaRequiresConfirm((p) => !p)}
                    className={`w-5 h-5 rounded-[4px] flex items-center justify-center border transition-colors ${
                      agendaRequiresConfirm
                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                        : 'bg-white border-[#94A3B8] text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                  <span className="text-xs font-medium text-[#0F294A]">
                    Minta konfirmasi kehadiran orang tua
                  </span>
                </label>
                <button
                  type="submit"
                  className="w-full min-h-[44px] px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
                >
                  Publikasikan Agenda
                </button>
              </form>
            </AcademicCard>
          </div>
        )}
      </div>
    </div>
  );
};
