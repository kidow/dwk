'use client'

import { motion } from 'motion/react'

function Stagger({ children }: ReactProps): React.ReactElement {
  return (
    <motion.main
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
      }}
      className="space-y-24"
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.main>
  )
}

function StaggerSection({ children }: ReactProps): React.ReactElement {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
      }}
      transition={{
        duration: 0.3
      }}
    >
      {children}
    </motion.section>
  )
}

interface StaggerTitleProps {
  name: string
}

function StaggerTitle({ name }: StaggerTitleProps): React.ReactElement {
  return <h3 className="mb-3 text-lg font-medium">{name}</h3>
}

export { Stagger, StaggerSection, StaggerTitle }
