import React, { useMemo } from 'react'

export default function ProgressPanel({ tree, onChange }) {
  // compute aggregated progress (done nodes / total nodes)
  const { done, total } = useMemo(() => count(tree), [tree])
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="p-3 bg-white/60 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-2">Progress</h3>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div style={{ width: `${percent}%`, height: '100%' }} className="bg-mu-primary" />
      </div>
      <div className="flex justify-between text-sm mt-2">
        <div>{done} done</div>
        <div>{total} total</div>
      </div>
      <div className="mt-2 text-xs text-gray-600">Completion: {percent}%</div>
    </div>
  )
}

function count(node) {
  if (!node) return { done: 0, total: 0 }
  let done = node.done ? 1 : 0
  let total = 1
  if (node.children) {
    for (const c of node.children) {
      const r = count(c)
      done += r.done
      total += r.total
    }
  }
  return { done, total }
}
