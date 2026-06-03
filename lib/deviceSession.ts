// lib/deviceSession.ts
import { supabase } from '@/services/supabase';
import { getCookie, setCookie, retrieveId, storeId } from '@/lib/cookieUtils';
import { collectFingerprint, detectDeviceType, detectOS, detectBrowser, fingerprintHash } from '@/lib/deviceFingerprint';

// Constants for cookie names and max-age (2 years in seconds)
const DEVICE_ID_COOKIE = 'device_id';
const SESSION_ID_COOKIE = 'session_id';
const MAX_AGE = 60 * 60 * 24 * 365 * 2; // 2 years

/**
 * Initialise or restore device and session identifiers, then upsert the session
 * record and record a visit. This runs on the client and does not block rendering.
 */
export async function initDeviceSession(): Promise<void> {
  try {
    // 1️⃣ Retrieve IDs from cookies, fallback to localStorage.
    let deviceId = retrieveId(DEVICE_ID_COOKIE);
    console.log("///////////////////deviceId", deviceId)
    let sessionId = retrieveId(SESSION_ID_COOKIE);
    console.log("///////////////////sessionId", sessionId)

    // 2️⃣ If missing, generate new UUIDs.
    let isNewSession = false;
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      isNewSession = true;
    }
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      isNewSession = true;
    }

    // 3️⃣ Persist IDs to both cookies and localStorage.
    storeId(DEVICE_ID_COOKIE, deviceId, MAX_AGE);
    storeId(SESSION_ID_COOKIE, sessionId, MAX_AGE);

    // 4️⃣ Collect fingerprint and derive metadata.
    const fp = collectFingerprint();
    console.log("///////////////////fp", fp)
    const deviceType = detectDeviceType(fp);
    console.log("///////////////////deviceType", deviceType)
    const os = detectOS(fp);
    console.log("///////////////////os", os)
    const browser = detectBrowser(fp);
    console.log("///////////////////browser", browser)
    const fingerprint = await fingerprintHash(fp);
    console.log("///////////////////fingerprint", fingerprint)

    const now = new Date().toISOString();
    console.log("///////////////////now", now)
    const pageUrl = window.location.href;
    console.log("///////////////////pageUrl", pageUrl)
    const referrer = document.referrer || null;
    console.log("///////////////////referrer", referrer)

    

    // 5️⃣ Upsert (or update) the session record on every init.
    const { data: sessionData, error: sessionError } = await supabase
      .from('device_sessions')
      .upsert(
        {
          session_id: sessionId,
          device_id: deviceId,
          device_type: deviceType,
          os,
          browser,
          fingerprint_hash: fingerprint,
          first_seen_at: now,
          last_seen_at: now,
        },
        { onConflict: 'session_id' }
      );
    if (sessionError) {
      console.error('Device session upsert failed:', sessionError);
    }

    // 6️⃣ Record a visit.
    const { error: visitError } = await supabase.from('device_session_visits').insert({
      session_id: sessionId,
      visited_at: now,
      page_url: pageUrl,
      referrer,
    });
    if (visitError) {
      console.error('Visit insert failed:', visitError);
    }
  } catch (e) {
    console.error('initDeviceSession error:', e);
  }
}

/**
 * Helper to manually record a visit (e.g., on route changes).
 */
export async function recordVisit(): Promise<void> {
  try {
    const sessionId = retrieveId(SESSION_ID_COOKIE);
    if (!sessionId) return; // No session – nothing to record.
    const now = new Date().toISOString();
    const pageUrl = window.location.href;
    const referrer = document.referrer || null;
    const { error } = await supabase.from('device_session_visits').insert({
      session_id: sessionId,
      visited_at: now,
      page_url: pageUrl,
      referrer,
    });
    if (error) console.error('recordVisit error:', error);
  } catch (e) {
    console.error(e);
  }
}
