"use client";

import GoogleCalendarSync from "@/components/GoogleCalendarSync";
import LearningGuidePanel from "@/components/LearningGuidePanel";

export default function GuideSyncPanel({ isAuthed }: { isAuthed: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "720px" }}>
      <GoogleCalendarSync isAuthed={isAuthed} />
      <LearningGuidePanel />
    </div>
  );
}
