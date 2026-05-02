"use client";
import { useEffect } from "react";

export default function SwRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let hourly: ReturnType<typeof setInterval> | undefined;

    navigator.serviceWorker
      .register("/sw.js")
      .then(reg => {
        reg.update();
        hourly = setInterval(() => void reg.update(), 60 * 60 * 1000);
      })
      .catch(() => {});

    const onFocus = () => {
      navigator.serviceWorker.getRegistration().then(r => r?.update());
    };
    window.addEventListener("focus", onFocus);

    return () => {
      if (hourly) clearInterval(hourly);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
  return null;
}
