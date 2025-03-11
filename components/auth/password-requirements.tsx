import { Check, X } from "lucide-react"

interface PasswordRequirementProps {
    meets: boolean
    text: string
}

function PasswordRequirement({ meets, text }: PasswordRequirementProps) {
    return (
        <div className="flex items-center gap-2">
            {meets ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-destructive" />}
            <span className={`text-sm ${meets ? "text-muted-foreground" : "text-destructive"}`}>{text}</span>
        </div>
    )
}

interface PasswordRequirementsProps {
    password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
    const hasMinLength = password.length >= 8
    const hasMaxLength = password.length <= 64
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password)

    const requirements = [hasMinLength, hasLowercase, hasUppercase, hasNumber, hasSpecialChar, hasMaxLength];
    const strengthScore = requirements.filter(Boolean).length;

    let strengthLevel: 'weak' | 'medium' | 'strong' = 'weak';
    let strengthColor = 'bg-red-500';
    let strengthText = 'Weak';

    if (strengthScore >= 5) {
        strengthLevel = 'strong';
        strengthColor = 'bg-green-500';
        strengthText = 'Strong';
    } else if (strengthScore >= 3) {
        strengthLevel = 'medium';
        strengthColor = 'bg-yellow-500';
        strengthText = 'Medium';
    }

    const strengthPercentage = (strengthScore / requirements.length) * 100;

    if (!password) return null

    return (
        <div className="mt-2 space-y-3">
            {/* Password strength indicator */}
            <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                    <span>Password strength:</span>
                    <span className={`font-medium ${strengthLevel === 'weak' ? 'text-red-500' :
                        strengthLevel === 'medium' ? 'text-yellow-500' :
                            'text-green-500'
                        }`}>
                        {strengthText}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${strengthColor} transition-all duration-300`}
                        style={{ width: `${strengthPercentage}%` }}
                    >
                    </div>
                </div>
            </div>

            <h4 className="text-sm font-medium">Password requirements:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <PasswordRequirement meets={hasMinLength} text="At least 8 characters" />
                <PasswordRequirement meets={hasMaxLength} text="Maximum 64 characters" />
                <PasswordRequirement meets={hasLowercase} text="One lowercase letter" />
                <PasswordRequirement meets={hasUppercase} text="One uppercase letter" />
                <PasswordRequirement meets={hasNumber} text="One number" />
                <PasswordRequirement meets={hasSpecialChar} text="One special character" />
            </div>
        </div>
    )
}