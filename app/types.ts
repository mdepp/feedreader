export type ThemeMode = "light" | "dark" | "system";

export function parseThemeMode(value: any): ThemeMode {
  if (value === "light" || value === "dark") return value;
  return "system";
}
