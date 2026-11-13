import React from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  Video,
  MapPin,
  XCircle,
} from 'lucide-react';

export type StatusTone = 'success' | 'warning' | 'info' | 'danger';

interface StatusIndicatorProps {
  label: string;
  tone?: StatusTone;
  iconType?: 'check' | 'clock' | 'info' | 'danger' | 'video' | 'map' | 'calendar';
}

const TONE_STYLES: Record<StatusTone, string> = {
  success: 'bg-[#ECFDF5] text-[#047857]',
  warning: 'bg-[#FFFBEB] text-[#B45309]',
  info: 'bg-[#EFF6FF] text-[#1E40AF]',
  danger: 'bg-[#FEE2E2] text-[#B91C1C]',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  tone = 'info',
  iconType,
}) => {
  const renderIcon = () => {
    const cls = 'w-3.5 h-3.5 shrink-0';
    switch (iconType) {
      case 'check':
        return <CheckCircle2 className={cls} />;
      case 'clock':
        return <Clock className={cls} />;
      case 'danger':
        return <XCircle className={cls} />;
      case 'video':
        return <Video className={cls} />;
      case 'map':
        return <MapPin className={cls} />;
      case 'calendar':
        return <Calendar className={cls} />;
      case 'info':
        return <Info className={cls} />;
      default:
        if (tone === 'success') return <CheckCircle2 className={cls} />;
        if (tone === 'warning') return <AlertCircle className={cls} />;
        if (tone === 'danger') return <XCircle className={cls} />;
        return <Info className={cls} />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${TONE_STYLES[tone]}`}
    >
      {renderIcon()}
      <span>{label}</span>
    </span>
  );
};
