import React, { useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  MapPin,
  Users,
  Video,
  XCircle,
} from 'lucide-react';
import {
  ConsultationBooking,
  ConsultationSlot,
  EducatorProfile,
  Student,
  UserRole,
} from '../../types/academic';
import { AcademicCard, AvatarImage } from '../ui/AcademicCard';
import { StatusIndicator } from '../ui/StatusIndicator';

interface ConsultationScreenProps {
  student: Student;
  userRole: UserRole;
  educators: EducatorProfile[];
  slots: ConsultationSlot[];
  bookings: ConsultationBooking[];
  onBookSlot: (
    educatorId: string,
    slotId: string,
    topic: string,
    notes: string
  ) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const ConsultationScreen: React.FC<ConsultationScreenProps> = ({
  student,
  userRole,
  educators,
  slots,
  bookings,
  onBookSlot,
  onCancelBooking,
}) => {
  const [selectedEducatorId, setSelectedEducatorId] = useState<string>(educators[0].id);
  const [modeFilter, setModeFilter] = useState<'Semua' | 'Tatap Muka' | 'Daring'>('Semua');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingFeedback, setBookingFeedback] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const selectedEducator =
    educators.find((e) => e.id === selectedEducatorId) || educators[0];

  const educatorSlots = slots.filter(
    (s) =>
      s.educatorId === selectedEducatorId &&
      (modeFilter === 'Semua' ? true : s.mode === modeFilter)
  );

  const activeSlot = slots.find((s) => s.id === selectedSlotId) || null;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId || !topic.trim()) return;
    onBookSlot(selectedEducatorId, selectedSlotId, topic.trim(), notes.trim());
    setTopic('');
    setNotes('');
    setSelectedSlotId(null);
    setBookingFeedback(
      `Janji temu konsultasi dengan ${selectedEducator.name} berhasil dijadwalkan.`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 7 Columns: Konsultasi Booker */}
      <div className="lg:col-span-7 space-y-6">
        <AcademicCard
          title="Konsultasi Booker — Jadwal Temu Pendidik"
          subtitle={`Pilih guru pendamping dan slot waktu untuk membahas perkembangan ${student.name}`}
          icon={CalendarClock}
        >
          {bookingFeedback && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#ECFDF5] text-[#047857] text-sm font-medium flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{bookingFeedback}</span>
              </span>
              <button
                type="button"
                onClick={() => setBookingFeedback(null)}
                className="text-xs underline shrink-0"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Step 1: Select Educator */}
          <div className="space-y-2.5 mb-6">
            <label className="block text-sm font-semibold text-[#0F294A]">
              1. Pilih Guru atau Konselor Sekolah
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {educators.map((edu) => {
                const isSelected = edu.id === selectedEducatorId;
                return (
                  <button
                    key={edu.id}
                    type="button"
                    onClick={() => {
                      setSelectedEducatorId(edu.id);
                      setSelectedSlotId(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/15'
                        : 'bg-white border-slate-200 hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <AvatarImage
                        src={edu.avatarUrl}
                        alt={edu.name}
                        sizeClass="w-10 h-10"
                        fallbackInitials={edu.name.slice(0, 2)}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0F294A] truncate">
                          {edu.name}
                        </p>
                        <p className="text-[11px] text-[#64748B] truncate">
                          {edu.subjectOrUnit}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-[#44474E] line-clamp-2">{edu.role}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Interactive Time Slot Selector distinguishing Tatap Muka & Daring */}
          <div className="space-y-3 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-sm font-semibold text-[#0F294A]">
                2. Pilih Slot Waktu & Moda Pertemuan
              </label>
              <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] border border-slate-200/80 rounded-lg">
                {(['Semua', 'Tatap Muka', 'Daring'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModeFilter(m)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                      modeFilter === m
                        ? 'bg-white text-[#0F294A] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F294A]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {educatorSlots.length === 0 ? (
              <p className="text-sm text-[#64748B] py-4">
                Tidak ada slot tersedia pada moda pertemuan yang dipilih.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {educatorSlots.map((slot) => {
                  const isSelected = slot.id === selectedSlotId;
                  const isOnline = slot.mode === 'Daring';
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`min-h-[76px] p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                        !slot.isAvailable
                          ? 'bg-slate-50 border-slate-200 opacity-55 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/15'
                          : 'bg-white border-slate-200 hover:border-[#2563EB]/50 hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-sm font-semibold text-[#0F294A] tabular-nums">
                          {slot.date}
                        </span>
                        <StatusIndicator
                          label={slot.mode}
                          tone={isOnline ? 'info' : 'success'}
                          iconType={isOnline ? 'video' : 'map'}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#64748B] w-full">
                        <span className="font-mono font-medium text-[#0F294A] tabular-nums">
                          {slot.timeRange}
                        </span>
                        <span className="truncate">
                          {slot.isAvailable ? slot.locationOrLink : 'Sudah dipesan'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 3: Topic & Booking Submit */}
          <form onSubmit={handleConfirmBooking} className="space-y-4 pt-5 border-t border-[#F1F5F9]">
            <div>
              <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                3. Topik Pembahasan Utama
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Strategi pendampingan remedial IPS & kesiapan ujian"
                className="w-full min-h-[44px] px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F294A] mb-1.5">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan pertanyaan khusus yang ingin disiapkan guru sebelum pertemuan..."
                className="w-full p-3 rounded-lg border border-slate-300 bg-white text-sm text-[#191C1E] academic-input"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs text-[#64748B]">
                {activeSlot ? (
                  <span>
                    Slot terpilih:{' '}
                    <strong className="text-[#0F294A]">
                      {activeSlot.date} · {activeSlot.timeRange} ({activeSlot.mode})
                    </strong>
                  </span>
                ) : (
                  <span>Pilih salah satu slot waktu di atas untuk melanjutkan.</span>
                )}
              </div>
              <button
                type="submit"
                disabled={!selectedSlotId || !topic.trim()}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Konfirmasi Jadwal Konsultasi
              </button>
            </div>
          </form>
        </AcademicCard>
      </div>

      {/* Right 5 Columns: Scheduled Bookings List */}
      <div className="lg:col-span-5 space-y-6">
        <AcademicCard
          title="Jadwal Konsultasi Terdaftar"
          subtitle={
            userRole === 'educator'
              ? `Daftar sesi temu wali murid untuk ${student.name}`
              : `Pertemuan terjadwal bersama pendidik ${student.name}`
          }
          icon={Users}
        >
          {bookings.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#64748B]">
              Belum ada jadwal konsultasi aktif untuk siswa ini.
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-[#F1F5F9]">
              {bookings.map((bk) => {
                const edu = educators.find((e) => e.id === bk.educatorId);
                const isCancelled = bk.status === 'Dibatalkan';
                const isConfirming = confirmCancelId === bk.id;

                return (
                  <div key={bk.id} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <AvatarImage
                          src={edu?.avatarUrl || ''}
                          alt={edu?.name || 'Pendidik'}
                          sizeClass="w-10 h-10"
                          fallbackInitials="GR"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0F294A] truncate">
                            {edu?.name || 'Guru Pendamping'}
                          </p>
                          <p className="text-xs text-[#64748B] truncate tabular-nums">
                            {bk.date} · {bk.timeRange}
                          </p>
                        </div>
                      </div>
                      <StatusIndicator
                        label={bk.status}
                        tone={isCancelled ? 'danger' : 'success'}
                        iconType={isCancelled ? 'danger' : 'check'}
                      />
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#1E40AF]">
                        {bk.mode === 'Daring' ? (
                          <Video className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>
                          {bk.mode} · {bk.locationOrLink}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#0F294A]">{bk.topic}</p>
                      {bk.notes && (
                        <p className="text-xs text-[#44474E] leading-relaxed">{bk.notes}</p>
                      )}
                    </div>

                    {!isCancelled && (
                      <div>
                        {isConfirming ? (
                          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#FEE2E2] text-[#B91C1C]">
                            <span className="text-xs font-medium">
                              Batalkan jadwal konsultasi ini?
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  onCancelBooking(bk.id);
                                  setConfirmCancelId(null);
                                }}
                                className="px-2.5 py-1 rounded-md bg-[#B91C1C] text-white text-xs font-semibold"
                              >
                                Ya, Batalkan
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmCancelId(null)}
                                className="px-2.5 py-1 rounded-md bg-white text-[#0F294A] text-xs font-medium"
                              >
                                Tidak
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmCancelId(bk.id)}
                            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#FEE2E2] hover:bg-red-200/80 text-[#B91C1C] text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Batalkan Janji Temu</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </AcademicCard>
      </div>
    </div>
  );
};
