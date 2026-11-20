import { useMemo, useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { fmt, normalPdf } from '../../lib/math'
import { cssVar, drawFrame, withAlpha } from '../../lib/plot'
import { POPULATIONS } from '../../lib/populations'
import { mulberry32, newSeed } from '../../lib/random'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

const REPS = 3000
const BINS = 40

/** Draw many samples of size n, histogram their means, compare with N(μ, σ²/n). */
export function CLTSimulator({ initial = 'exponential' }: { initial?: string }) {
  const [popId, setPopId] = useState(initial)
  const [n, setN] = useState(1)
  const [seed, setSeed] = useState(newSeed)
  const pop = POPULATIONS.find((x) => x.id === popId) ?? POPULATIONS[0]
  const se = pop.sd / Math.sqrt(n)

  const means = useMemo(() => {
    const rand = mulberry32(seed)
    const out = new Float64Array(REPS)
    for (let i = 0; i < REPS; i++) {
      let s = 0
      for (let j = 0; j < n; j++) s += pop.sample(rand)
      out[i] = s / n
    }
    return out
  }, [pop, n, seed])

  const obsMean = means.reduce((a, b) => a + b, 0) / REPS
  const obsSd = Math.sqrt(means.reduce((a, b) => a + (b - obsMean) ** 2, 0) / (REPS - 1))

  const ref = useCanvas((g, w, h) => {
    const lo = pop.mean - 4 * se
    const hi = pop.mean + 4 * se
    const width = (hi - lo) / BINS
    const counts = new Array(BINS).fill(0)
    for (const m of means) {
      const b = Math.floor((m - lo) / width)
      if (b >= 0 && b < BINS) counts[b]++
    }
    const dens = counts.map((c) => c / (REPS * width))
    const peak = 1 / (se * Math.sqrt(2 * Math.PI))
    const f = drawFrame(g, w, h, { xlo: lo, xhi: hi, ymax: Math.max(peak, ...dens) * 1.12 })

    g.fillStyle = withAlpha(cssVar('--accent'), 0.5)
    dens.forEach((d, i) => {
      const x0 = f.X(lo + i * width)
      const x1 = f.X(lo + (i + 1) * width)
      const y = f.Y(d)
      g.fillRect(x0 + 0.5, y, Math.max(1, x1 - x0 - 1), f.bottom - y)
    })

    g.beginPath()
    for (let i = 0; i <= 300; i++) {
      const x = lo + ((hi - lo) * i) / 300
      const y = f.Y(normalPdf(x, pop.mean, se))
      if (i) g.lineTo(f.X(x), y)
      else g.moveTo(f.X(x), y)
    }
    g.strokeStyle = cssVar('--warn')
    g.lineWidth = 2.2
    g.stroke()
  })

  return (
    <Widget
      title="ทฤษฎีบทลิมิตกลาง (CLT)"
      hint="เลือกประชากรหน้าตาแปลกๆ แล้วเลื่อน n: เครื่องจะสุ่มตัวอย่างขนาด n มา 3,000 ชุด หาค่าเฉลี่ยของแต่ละชุด แล้ววาดฮิสโตแกรมของค่าเฉลี่ยเหล่านั้น (แท่งสีน้ำเงิน) เทียบกับ N(μ, σ²/n) ที่ CLT ทำนาย (เส้นสีส้ม)"
    >
      <ButtonRow>
        <select aria-label="เลือกประชากร" value={popId} onChange={(e) => setPopId(e.target.value)}>
          {POPULATIONS.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        <button onClick={() => setSeed(newSeed())}>🎲 สุ่มใหม่</button>
      </ButtonRow>
      <Controls>
        <Slider label="n (ขนาดตัวอย่างต่อชุด)" value={n} min={1} max={100} step={1} onChange={setN} />
      </Controls>
      <PlotCanvas canvasRef={ref} label="ฮิสโตแกรมของค่าเฉลี่ยตัวอย่างเทียบกับเส้น Normal" />
      <Readout>
        ค่าเฉลี่ยของ X̄ = <b>{obsMean.toFixed(3)}</b> (ทฤษฎี μ = {fmt(pop.mean)}) &nbsp;·&nbsp; SD ของ X̄ ={' '}
        <b>{obsSd.toFixed(3)}</b> (ทฤษฎี σ/√n = {se.toFixed(3)})
        <br />
        <span className="small">{pop.note}</span>
      </Readout>
    </Widget>
  )
}
