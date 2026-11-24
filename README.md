# exam-summary-template

Template สำหรับทำ**เว็บสรุปเนื้อหาก่อนสอบ** (React + Vite + MDX + KaTeX) แยกมาจากเว็บสรุปสถิติ CEM II
เขียนเนื้อหาเป็น Markdown ได้ มีกล่องนิยาม/ตัวอย่าง/ทิป, สูตรคณิต, widget ให้เลื่อนเล่น, แผงตารางลอย และธีมสีที่เปลี่ยนได้
มีช่องค้นหาในหน้า, พับเมนูได้, สีประจำบท, รูปจากสไลด์ และหน้าควิซ (รายการเต็ม: [`FEATURES.md`](FEATURES.md))
build ออกมาเป็น **HTML ไฟล์เดียว** ส่งต่อหรือเปิดแบบ offline ได้ และ deploy ขึ้น GitHub Pages อัตโนมัติ

## เริ่มวิชาใหม่

### 1. สร้าง repo จาก template

- **บน GitHub:** กด **Use this template → Create a new repository** แล้ว clone repo ใหม่ลงเครื่อง
- **หรือในเครื่อง:** ก๊อปโฟลเดอร์นี้ไปเป็นชื่อใหม่ (ไม่ต้องก๊อป `node_modules`, `dist`, `.git`) แล้ว `git init`

```bash
npm install
npm run dev        # เปิด http://localhost:5173 ดูผลสดระหว่างเขียน
```

### 2. แก้ `src/site.config.ts` (ไฟล์เดียวจบ)

| ส่วน | ใช้ทำอะไร |
|---|---|
| `site` | ชื่อเว็บ, ชื่อวิชา, ข้อความ footer, หัวข้อเมนู, `storagePrefix` (**เปลี่ยนทุกวิชา** ไม่งั้นตำแหน่งที่อ่านจะปนกันถ้าอยู่โดเมนเดียวกัน) |
| `theme` | สีหลัก, พื้นหลัง, โหมดสว่าง/มืด (ดูหัวข้อธีมสีด้านล่าง) |
| `CHAPTERS` | รายชื่อบทในเมนู (บทปกติมีเลข, หน้าเสริมเช่น Cheat Sheet ใช้ตัวอักษร `C` และ `group: 'extra'`) |
| `floatingPanel` | ปุ่มมุมขวาล่างที่เปิดแผงตาราง ใส่ `null` ถ้าไม่ใช้ |

ตั้งชื่อในแท็บเบราว์เซอร์ตอนโหลดได้ที่ `<title>` ใน `index.html` ด้วย

### 3. เขียนเนื้อหา

1. ลบบทตัวอย่าง `src/chapters/00-getting-started` และ `01-widgets` (อ่านก่อนลบ เป็นคู่มือในตัว)
2. สร้าง `src/chapters/01-intro/content.mdx`
3. เพิ่มในรายการ `CHAPTERS`:
   ```ts
   {
     id: 'intro', no: 1, title: 'Introduction', subtitle: 'Intro',
     source: 'Lecture01.pdf', blurb: 'เรื่องที่บทนี้ครอบคลุม',
     Content: lazy(() => import('./chapters/01-intro/content.mdx')),
   },
   ```
   ถ้ายังไม่ใส่ `Content` บทจะขึ้นในเมนูเป็น "เร็วๆ นี้"

วิธีใช้กล่องและ component ทั้งหมดอยู่ที่ [`docs/components.md`](docs/components.md)

### 4. Deploy ขึ้น GitHub Pages

มี `.github/workflows/deploy.yml` แล้ว ตั้งค่าบน GitHub ครั้งเดียว: **Settings → Pages → Source: GitHub Actions**
หลังจากนั้น push `main` ทีไรเว็บจะอัปเดตเอง (repo private ใช้ Pages ได้เมื่อมี GitHub Pro / Student Pack)

## ธีมสี

ใน `src/site.config.ts`:

```ts
export const theme: ThemeConfig = {
  accent: 'indigo',   // indigo | blue | teal | emerald | rose | orange | violet | pink | slate
  base: 'warm',       // warm (กระดาษครีม) | cool (เทาฟ้า) | neutral (เทาล้วน)
  mode: 'auto',       // auto (ตามเครื่องคนอ่าน) | light | dark
}
```

- **สีเอง:** `accent: { light: '#0b7a75', dark: '#6ad6cf' }` (สีจางสำหรับพื้นหลังไฮไลต์คำนวณให้อัตโนมัติ)
- **แก้สีทีละตัว:** `overrides: { light: { '--warn': '#d00000' }, dark: { '--bg': '#000000' } }`
- ชื่อสีทั้งหมด: `--bg --surface --surface-2 --text --muted --border --accent --accent-soft --def(-soft) --ex(-soft) --warn(-soft) --tip(-soft)` ต้องเป็น hex
- กล่อง `<Def>` ใช้สี accent ส่วน `<Example>` เป็นสีเขียว ถ้าเลือก accent `emerald`/`teal` แนะนำให้ override `--ex` เป็นสีอื่น
- เพิ่ม preset ใหม่ได้ที่ `ACCENTS` / `BASES` ใน `src/styles/themes.ts`
- favicon สร้างจากสี accent ให้อัตโนมัติ

## คำสั่ง

```bash
npm run dev         # dev server
npm run build       # สร้าง dist/index.html (ไฟล์เดียว เปิดจากดิสก์ได้)
npm run preview     # เปิดดูผล build
npm run typecheck   # ตรวจ TypeScript
```

## โครงสร้าง

```
src/site.config.ts              ⚙️ ตั้งค่าทั้งหมด (ชื่อ, ธีม, บท, แผงตาราง)
src/chapters/<folder>/content.mdx   เนื้อหาแต่ละบท
src/chapters/registry.ts        type ของบท + helper (ปกติไม่ต้องแก้)
src/components/content/         Callout (Def/Example/Warn/Tip), Solution, Compare, Figure, mdxComponents.ts ← ลงทะเบียน component ให้ MDX
src/components/interactive/     Widget, Slider, ExampleWidget (ตัวเริ่มต้น), NormalArea, CLTSimulator
src/components/quiz/            Quiz (QuizOverview, QuizSet) – โจทย์ใน src/chapters/quiz/questions.json
src/assets/slides/, assets/quiz/ รูปสำหรับ <Figure> และรูปในโจทย์ควิซ
src/components/panel/           FloatingPanel + PanelParts (Grid/Note/Calc/NumInput/Toggle), statTables (z/t/χ²), exampleTab
src/components/layout/          AppShell, PageSearch, ChapterMenu, TableOfContents, ChapterHeader, ReadingPosition, ReadingProgress
src/lib/                        math, plot (drawFrame/cssVar/withAlpha), hooks (useCanvas, hash routing), random, populations, readingPosition
src/styles/themes.ts            preset สีและตัวสร้างธีม
src/styles/                     theme.css (ฟอนต์/ขนาด), global, prose, fonts (Google Sans ไทย/อังกฤษ/กรีก แบบฝังในไฟล์)
CLAUDE.md                       คำอธิบายโปรเจกต์ให้ Claude (กรอกช่อง TODO ตอนเริ่มวิชาใหม่)
HANDOFF.md                      สถานะงานล่าสุด ใช้ส่งต่องานข้ามเซสชัน
```

routing เป็น hash (`#/chapter-id`) จึงเปิด `dist/index.html` จากดิสก์ได้โดยไม่ต้องมี server
