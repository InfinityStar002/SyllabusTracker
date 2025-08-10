import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * Props:
 *  - tree: object root node
 *  - onChange: fn(nextTree | updater)
 *  - selectedId: id
 *  - onSelect: fn(id)
 */

export default function SyllabusEditor({ tree, onChange, selectedId, onSelect }) {
  if (!tree) return null;

  function addNode(parentId) {
    onChange((prev) => {
      const deep = structuredClone(prev);
      const node = { id: uuidv4(), title: "New Node", done: false, children: [] };
      const p = findById(deep, parentId);
      if (p) p.children.push(node);
      return deep;
    });
  }

  function removeNode(nodeId) {
    if (nodeId === tree.id) return alert("Cannot remove root node");
    onChange((prev) => {
      const deep = structuredClone(prev);
      removeById(deep, nodeId);
      return deep;
    });
  }

  function toggleComplete(nodeId) {
    onChange((prev) => {
      const deep = structuredClone(prev);
      const n = findById(deep, nodeId);
      if (n) n.done = !n.done;
      return deep;
    });
  }

  function updateTitle(nodeId, title) {
    onChange((prev) => {
      const deep = structuredClone(prev);
      const n = findById(deep, nodeId);
      if (n) n.title = title;
      return deep;
    });
  }

  return (
    <div className="bg-white/60 p-3 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Syllabus</h2>
        <div className="text-sm text-gray-600">Nested items allowed</div>
      </div>

      <div className="space-y-2">
        <TreeNode
          node={tree}
          depth={0}
          onAdd={addNode}
          onRemove={removeNode}
          onToggle={toggleComplete}
          onUpdate={updateTitle}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

/* Recursive Tree Node component */
function TreeNode({ node, depth, onAdd, onRemove, onToggle, onUpdate, selectedId, onSelect }) {
  const [editing, setEditing] = useState(false);

  return (
    <div
      className={`node-box p-2 ${selectedId === node.id ? "ring-mu-primary" : ""}`}
      style={{ marginLeft: depth * 8 }}
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={!!node.done}
          onChange={() => onToggle(node.id)}
          className="mt-1"
        />
        <div className="flex-1">
          {editing ? (
            <input
              defaultValue={node.title}
              onBlur={(e) => {
                onUpdate(node.id, e.target.value || "Untitled");
                setEditing(false);
              }}
              autoFocus
              className="w-full rounded px-2 py-1 border"
            />
          ) : (
            <div onClick={() => onSelect(node.id)} className="cursor-pointer">
              <div className="font-medium">{node.title}</div>
              <div className="text-xs text-gray-500">{(node.children?.length || 0) + " subitems"}</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-xs" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className="px-2 py-1 text-xs" onClick={() => onAdd(node.id)}>
            Add
          </button>
          {node.id !== "root" && (
            <button className="px-2 py-1 text-xs text-red-600" onClick={() => onRemove(node.id)}>
              Del
            </button>
          )}
        </div>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {node.children.map((c) => (
            <TreeNode
              key={c.id}
              node={c}
              depth={depth + 1}
              onAdd={onAdd}
              onRemove={onRemove}
              onToggle={onToggle}
              onUpdate={onUpdate}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* helpers */
function findById(tree, id) {
  if (!tree) return null;
  if (tree.id === id) return tree;
  if (!tree.children) return null;
  for (const c of tree.children) {
    const r = findById(c, id);
    if (r) return r;
  }
  return null;
}

function removeById(tree, id) {
  if (!tree.children) return false;
  const idx = tree.children.findIndex((c) => c.id === id);
  if (idx >= 0) {
    tree.children.splice(idx, 1);
    return true;
  }
  for (const c of tree.children) {
    const done = removeById(c, id);
    if (done) return true;
  }
  return false;
}
