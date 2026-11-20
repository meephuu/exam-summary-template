import type { PanelTab } from './FloatingPanel'
import { Grid, Note } from './PanelParts'

/** The simplest possible panel tab: a fixed table + a note. Copy this to make your own
 *  (e.g. a formula sheet, unit conversions, a truth table) and list it in site.config.ts. */
export const EXAMPLE_TAB: PanelTab = {
  id: 'example',
  label: 'ตัวอย่างแท็บ',
  render: () => (
    <>
      <Note>
        แท็บนี้เป็นตัวอย่างแท็บแบบง่ายที่สุด (ไฟล์ <code>src/components/panel/exampleTab.tsx</code>) ใส่ตาราง/สูตรอะไรก็ได้ที่อยากเปิดดูระหว่างอ่าน
      </Note>
      <Grid
        corner="n"
        cols={['2ⁿ', 'n!', 'log₂(n)']}
        rows={[1, 2, 4, 8, 10, 16].map((n) => ({
          label: String(n),
          cells: [String(2 ** n), String(Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1)), Math.log2(n).toFixed(3)],
        }))}
      />
    </>
  ),
}
