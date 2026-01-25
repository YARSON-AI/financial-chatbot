import { useEffect, useRef } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
}

function validatePhone(phone: string): boolean {
  const cleanPhone = phone.trim();
  return cleanPhone.length >= 9 && /^[0-9]+$/.test(cleanPhone);
}

export function PhoneInput({ value, onChange, onSubmit, placeholder, className }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value.trim().length > 0;
  const isValid = validatePhone(value);
  const showError = hasValue && !isValid;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid) {
      onSubmit();
      return;
    }
    if ([8, 9, 27, 37, 38, 39, 40, 46].includes(e.keyCode) || (e.key >= '0' && e.key <= '9')) {
      return;
    }
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '' || /^[0-9]*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="tel"
        dir="rtl"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => window.parent.postMessage({ action: "scrollTop" }, "*")}
        placeholder={placeholder || "מספר הטלפון שלך..."}
        className={`w-full px-4 py-3 border rounded-full placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] focus:border-[var(--primary-green)] ${
          showError ? 'border-red-500 bg-red-50' : 'border-[#aeaeae] bg-white'
        } ${className || ''}`}
      />
      {showError && (
        <p className="text-red-500 text-sm mt-1 text-right">*מספר טלפון לא תקין</p>
      )}
    </div>
  );
}

export { validatePhone };
