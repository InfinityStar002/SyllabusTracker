import React from "react";

export default function BottomBar() {
  return (
    <footer className="bottombar flex items-center justify-between">
      <div className="text-sm">&copy; {new Date().getFullYear()} Syllabus Tracker</div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 rounded">Sync</button>
        <button className="px-3 py-2 rounded">Settings</button>
      </div>
    </footer>
  );
}
