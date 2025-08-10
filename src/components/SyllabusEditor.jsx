import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function SyllabusEditor({ tree, onChange, selectedId, onSelect }) {
  // recursive helpers
  function addNode(parentId) {
    onChange((prev) => {
      const deep = structuredClone(prev)
      const node = { id: uuidv4(), title: 'New Node', children: [] }
      const p = findById(deep, parentId)
      if (p) p.children.push(node)
      return deep
    })
  }

  function removeNode(nodeId) {
    if (nodeId === tree.id) return alert('Cannot remove root')
    onChange((prev) => {
      const deep = structuredClone(prev)
      removeById(deep, nodeId)
      return deep
    })
  }

  function updateTitle(nodeId, title) {
    onChange((prev) => {
      const deep = structuredClone(prev)
      const n = findById(deep, nodeId)
      if (n) n.title = title
      return deep
    })
  }

  function toggleComplete(nodeId) {
    onChange((prev) => {
      const deep = structuredClone(prev)
      const n = findById(deep, nodeId)
      if (n) n.done = !n.done
      return deep
    })
  }

  return (
    <div className="p-3 bg-white/60 rounded-lg shadow-sm">
      <h2 className="font-semibold mb-2">Syllabus</h2>
      <div className="space-y-2">
        <TreeNode node={tree} depth={0} onAdd={addNode} onRemove={removeNode} onUpdate={updateTitle} onToggle={toggleComplete} selectedId={selectedId} onSelect={onSelect} />
      </div>
    </div>
  )
}

function TreeNode({ node, depth, onAdd, onRemove, onUpdate, onToggle, selectedId, onSelect }) {
  const [editing, setEditing] = useState(false)
  return (
    <div className={`node-box p-2 ${selectedId === node.id ? 'ring-2 ring-mu-primary' : ''}`} style={{ marginLeft: depth * 10 }}>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={!!node.done} onChange={() => onToggle(node.id)} />
        {editing ? (
          <input className="flex-1" defaultValue={node.title} onBlur={(e) => { onUpdate(node.id, e.target.value); setEditing(false) }} autoFocus />
        ) : (
          <div className="flex-1" onClick={() => onSelect(node.id)}>
            <div className="font-medium">{node.title}</div>
            <div className="text-xs text-gray-500">{node.children?.length || 0} subitems</div>
          </div>
        )}

        <div className="flex gap-1">
          <button className="px-2 py-1 text-xs" onClick={() => { setEditing(true) }}>Edit</button>
          <button className="px-2 py-1 text-xs" onClick={() => onAdd(node.id)}>Add</button>
          {node.id !== 'root' && <button className="px-2 py-1 text-xs" onClick={() => onRemove(node.id)}>Del</button>}
        </div>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {node.children.map((c) => (
            <TreeNode key={c.id} node={c} depth={depth + 1} onAdd={onAdd} onRemove={onRemove} onUpdate={onUpdate} onToggle={onToggle} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

// helper functions
function findById(tree, id) {
  if (!tree) return null
  if (tree.id === id) return tree
  if (!tree.children) return null
  for (const c of tree.children) {
    const r = findById(c, id)
    if (r) return r
  }
  return null
}

function removeById(tree, id) {
  if (!tree.children) return false
  const idx = tree.children.findIndex((c) => c.id === id)
  if (idx >= 0) {
    tree.children.splice(idx, 1)
    return true
  }
  for (const c of tree.children) {
    const done = removeById(c, id)
    if (done) return true
  }
  return false
}
