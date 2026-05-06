import { getCalendarJumpForEvent } from "@/lib/traditional-events-catalog";

export const CAL_NAV_EVENT = "wa-calendar-nav";
export const TAB_SYNC_EVENT = "wa-tab-sync";

const HIGHLIGHT_CAL = "wa-cal-highlight";

export type CalHighlight = { y: number; m: number; eventId: string };

export function readCalHighlight(): CalHighlight | null {
  if (typeof window === "undefined") return null;
  try {
    const r = sessionStorage.getItem(HIGHLIGHT_CAL);
    if (!r) return null;
    return JSON.parse(r) as CalHighlight;
  } catch {
    return null;
  }
}

export function clearCalHighlight(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(HIGHLIGHT_CAL);
}

/** 行事をタップしたとき：暦タブへ切り替え・該当年月を開き、ハイライト対象を保存 */
export function goToCalendarForEvent(eventId: string, currentY: number): void {
  if (typeof window === "undefined") return;
  const { y, m } = getCalendarJumpForEvent(eventId, currentY);
  sessionStorage.setItem(HIGHLIGHT_CAL, JSON.stringify({ y, m, eventId }));
  window.dispatchEvent(new CustomEvent(CAL_NAV_EVENT));
}

/** 旧暦年グリッドの色付きマスから：節気・同期の行事ラインナップへ */
export function goToGuideTradEvents(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("tab", "guide-sync");
  url.hash = "trad-events";
  window.history.pushState({}, "", url.toString());
  window.dispatchEvent(new CustomEvent(TAB_SYNC_EVENT));
}
