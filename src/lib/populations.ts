/** Population distributions to draw samples from in the LLN / CLT simulations. */
export interface Population {
  id: string
  name: string
  mean: number
  sd: number
  sample: (rand: () => number) => number
  note: string
}

export const POPULATIONS: Population[] = [
  {
    id: 'exponential',
    name: 'Exponential(1) – เบ้ขวามาก',
    mean: 1,
    sd: 1,
    sample: (r) => -Math.log(1 - r()),
    note: 'ประชากรเบ้ขวามาก ต้องใช้ n ค่อนข้างใหญ่กว่าจะเป็นรูประฆัง',
  },
  {
    id: 'uniform',
    name: 'Uniform(0, 1) – แบนราบ',
    mean: 0.5,
    sd: Math.sqrt(1 / 12),
    sample: (r) => r(),
    note: 'ประชากรแบนราบและสมมาตร n แค่ประมาณ 5 ก็เริ่มเป็นรูประฆังแล้ว',
  },
  {
    id: 'dice',
    name: 'ลูกเต๋า 1–6',
    mean: 3.5,
    sd: Math.sqrt(35 / 12),
    sample: (r) => 1 + Math.floor(r() * 6),
    note: 'ประชากรไม่ต่อเนื่อง แต่ค่าเฉลี่ยก็ยังเข้าใกล้ Normal (ซึ่งเป็นแบบต่อเนื่อง)',
  },
  {
    id: 'bernoulli',
    name: 'Bernoulli(0.2) – ใช่/ไม่ใช่',
    mean: 0.2,
    sd: 0.4,
    sample: (r) => (r() < 0.2 ? 1 : 0),
    note: 'ค่าเฉลี่ยคือ “สัดส่วน” เหมือนผลโพล ใช้ CLT กับสัดส่วนได้เช่นกัน',
  },
  {
    id: 'arcsine',
    name: 'รูปตัว U – สองยอดหัวท้าย',
    mean: 0.5,
    sd: Math.sqrt(1 / 8),
    sample: (r) => Math.sin((Math.PI * r()) / 2) ** 2,
    note: 'ประชากรหน้าตาไม่เหมือน Normal เลย แต่ค่าเฉลี่ยก็ยังกลายเป็นรูประฆัง',
  },
]
