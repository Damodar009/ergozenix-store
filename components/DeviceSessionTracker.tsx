"use client";

import { useEffect } from "react";
import { initDeviceSession } from "@/lib/deviceSession";

/**
 * It does not render any UI – it simply runs the async init in a fire‑and‑forget
 * manner so that page rendering is not blocked.
 */
export default function DeviceSessionTracker() {
  useEffect(() => {
    // Run without awaiting – fire‑and‑forget, errors are logged inside the util.
    initDeviceSession();
  }, []);

  return null;
}
