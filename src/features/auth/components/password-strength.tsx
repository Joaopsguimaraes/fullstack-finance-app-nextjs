import { CheckIcon } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const checks = [
    { label: 'At least 8 characters', test: password.length >= 8 },
    { label: 'Contains uppercase letter', test: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', test: /[a-z]/.test(password) },
    { label: 'Contains number', test: /\d/.test(password) },
    {
      label: 'Contains special character',
      test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ]

  const passedChecks = checks.filter(check => check.test).length
  const strength =
    passedChecks === 0 ? 0 : passedChecks <= 2 ? 1 : passedChecks <= 4 ? 2 : 3
  const strengthColors = [
    'bg-gray-200',
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
  ]
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong']

  if (password.length === 0) return null

  return (
    <div className='space-y-2'>
      <div className='flex space-x-1'>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1 w-full rounded-full transition-colors ${
              i < strength ? strengthColors[strength] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <div className='space-y-1'>
        <p
          className={`text-xs font-medium ${
            strength === 3
              ? 'text-green-600'
              : strength === 2
                ? 'text-yellow-600'
                : 'text-red-600'
          }`}
        >
          {strengthLabels[strength]} {strength > 0 && `(${passedChecks}/5)`}
        </p>
        <div className='space-y-0.5'>
          {checks.map((check, index) => (
            <div key={index} className='flex items-center space-x-2 text-xs'>
              <CheckIcon
                className={`h-3 w-3 ${
                  check.test ? 'text-green-600' : 'text-muted-foreground'
                }`}
              />
              <span
                className={
                  check.test ? 'text-green-600' : 'text-muted-foreground'
                }
              >
                {check.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
