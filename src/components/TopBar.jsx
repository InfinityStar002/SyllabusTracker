import React from "react";

export default function TopBar({ title = "Syllabus Tracker" }) {
  return (
    <header className="topbar flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-mu-primary flex items-center justify-center text-white font-bold">
          ST
        </div>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 py-2 rounded text-sm">Profile</button>
      </div>
    </header>
  );
}

