import { useEffect, useRef } from 'react';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
}

function validateEmail(email: string): boolean {
  const cleanEmail = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
}

export function EmailInput({ value, onChange, onSubmit, placeholder, className }: EmailInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value.trim().length > 0;
  const isValid = validateEmail(value);
  const showError = hasValue && !isValid;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="email"
        dir="rtl"
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onBlur={() => window.parent.postMessage({ action: "scrollTop" }, "*")}
        placeholder={placeholder || "כתובת האימייל שלך..."}
        className={`w-full px-4 py-3 border rounded-full placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--primary-green)] focus:border-[var(--primary-green)] ${
          showError ? 'border-red-500 bg-red-50' : 'border-[#aeaeae] bg-white'
        } ${className || ''}`}
      />
      {showError && (
        <p className="text-red-500 text-sm mt-1 text-right">*כתובת אימייל לא תקינה</p>
      )}
    </div>
  );
}

export { validateEmail };
