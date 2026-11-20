import { useState } from 'react'
import { useCanvas } from '../../lib/hooks'
import { fmt, normalCdf, normalPdf } from '../../lib/math'
import { cssVar, drawFrame, drawMarker, withAlpha } from '../../lib/plot'
import { Slider } from './Slider'
import { ButtonRow, Controls, PlotCanvas, Readout, Widget } from './Widget'

const LO = -12
const HI = 12

/** Shade P(a ≤ X ≤ b) under N(μ, σ²) and show how it comes from z-scores. */
export function NormalArea() {
  const [mu, setMu] = useState(0)
  const [sd, setSd] = useState(1)
  const [a, setA] = useState(-1)
  const [b, setB] = useState(1)

  const [lo, hi] = a <= b ? [a, b] : [b, a]
  const za = (lo - mu) / sd
  const zb = (hi - mu) / sd
  const pa = normalCdf(za)
  const pb = normalCdf(zb)
  const p = pb - pa

  const ref = useCanvas((g, w, h) => {
    const acc = cssVar('--accent')
    const f = drawFrame(g, w, h, { xlo: LO, xhi: HI, ymax: 0.85 })
    const N = 600
    g.beginPath()
    g.moveTo(f.X(lo), f.bottom)
    for (let i = 0; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N
      g.lineTo(f.X(x), f.Y(normalPdf(x, mu, sd)))
    }
    g.lineTo(f.X(hi), f.bottom)
    g.closePath()
    g.fillStyle = withAlpha(acc, 0.35)
    g.fill()
    g.beginPath()
    for (let i = 0; i <= N; i++) {
      const x = LO + ((HI - LO) * i) / N
      const y = f.Y(normalPdf(x, mu, sd))
      if (i) g.lineTo(f.X(x), y)
      else g.moveTo(f.X(x), y)
    }
    g.strokeStyle = acc
    g.lineWidth = 2.2
    g.stroke()
    drawMarker(g, f, mu, 'μ')
  })

  const preset = (k: number) => {
    setA(+(mu - k * sd).toFixed(1))
    setB(+(mu + k * sd).toFixed(1))
  }

  return (
    <Widget
      title="พื้นที่ใต้กราฟ Normal"
      hint="เลื่อน μ, σ และช่วง [a, b] แล้วดูว่าพื้นที่ (= ความน่าจะเป็น) คำนวณจากค่า z อย่างไร ลองกด ±1σ, ±2σ, ±3σ เพื่อเห็นกฎ 68–95–99.7 (เปลี่ยน μ, σ แล้วผลไม่เปลี่ยน)"
    >
      <Controls>
        <Slider label="μ (ค่าเฉลี่ย)" value={mu} min={-3} max={3} step={0.1} onChange={setMu} />
        <Slider label="σ (SD)" value={sd} min={0.5} max={2.5} step={0.1} onChange={setSd} />
        <Slider label="a (ขอบซ้าย)" value={a} min={LO} max={HI} step={0.1} onChange={setA} />
        <Slider label="b (ขอบขวา)" value={b} min={LO} max={HI} step={0.1} onChange={setB} />
      </Controls>
      <ButtonRow>
        <button onClick={() => preset(1)}>μ ± 1σ</button>
        <button onClick={() => preset(2)}>μ ± 2σ</button>
        <button onClick={() => preset(3)}>μ ± 3σ</button>
        <button
          onClick={() => {
            setA(LO)
            setB(mu)
          }}
        >
          ครึ่งซ้าย (X ≤ μ)
        </button>
        <button
          onClick={() => {
            setA(+(mu + 1.645 * sd).toFixed(1))
            setB(HI)
          }}
        >
          หางขวา X ≥ μ + 1.645σ
        </button>
      </ButtonRow>
      <PlotCanvas canvasRef={ref} label="กราฟ Normal พร้อมพื้นที่ที่แรเงา" />
      <Readout>
        z<sub>a</sub> = (a − μ)/σ = <b>{lo <= LO ? '−∞' : fmt(za)}</b> &nbsp;·&nbsp; z<sub>b</sub> = (b − μ)/σ ={' '}
        <b>{hi >= HI ? '∞' : fmt(zb)}</b>
        <br />
        P(a ≤ X ≤ b) = Φ(z<sub>b</sub>) − Φ(z<sub>a</sub>) = {pb.toFixed(4)} − {pa.toFixed(4)} ={' '}
        <b>{p.toFixed(4)}</b> ({(p * 100).toFixed(1)}%)
      </Readout>
    </Widget>
  )
}
