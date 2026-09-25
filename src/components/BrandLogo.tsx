import React, { useState } from 'react';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  bordered?: boolean;
}

/**
 * Universal BrandLogo component for LeoFamily Numerology
 * Renders the official public/logo.jpg asset with graceful styling & fallback
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  bordered = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 rounded-lg text-xs',
    sm: 'w-8 h-8 rounded-xl text-sm',
    md: 'w-11 h-11 rounded-2xl text-base',
    lg: 'w-16 h-16 rounded-2xl text-2xl',
    xl: 'w-24 h-24 rounded-3xl text-4xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeClasses[size]} overflow-hidden bg-white ${
          bordered ? 'border border-[#D97706]/30 shadow-xs ring-1 ring-amber-100' : ''
        } flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}
      >
        {!imgError ? (
          <img
            src="/logo.jpg"
            alt="LeoFamily Numerology Official Logo"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        ) : (
          <span className="text-[#D97706] font-bold select-none">⚜️</span>
        )}
      </div>
      {showText && (
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-playfair font-black text-sm md:text-base tracking-wide text-[#1F2937]">
              LeoFamily
            </span>
            <span className="bg-[#D97706]/10 text-[#D97706] font-mono text-[8px] px-1.5 py-0.2 rounded font-bold uppercase tracking-widest border border-[#D97706]/20">
              Vedic Pro
            </span>
          </div>
          <span className="block text-[8px] font-mono text-[#6B7280] tracking-[0.15em] uppercase">
            Astro-Numerology Portal
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
