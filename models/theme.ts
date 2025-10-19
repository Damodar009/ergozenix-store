export type ThemeMode = "light" | "dark" | "system"

export interface ThemeConfig {
  mode: ThemeMode
  primaryColor: string
  accentColor: string
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: "system",
  primaryColor: "#0066cc",
  accentColor: "#00d9ff",
}
