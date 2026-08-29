import { cn } from '@/lib/utils';

export type StrengthLevel =
  | 'empty'
  | 'weak'
  | 'medium'
  | 'strong'
  | 'very-strong';

export interface PasswordStrengthBarProps {
  value: string;
  className?: string;
  showLabel?: boolean;
}

const calculateStrength = (
  password: string
): { score: number; level: StrengthLevel } => {
  if (!password) return { score: 0, level: 'empty' };

  let score = 0;

  if (password.length > 5) score += 1;
  if (password.length > 8) score += 1;

  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let level: StrengthLevel = 'empty';
  if (score === 0) level = 'empty';
  else if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'medium';
  else if (score <= 5) level = 'strong';
  else level = 'very-strong';

  return { score, level };
};

const strengthColors = {
  empty: 'bg-gray-200',
  weak: 'bg-red-500',
  medium: 'bg-orange-500',
  strong: 'bg-green-500',
  'very-strong': 'bg-emerald-500',
};

const strengthLabels = {
  empty: '',
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
  'very-strong': 'Very Strong',
};

export const PasswordStrengthBar = ({
  value,
  className,
  showLabel = true,
}: PasswordStrengthBarProps) => {
  const { level } = calculateStrength(value);

  const widthPercentage = {
    empty: '0%',
    weak: '25%',
    medium: '50%',
    strong: '75%',
    'very-strong': '100%',
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out',
            strengthColors[level]
          )}
          style={{ width: widthPercentage[level] }}
        />
      </div>
      {showLabel && level !== 'empty' && (
        <p className="text-xs text-muted-foreground">
          Password strength: {strengthLabels[level]}
        </p>
      )}
    </div>
  );
};
