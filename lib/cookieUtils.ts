/**
 * Cookie utility functions
 * All cookies are set with Secure, SameSite=Lax, path=/, and 2‑year max‑age.
 */
export function setCookie(name: string, value: string, days = 730) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
  document.cookie = cookie;
}

export function getCookie(name: string): string | null {
  const nameEQ = encodeURIComponent(name) + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

export function deleteCookie(name: string) {
  // Set expiry in the past
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax; Secure`;
}

/**
 * Fallback storage using localStorage.
 */
export function setLocal(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch (_) {}
}
export function getLocal(key: string): string | null {
  try { return localStorage.getItem(key); } catch (_) { return null; }
}
export function deleteLocal(key: string) {
  try { localStorage.removeItem(key); } catch (_) {}
}

/** Helper to store an ID in both cookie and localStorage */
export function storeId(name: string, value: string, maxAgeSeconds: number = 63072000) {
  // Set cookie with secure, SameSite=Lax, path=/
  setCookie(name, value, maxAgeSeconds);
  try {
    localStorage.setItem(name, value);
  } catch (_) {}
}

/** Helper to retrieve an ID from cookie first, then fallback to localStorage */
export function retrieveId(name: string): string | null {
  const fromCookie = getCookie(name);
  if (fromCookie) return fromCookie;
  try {
    return localStorage.getItem(name);
  } catch (_) {
    return null;
  }
}
