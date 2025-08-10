import React, { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import BottomBar from "./components/BottomBar";
import SyllabusEditor from "./components/SyllabusEditor";
import ProgressPanel from "./components/ProgressPanel";
import { loadData, saveData } from "./utils/storage";
import useAutosave from "./hooks/useAutosave";
import registerServiceWorker from "./registerServiceWorker";

const SAMPLE = {
  id: "root",
  title: "My Syllabus",
  done: false,
  children: [
    {
      id: "subj-1",
      title: "Subject 1",
      done: false,
      children: [
        { id: "ch-1", title: "Chapter 1", done: false, children: [] },
        { id: "ch-2", title: "Chapter 2", done: false, children: [] },
      ],
    },
  ],
};

export default function App() {
  const [tree, setTree] = useState(() => loadData() || SAMPLE);
  const [selectedId, setSelectedId] = useState(tree?.id || "root");

  // autosave to localStorage
  useAutosave(tree);

  useEffect(() => {
    // attempt service worker registration (silent)
    try {
      registerServiceWorker();
    } catch (e) {}
  }, []);

  function updateTree(next) {
    setTree((prev) => {
      const updated = typeof next === "function" ? next(prev) : next;
      saveData(updated);
      return updated;
    });
  }

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <TopBar title="Syllabus Tracker" />
      <main className="flex-1 p-4 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="md:col-span-2">
            <SyllabusEditor
              tree={tree}
              onChange={updateTree}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </section>

          <aside className="md:col-span-1 space-y-4">
            <ProgressPanel tree={tree} />
            <div className="bg-white/60 p-3 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Backup & Restore</h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded bg-mu-primary text-mu-on-primary"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(tree, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "syllabus-backup.json";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export JSON
                </button>

                <label className="px-3 py-2 rounded border cursor-pointer">
                  Import
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          const parsed = JSON.parse(ev.target.result);
                          if (parsed && parsed.id) {
                            updateTree(parsed);
                            alert("Import successful");
                          } else {
                            alert("Invalid syllabus JSON");
                          }
                        } catch {
                          alert("Invalid JSON file");
                        }
                      };
                      reader.readAsText(f);
                    }}
                  />
                </label>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Autosaves to localStorage. Use Export to create a backup file.
              </div>
            </div>
          </aside>
        </div>
      </main>
      <BottomBar />
    </div>
  );
}

