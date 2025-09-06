"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className = "" }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`space-y-4 ${className}`}
    >
      <div className="space-y-2">
        <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground">{title}</h1>
        {description && <p className="text-xl text-muted-foreground max-w-3xl">{description}</p>}
      </div>
      {children && <div className="pt-4">{children}</div>}
    </motion.div>
  )
}
