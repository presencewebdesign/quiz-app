interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const TextInput = ({
  value,
  onChange,
  onKeyPress,
  placeholder,
  disabled = false,
  maxLength,
}: TextInputProps) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyPress={onKeyPress}
    placeholder={placeholder}
    disabled={disabled}
    maxLength={maxLength}
    className="text-input"
  />
);
