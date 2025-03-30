"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface AuthFooterProps {
  text: string
  linkText: string
  linkHref: string
}

export function AuthFooter({ text, linkText, linkHref }: AuthFooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="text-center text-sm mt-6"
    >
      <span className="text-muted-foreground">{text}</span>{" "}
      <Link
        href={linkHref}
        className="text-primary hover:underline font-medium transition-all duration-200 hover:text-primary/80"
      >
        {linkText}
      </Link>
    </motion.div>
  )
}

