"use client";

import SekkiGuidePanel from "@/components/SekkiGuidePanel";
import GoogleCalendarSync from "@/components/GoogleCalendarSync";

export default function GuideSyncPanel({ isAuthed }: { isAuthed: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "720px" }}>
      <SekkiGuidePanel />
      <GoogleCalendarSync isAuthed={isAuthed} />
    </div>
  );
}
