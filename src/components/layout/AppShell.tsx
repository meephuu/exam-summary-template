import { useRef, useState, type ReactNode } from 'react'
import { chapterLabel, type Chapter } from '../../chapters/registry'
import { useAutoHideScrollbar, type Heading } from '../../lib/hooks'
import { ChapterMenu } from './ChapterMenu'
import { floatingPanel, site } from '../../site.config'
import { FloatingPanel } from '../panel/FloatingPanel'
import { ReadingProgress } from './ReadingProgress'
import { TableOfContents } from './TableOfContents'
import styles from './AppShell.module.css'

interface Props {
  chapter: Chapter
  headings: Heading[]
  children: ReactNode
}

/** Page layout: sidebar (chapter menu + TOC) on desktop, top bar with a drawer on mobile. */
export function AppShell({ chapter, headings, children }: Props) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const sidebarRef = useRef<HTMLElement>(null)
  useAutoHideScrollbar(sidebarRef)
  useAutoHideScrollbar('document')

  const sidebar = (
    <>
      <div className={styles.brandRow}>
        <div className={styles.brand}>{site.title}</div>
        <div className={styles.course}>{site.course}</div>
      </div>
      <ChapterMenu currentId={chapter.id} onPick={close} />
      <TableOfContents headings={headings} onPick={close} />
    </>
  )

  return (
    <>
      <ReadingProgress />
      <div className={styles.topbar} data-topbar>
        <button className={styles.menuButton} onClick={() => setOpen(true)} aria-label="เปิดเมนู">
          ☰
        </button>
        <span className={styles.topTitle}>
          {chapter.group === 'extra' ? chapter.subtitle : `${chapterLabel(chapter)} · ${chapter.subtitle}`}
        </span>
      </div>
      {open && <div className={styles.scrim} onClick={close} />}
      <div className={styles.layout}>
        <aside ref={sidebarRef} className={`${styles.sidebar} ${open ? styles.open : ''}`}>{sidebar}</aside>
        <main className={styles.main}>{children}</main>
      </div>
      {floatingPanel && <FloatingPanel {...floatingPanel} />}
    </>
  )
}
