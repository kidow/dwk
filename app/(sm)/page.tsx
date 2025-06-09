'use client'

import { Header } from '@/components/header'
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger
} from '@/components/ui/disclosure'
import { Stagger, StaggerSection, StaggerTitle } from '@/components/ui/stagger'
import { CAREERS } from '@/data/careers'
import { motion } from 'motion/react'
import Link from 'next/link'

export default async function Page(): Promise<React.ReactElement> {
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

      <footer className="mt-24 py-4 border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-xs text-zinc-500">© 2025 Dongwook Kim</span>
      </footer>
    </>
  )
}
