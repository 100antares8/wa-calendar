"use client";

import GoogleCalendarSync from "@/components/GoogleCalendarSync";
import SekkiGuidePanel from "@/components/SekkiGuidePanel";

export default function GuideSyncPanel({ isAuthed }: { isAuthed: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "720px" }}>
      <GoogleCalendarSync isAuthed={isAuthed} />
      <SekkiGuidePanel />
    </div>
  );
}
