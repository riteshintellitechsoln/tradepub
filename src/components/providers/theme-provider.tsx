"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// Thin wrapper (same pattern as SessionProvider) so the root layout imports
// one thing from "@/components/providers" instead of reaching into
// "next-themes" directly. Powers dark/light/system mode across the whole
// app via the .dark class + CSS variables already defined in globals.css.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
