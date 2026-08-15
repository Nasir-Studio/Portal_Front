import raw from './stations.json'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export const ALL = raw.map((s) => ({ ...s, img: base + s.img }))

export const LINES = [
  { key: 'bannan', name: '板南線', code: 'BL', color: '#0071C5', ink: false },
  { key: 'wenhu', name: '文湖線', code: 'BR', color: '#C48C46', ink: true },
  { key: 'dsxy', name: '淡水信義線', code: 'R', color: '#E3002C', ink: false },
  { key: 'zhxl', name: '中和新蘆線', code: 'O', color: '#F8B61C', ink: true },
  { key: 'ssxd', name: '松山新店線', code: 'G', color: '#00833D', ink: false },
  { key: 'circular', name: '環狀線', code: 'Y', color: '#F3C904', ink: true },
  { key: 'sanying', name: '三鶯線', code: 'LB', color: '#00B4CE', ink: true },
  { key: 'ankeng', name: '安坑輕軌', code: 'K', color: '#A18B43', ink: true },
  { key: 'danhai', name: '淡海輕軌', code: 'V', color: '#E14B2E', ink: false }
]

export const LINE_MAP = Object.fromEntries(LINES.map((l) => [l.key, l.name]))

export const LINE_BY_KEY = Object.fromEntries(LINES.map((l) => [l.key, l]))

export function lineColor(key) {
  return LINE_BY_KEY[key]?.color ?? '#8a857a'
}

export function lineCode(key) {
  return LINE_BY_KEY[key]?.code ?? '—'
}

export function lineText(key) {
  return LINE_BY_KEY[key]?.ink ? '#171512' : '#f4efe6'
}

export function stationsOf(line) {
  return ALL.filter((s) => s.line === line)
}

export function byId(id) {
  return ALL.find((s) => s.id === id)
}

const _groupsByName = (() => {
  const byName = new Map()
  for (const s of ALL) {
    const ids = byName.get(s.name) ?? []
    ids.push(s.id)
    byName.set(s.name, ids)
  }
  const member = {}
  const groups = []
  for (const [name, ids] of byName) {
    if (ids.length > 1) {
      groups.push({ name, ids })
      for (const id of ids) member[id] = ids
    }
  }
  return { member, groups }
})()

export const TRANSFER_GROUPS = _groupsByName.groups

export function transferSiblings(id) {
  const ids = _groupsByName.member[id]
  return ids ? ids.filter((x) => x !== id) : []
}
