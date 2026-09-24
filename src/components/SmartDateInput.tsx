import React, { useState, useEffect, useRef } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import {
  formatDateForDisplay,
  formatDateForStorage,
  isValidIndianDate,
  normalizeIndianDate,
  formatSmartDateInput,
  validateIndianDateDetails,
  DATE_DISPLAY_FORMAT
} from '../utils/dateUtils';

export interface SmartDateInputProps {
  id?: string;
  name?: string;
  value?: string; // Stored in internal ISO format: YYYY-MM-DD or DD/MM/YYYY
  onChange: (dateValue: string) => void; // Emits ISO or Indian format based on outputFormat
  onChangeRaw?: (displayDate: string, isoDate: string, isValid: boolean) => void;
  outputFormat?: 'iso' | 'indian'; // Default 'iso' (YYYY-MM-DD)
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  autoFocus?: boolean;
}

/**
 * Universal Smart Date Input Component (DD/MM/YYYY)
 * 
 * - Supports automatic digit-by-digit formatting (e.g., 05081983 -> 05/08/1983)
 * - Supports manual formatted entry (DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, YYYY-MM-DD)
 * - Complete calendar constraints & leap year validation (e.g., 29/02/2024 allowed, 31/02/1983 blocked)
 * - Retains smooth cursor control, backspace editing, and paste handling
 * - Integrated native calendar picker for direct visual selection
 */
export const SmartDateInput: React.FC<SmartDateInputProps> = ({
  id,
  name,
  value = '',
  onChange,
  onChangeRaw,
  outputFormat = 'iso',
  placeholder = DATE_DISPLAY_FORMAT,
  required = false,
  disabled = false,
  className = '',
  label,
  error: customError,
  min = '1900-01-01',
  max = '2099-12-31',
  autoFocus = false,
}) => {
  // Local display string in DD/MM/YYYY
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return value ? formatDateForDisplay(value) : '';
  });
  const [inputError, setInputError] = useState<string | null>(null);
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef<string>(displayValue);

  // Synchronize when value changes externally (e.g. Profile loading, Quick presets)
  useEffect(() => {
    if (value) {
      const formatted = formatDateForDisplay(value);
      if (formatted !== displayValue) {
        setDisplayValue(formatted);
        prevValueRef.current = formatted;
        setInputError(null);
      }
    } else if (displayValue !== '') {
      setDisplayValue('');
      prevValueRef.current = '';
      setInputError(null);
    }
  }, [value]);

  // Handle typing & digit-by-digit auto-formatting
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const prev = prevValueRef.current;

    // Apply universal smart date formatting
    const formatted = formatSmartDateInput(raw, prev);
    setDisplayValue(formatted);
    prevValueRef.current = formatted;

    if (!formatted.trim()) {
      setInputError(null);
      onChange('');
      onChangeRaw?.('', '', true);
      return;
    }

    // Validate date status
    const validation = validateIndianDateDetails(formatted, required);

    if (validation.isValid && validation.isComplete && validation.isoDate && validation.displayDate) {
      setInputError(null);
      const out = outputFormat === 'indian' ? validation.displayDate : validation.isoDate;
      onChange(out);
      onChangeRaw?.(validation.displayDate, validation.isoDate, true);
    } else if (validation.isComplete && !validation.isValid) {
      // Complete input but invalid (e.g., 31/02/1983 or invalid month)
      setInputError(validation.error || 'Invalid date');
      onChangeRaw?.(formatted, '', false);
    } else {
      // Partial input: clear errors while actively typing
      setInputError(null);
    }
  };

  // Handle onBlur validation & cleanup
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

    const validation = validateIndianDateDetails(trimmed, required);
    if (validation.isValid && validation.isComplete && validation.displayDate && validation.isoDate) {
      setDisplayValue(validation.displayDate);
      prevValueRef.current = validation.displayDate;
      setInputError(null);
      const out = outputFormat === 'indian' ? validation.displayDate : validation.isoDate;
      onChange(out);
      onChangeRaw?.(validation.displayDate, validation.isoDate, true);
    } else {
      setInputError(validation.error || `Invalid date. Use ${DATE_DISPLAY_FORMAT} (e.g. 05/08/1983)`);
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

  // Native date picked from calendar widget
  const handleNativeDatePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pickedIso = e.target.value; // Format: YYYY-MM-DD
    if (pickedIso) {
      const formatted = formatDateForDisplay(pickedIso);
      setDisplayValue(formatted);
      prevValueRef.current = formatted;
      setInputError(null);
      const out = outputFormat === 'indian' ? formatted : pickedIso;
      onChange(out);
      onChangeRaw?.(formatted, pickedIso, true);
    }
  };

  const activeError = customError || inputError;

  // Convert current value for hidden date picker
  const pickerIsoValue = value ? formatDateForStorage(value) : '';

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
          ref={textInputRef}
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
          autoFocus={autoFocus}
          autoComplete="bday"
          maxLength={10}
          className={`w-full bg-[#F8F4EF] border ${
            activeError
              ? 'border-red-400 focus:border-red-500 ring-1 ring-red-300'
              : 'border-[#E5E7EB] focus:border-[#D97706]'
          } focus:bg-white transition-all rounded-2xl pl-12 pr-10 py-3.5 outline-none text-sm text-[#1F2937] font-semibold placeholder:text-slate-400 placeholder:font-normal ${className}`}
        />

        {/* Hidden native date picker synced with the input */}
        <input
          ref={hiddenDateInputRef}
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          value={pickerIsoValue || ''}
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

export default SmartDateInput;
