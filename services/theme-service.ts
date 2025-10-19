import { type ThemeConfig, DEFAULT_THEME_CONFIG } from "@/models/theme"

const THEME_STORAGE_KEY = "app-theme-config"

export class ThemeService {
  static getThemeConfig(): ThemeConfig {
    if (typeof window === "undefined") {
      return DEFAULT_THEME_CONFIG
    }

    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return DEFAULT_THEME_CONFIG
      }
    }
    return DEFAULT_THEME_CONFIG
  }

  static saveThemeConfig(config: ThemeConfig): void {
    if (typeof window === "undefined") return
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config))
  }

  static resetThemeConfig(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(THEME_STORAGE_KEY)
  }

  static applyThemeColors(config: ThemeConfig): void {
    if (typeof window === "undefined") return

    const root = document.documentElement
    root.style.setProperty("--primary", config.primaryColor)
    root.style.setProperty("--accent", config.accentColor)
  }
}
