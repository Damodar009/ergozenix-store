"use client"

import { useTheme as useThemeContext } from "@/providers/theme-provider"

export function useTheme() {
  return useThemeContext()
}
