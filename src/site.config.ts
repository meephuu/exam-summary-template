/**
 * ⚙️  SITE CONFIG – the one file to edit when starting a new subject.
 *
 *  1. `site`          name of the site / course shown in the sidebar and browser tab
 *  2. `theme`         colours (preset or your own) + light/dark mode
 *  3. `CHAPTERS`      the menu: chapters (0, 1, 2, …) and extra pages (C = cheat sheet, …)
 *  4. `floatingPanel` optional button at the bottom right that opens reference tables
 *
 * Chapter content lives in src/chapters/<folder>/content.mdx. See README.md for the full guide.
 */
import { lazy } from 'react'
import type { Chapter } from './chapters/registry'
import type { FloatingPanelConfig } from './components/panel/FloatingPanel'
import { EXAMPLE_TAB } from './components/panel/exampleTab'
import { STAT_TABLE_TABS } from './components/panel/statTables'
import type { ThemeConfig } from './styles/themes'

/* ───────────────────────── 1. site ───────────────────────── */

export const site = {
  /** big name at the top of the sidebar; also used in the browser tab */
  title: 'สรุปเนื้อหา (ชื่อวิชา)',
  /** optional: one short word shown big instead of `title` (e.g. 'NETWORK'); '' = show title */
  brand: 'SUMMARY' as string,
  /** optional: small uppercase line above the brand (e.g. 'Summary · Final'); '' = none */
  brandSub: 'Exam · Final' as string,
  /** small line under the title */
  course: 'XXXXXXX COURSE NAME · ไฟนอล',
  /** footer text after the source of each chapter */
  footer: 'XXXXXXX COURSE NAME',
  /** heading of the chapter list in the menu */
  lessonsHeading: 'บทเรียน',
  /** heading of the second menu group (pages with group: 'extra') */
  extrasHeading: 'ทบทวนก่อนสอบ',
  /** prefix for browser storage keys (reading position, last chapter, …).
   *  Use a different one per subject, so two sites on the same domain don't mix. */
  storagePrefix: 'exam-summary',
}

/* ───────────────────────── 2. theme ───────────────────────── */
/*
 * accent : 'indigo' | 'blue' | 'teal' | 'emerald' | 'rose' | 'orange' | 'violet' | 'pink' | 'slate'
 *          or your own pair: { light: '#0b7a75', dark: '#6ad6cf' }
 * base   : 'warm' (cream paper) | 'cool' (blue-grey) | 'neutral' (plain grey)
 * mode   : 'auto' (follow the reader's OS) | 'light' | 'dark'
 * note   : <Def> boxes use the accent colour and <Example> is green, so with 'emerald' / 'teal'
 *          also override '--ex' (and '--ex-soft') so the two boxes stay different
 * overrides: change any single colour, e.g. { light: { '--warn': '#d00000' }, dark: { '--bg': '#000000' } }
 * Colour names: --bg --surface --surface-2 --text --muted --border --accent --accent-soft
 *               --def(-soft) --ex(-soft) --warn(-soft) --tip(-soft)   (all hex)
 */
export const theme: ThemeConfig = {
  accent: 'indigo',
  base: 'warm',
  mode: 'auto',
}

/* ───────────────────────── 3. chapters / menu ───────────────────────── */
/*
 * id      → URL (#/<id>), letters/numbers/dashes only
 * no      → badge in the menu: a number for chapters, a letter for extra pages ('C')
 * group   → 'extra' puts the page in the second menu group (default: lessons)
 * source  → shown as "สรุปจาก <source>" under the title (slide file name, textbook chapter, …)
 * accent  → optional hex colour for this chapter only (headings, widgets, menu badge). With mode 'auto'
 *           pick a mid tone that reads on both light and dark backgrounds. Leave out = theme accent
 * Content → leave it out and the page shows as "เร็วๆ นี้" (coming soon)
 */
export const CHAPTERS: Chapter[] = [
  {
    id: 'getting-started',
    no: 0,
    title: 'Getting Started',
    subtitle: 'วิธีใช้ template',
    source: 'README.md',
    blurb: 'โครงสร้างไฟล์, เขียนบทใหม่, กล่องเนื้อหา, สูตร, ตาราง',
    Content: lazy(() => import('./chapters/00-getting-started/content.mdx')),
  },
  {
    id: 'widgets',
    no: 1,
    title: 'Interactive Widgets',
    subtitle: 'Widget ตัวอย่าง',
    source: 'src/components/interactive',
    blurb: 'NormalArea, CLTSimulator, ExampleWidget และวิธีสร้าง widget ใหม่',
    accent: '#d9822b', // example of a per-chapter colour
    Content: lazy(() => import('./chapters/01-widgets/content.mdx')),
  },
  {
    id: 'next-chapter',
    no: 2,
    title: 'Next Chapter',
    subtitle: 'บทที่ยังไม่ได้เขียน',
    source: '-',
    blurb: 'ตัวอย่างบทที่ยังไม่มี Content (แสดงเป็น "เร็วๆ นี้" ในเมนู)',
  },
  {
    id: 'cheat-sheet',
    no: 'C',
    group: 'extra',
    title: 'Cheat Sheet',
    subtitle: 'Cheat Sheet',
    source: 'ทุกบท',
    blurb: 'สูตรและทิปสำคัญจากทุกบท สำหรับจดโน้ตเข้าห้องสอบ',
    Content: lazy(() => import('./chapters/cheat-sheet/content.mdx')),
  },
  {
    id: 'quiz',
    no: 'Q',
    group: 'extra',
    title: 'Practice Quiz',
    subtitle: 'Quiz',
    source: 'src/chapters/quiz/questions.json',
    blurb: 'ข้อสอบตัวเลือก ทำในเว็บ รู้ผลทันที จำคะแนนไว้ในเบราว์เซอร์',
    Content: lazy(() => import('./chapters/quiz/content.mdx')),
  },
]

/* ───────────────────────── 4. floating panel ───────────────────────── */
/*
 * Set to null to hide the button. `tabs` can be STAT_TABLE_TABS (z / t / χ² tables),
 * EXAMPLE_TAB (copy it to make your own), or any mix of them.
 */
export const floatingPanel: FloatingPanelConfig | null = {
  title: 'ตารางอ้างอิง',
  buttonLabel: 'ตาราง z / t / χ²',
  tabs: [...STAT_TABLE_TABS, EXAMPLE_TAB],
}
