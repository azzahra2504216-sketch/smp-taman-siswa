import React, { useState } from 'react';
import { LucideIcon, User } from 'lucide-react';

interface AcademicCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AcademicCard: React.FC<AcademicCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className = '',
}) => {
  return (
    <section
      className={`bg-white border border-slate-200/80 rounded-2xl p-6 transition-shadow duration-200 hover:shadow-[0_4px_20px_-2px_rgba(15,41,74,0.06)] ${className}`}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" strokeWidth={1.9} />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-[17px] font-semibold text-[#0F294A] leading-snug truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[#64748B] mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
};

interface AvatarImageProps {
  src: string;
  alt: string;
  sizeClass?: string;
  fallbackInitials?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  sizeClass = 'w-10 h-10',
  fallbackInitials,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-[#EFF6FF] text-[#0F294A] border border-slate-200 flex items-center justify-center font-display font-semibold text-sm shrink-0`}
        aria-label={alt}
      >
        {fallbackInitials || <User className="w-4 h-4 text-[#2563EB]" />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${sizeClass} rounded-full object-cover border border-slate-200/80 bg-[#F8FAFC] shrink-0`}
    />
  );
};
