import React, { useState, useEffect, useRef } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import {
  formatDateForDisplay,
  formatDateForStorage,
  isValidIndianDate,
  normalizeIndianDate,
  DATE_DISPLAY_FORMAT
} from '../utils/dateUtils';

export interface DateInputProps {
  id?: string;
  name?: string;
  value?: string; // Stored in internal ISO format: YYYY-MM-DD
  onChange: (isoDate: string) => void; // Emits YYYY-MM-DD
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
}

/**
 * Standard Indian Date Input Component (DD/MM/YYYY)
 * 
 * - Displays guaranteed DD/MM/YYYY format to user regardless of browser locale
 * - Accepts manual keyboard typing in DD/MM/YYYY (supports 5/8/1983 or 05/08/1983)
 * - Has native calendar picker integration that converts to/from DD/MM/YYYY
 * - Always emits internal ISO YYYY-MM-DD to keep numerology and ASTRO engine logic 100% stable
 */
export const DateInput: React.FC<DateInputProps> = ({
  id,
  name,
  value = '',
  onChange,
  placeholder = DATE_DISPLAY_FORMAT,
  required = false,
  disabled = false,
  className = '',
  label,
  error: customError,
  min = '1900-01-01',
  max = '2099-12-31',
}) => {
  // Local display string in DD/MM/YYYY
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return value ? formatDateForDisplay(value) : '';
  });
  const [inputError, setInputError] = useState<string | null>(null);
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  // Sync when parent value changes externally (e.g., loading saved profile or preset)
  useEffect(() => {
    if (value) {
      const formatted = formatDateForDisplay(value);
      setDisplayValue(formatted);
      setInputError(null);
    } else {
      setDisplayValue('');
      setInputError(null);
    }
  }, [value]);

  // Handle manual typing
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);

    if (!raw.trim()) {
      setInputError(null);
      onChange('');
      return;
    }

    // Auto-normalize if user typed a complete date (e.g. 05/08/1983 or 05081983)
    if (isValidIndianDate(raw)) {
      setInputError(null);
      const iso = formatDateForStorage(raw);
      onChange(iso);
    }
  };

  // On blur, normalize display format or display error
  const handleBlur = () => {
    const trimmed = displayValue.trim();
    if (!trimmed) {
      if (required) {
        setInputError('Date of Birth is required');
      } else {
        setInputError(null);
      }
      return;
    }

    if (isValidIndianDate(trimmed)) {
      const normalized = normalizeIndianDate(trimmed);
      const iso = formatDateForStorage(trimmed);
      setDisplayValue(normalized);
      setInputError(null);
      onChange(iso);
    } else {
      setInputError(`Invalid date. Use ${DATE_DISPLAY_FORMAT} (e.g., 05/08/1983)`);
    }
  };

  // Open calendar picker popup
  const handleCalendarClick = () => {
    if (disabled) return;
    if (hiddenDateInputRef.current) {
      try {
        if ('showPicker' in HTMLInputElement.prototype) {
          hiddenDateInputRef.current.showPicker();
        } else {
          hiddenDateInputRef.current.focus();
        }
      } catch {
        hiddenDateInputRef.current.focus();
      }
    }
  };

  // When a date is picked from the native calendar widget
  const handleNativeDatePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pickedIso = e.target.value; // Format: YYYY-MM-DD
    if (pickedIso) {
      const formatted = formatDateForDisplay(pickedIso);
      setDisplayValue(formatted);
      setInputError(null);
      onChange(pickedIso);
    }
  };

  const activeError = customError || inputError;

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={id}
          className="block text-[10px] font-mono uppercase text-[#D97706] tracking-widest font-bold mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Calendar Icon Button with click to open picker */}
        <button
          type="button"
          tabIndex={-1}
          onClick={handleCalendarClick}
          disabled={disabled}
          title="Open Calendar Picker"
          className="absolute left-3.5 z-10 p-1 text-[#D97706]/70 hover:text-[#D97706] transition-colors cursor-pointer disabled:opacity-50"
        >
          <Calendar className="w-4 h-4" />
        </button>

        {/* Visible Controlled Text Input */}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete="bday"
          className={`w-full bg-[#F8F4EF] border ${
            activeError ? 'border-red-400 focus:border-red-500 ring-1 ring-red-300' : 'border-[#E5E7EB] focus:border-[#D97706]'
          } focus:bg-white transition-all rounded-2xl pl-12 pr-10 py-3.5 outline-none text-sm text-[#1F2937] font-semibold placeholder:text-slate-400 placeholder:font-normal ${className}`}
        />

        {/* Hidden native date picker synced with the input */}
        <input
          ref={hiddenDateInputRef}
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          value={value || ''}
          min={min}
          max={max}
          onChange={handleNativeDatePicked}
          className="sr-only absolute pointer-events-none opacity-0"
        />

        {/* Format Indicator Tag */}
        <div className="absolute right-3.5 pointer-events-none flex items-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-150/60 px-1.5 py-0.5 rounded uppercase tracking-wider">
            DD/MM/YYYY
          </span>
        </div>
      </div>

      {activeError && (
        <div className="flex items-center gap-1.5 text-red-600 text-[11px] mt-1.5 font-medium animate-in fade-in duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
};

export default DateInput;
