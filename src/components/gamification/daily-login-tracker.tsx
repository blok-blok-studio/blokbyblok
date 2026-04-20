"use client";

import { useEffect } from "react";

export function DailyLoginTracker() {
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const key = `blokschool_daily_login_${today}`;

    if (sessionStorage.getItem(key)) return;

    fetch("/api/gamification/daily-login", { method: "POST" })
      .then(() => {
        sessionStorage.setItem(key, "1");
      })
      .catch(() => {});
  }, []);

  return null;
}
