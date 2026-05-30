// lib/deviceFingerprint.ts
/**
 * Functions to collect a deterministic device fingerprint and detect
 * device type, OS, and browser information.
 */

export interface FingerprintInfo {
  userAgent: string;
  language: string;
  timezone: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  hardwareConcurrency: number;
  deviceMemory?: number;
  touchSupport: boolean;
  cookieEnabled: boolean;
  vendor: string;
}

export function collectFingerprint(): FingerprintInfo {
  const nav = navigator as any;
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    colorDepth: window.screen.colorDepth,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    touchSupport: !!(
      ('ontouchstart' in window) ||
      (nav.maxTouchPoints && nav.maxTouchPoints > 0) ||
      (nav.msMaxTouchPoints && nav.msMaxTouchPoints > 0)
    ),
    cookieEnabled: navigator.cookieEnabled,
    vendor: nav.vendor || ''
  };
}

export function detectDeviceType(info: FingerprintInfo): 'mobile' | 'tablet' | 'desktop' {
  const ua = info.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(ua)) return 'tablet';
  if (/mobi|android|iphone|ipod/.test(ua)) return 'mobile';
  return 'desktop';
}

export function detectOS(info: FingerprintInfo): string {
  const ua = info.userAgent;
  if (/Windows NT/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua) && !/Mobile/.test(ua)) return 'macOS';
  if (/Linux/.test(ua)) return 'Linux';
  if (/Android/.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  return 'Unknown';
}

export function detectBrowser(info: FingerprintInfo): string {
  const ua = info.userAgent;

  if (/(Chrome\/|CriOS\/)/.test(ua) && !/Edge\//.test(ua)) return 'Chrome';
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
  else if (/Firefox\//.test(ua)) return 'Firefox';
  else if (/Edg\//.test(ua) || /Edge\//.test(ua)) return 'Edge';
  else if (/OPR\//.test(ua) || /Opera\//.test(ua)) return 'Opera';
  else return 'Unknown';
}
export async function fingerprintHash(info: FingerprintInfo): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(info));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
