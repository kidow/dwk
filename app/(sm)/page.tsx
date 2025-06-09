'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger
} from '@/components/ui/disclosure'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Stagger, StaggerSection, StaggerTitle } from '@/components/ui/stagger'
import { CAREERS } from '@/data/careers'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function Page(): React.ReactElement {
  const { setTheme } = useTheme()
  return (
    <>
      <Header title="Dongwook Kim" description="Web Frontend Engineer" />

      <Stagger>
        <motion.section>
          <p className="text-zinc-600 dark:text-zinc-400">
            Committed to profitable outcomes, while simultaneously passionate
            about crafting beautiful UI.
          </p>
        </motion.section>

        <StaggerSection>
          <StaggerTitle name="Projects" />
        </StaggerSection>

        <StaggerSection>
          <StaggerTitle name="Toys" />
          <ul className="space-y-2">
            <li>
              <Link href="/memo" className="underline dark:text-zinc-300">
                Memo
              </Link>
            </li>
            <li>
              <Link href="/kanban" className="underline dark:text-zinc-300">
                Kanban
              </Link>
            </li>
          </ul>
        </StaggerSection>

        <StaggerSection>
          <StaggerTitle name="Games" />
        </StaggerSection>

        <StaggerSection>
          <StaggerTitle name="Careers" />
          <div className="space-y-2">
            {CAREERS.map((item, key) => (
              <Disclosure
                key={key}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-4"
              >
                <DisclosureTrigger>
                  <button className="w-full flex text-left justify-between">
                    <div>
                      <h4 className="dark:text-zinc-100">{item.title}</h4>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        {item.company}
                      </p>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {item.period}
                    </p>
                  </button>
                </DisclosureTrigger>
                <DisclosureContent>
                  <div className="pt-4">{item.description}</div>
                </DisclosureContent>
              </Disclosure>
            ))}
          </div>
        </StaggerSection>

        <StaggerSection>
          <StaggerTitle name="Blog" />
        </StaggerSection>

        <StaggerSection>
          <StaggerTitle name="Connect" />
          <p className="mb-5 text-zinc-600 dark:text-zinc-400">
            Feel free to contact me at{' '}
            <a
              className="underline dark:text-zinc-300"
              href="mailto:wcgo2ling@gmail.com"
            >
              wcgo2ling@gmail.com
            </a>
          </p>
        </StaggerSection>
      </Stagger>

      <footer className="mt-24 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-xs text-zinc-500">© 2025 Dongwook Kim</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>
    </>
  )
}
