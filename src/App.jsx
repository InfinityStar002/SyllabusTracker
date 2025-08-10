import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { loadData, saveData } from './utils/storage'
import useAutosave from './hooks/useAutosave'
import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'
import SyllabusEditor from './components/SyllabusEditor'
import ProgressPanel from './components/ProgressPanel'

const defaultSample = {
  id: 'root',
  title: 'My Syllabus',
  children: [
    {
      id: uuidv4(),
      title: 'Subject 1',
      children: [
        { id: uuidv4(), title: 'Chapter 1', children: [] },
        { id: uuidv4(), title: 'Chapter 2', children: [] }
      ]
    },
    { id: uuidv4(), title: 'Subject 2', children: [] }
  ]
}

export default function App() {
  const [tree, setTree] = useState(() => loadData() || defaultSample)
  const [selectedId, setSelectedId] = useState(tree.id)

  // autosave using hook
  useAutosave(tree)

  // sync selectedId when tree resets
  useEffect(() => {
    if (!tree) setTree(defaultSample)
  }, [])

  function updateTree(next) {
    setTree((prev) => {
      const updated = typeof next === 'function' ? next(prev) : next
      saveData(updated)
      return updated
    })
  }

  return (
    <div className="app-shell flex flex-col h-screen">
      <TopBar title="Syllabus Tracker" />
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SyllabusEditor tree={tree} onChange={updateTree} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <aside className="md:col-span-1">
            <ProgressPanel tree={tree} onChange={updateTree} />
            <div className="mt-4 p-3 bg-white/60 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Backup / Restore</h3>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded bg-mu-primary text-mu-on-primary" onClick={() => {
                  const blob = new Blob([JSON.stringify(tree, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'syllabus-backup.json'
                  a.click()
                  URL.revokeObjectURL(url)
                }}>Export JSON</button>
                <label className="px-3 py-2 rounded cursor-pointer border border-gray-300">
                  Import
                  <input type="file" accept="application/json" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      try {
                        const parsed = JSON.parse(ev.target.result)
                        onImport(parsed)
                      } catch (err) { alert('Invalid JSON') }
                    }
                    reader.readAsText(f)
                  }} />
                </label>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <BottomBar />
    </div>
  )

  function onImport(parsed) {
    if (parsed && parsed.id) {
      updateTree(parsed)
      alert('Imported successfully')
    } else {
      alert('Parsed content does not look like a saved syllabus')
    }
  }
}
