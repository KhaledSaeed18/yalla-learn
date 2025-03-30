"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BorderTrail } from '@/components/motion-primitives/border-trail'

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  showBorderTrail?: boolean
  borderTrailColor?: string
  borderTrailSize?: number
}

export function AuthCard({ 
  title, 
  description, 
  children, 
  footer, 
  showBorderTrail = true,
  borderTrailColor = "bg-primary",
  borderTrailSize = 30
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="w-full border-muted overflow-hidden shadow-[0px_0px_69px_0px_rgba(0,133,144,0.2)] relative">
        {showBorderTrail && (
          <BorderTrail 
            className={borderTrailColor} 
            size={borderTrailSize}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear"
            }}
          />
        )}
        <CardHeader className="space-y-1 relative z-10">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          {description && <CardDescription className="text-center">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="relative z-10">{children}</CardContent>
        {footer && <CardFooter className="relative z-10">{footer}</CardFooter>}
      </Card>
    </motion.div>
  )
}