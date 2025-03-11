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

    if (!password) return null

    return (
        <div className="mt-2 space-y-2">
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

