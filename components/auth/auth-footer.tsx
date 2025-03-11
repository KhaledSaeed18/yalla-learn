import Link from "next/link"

interface AuthFooterProps {
  text: string
  linkText: string
  linkHref: string
}

export function AuthFooter({ text, linkText, linkHref }: AuthFooterProps) {
  return (
    <div className="text-center text-sm mt-6">
      <span className="text-muted-foreground">{text}</span>{" "}
      <Link href={linkHref} className="text-primary hover:underline font-medium">
        {linkText}
      </Link>
    </div>
  )
}

