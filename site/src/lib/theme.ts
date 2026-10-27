export type ThemeMode = 'auto' | 'light' | 'dark';
export type ThemePhase = 'morning' | 'day' | 'evening' | 'night';
export function normalizeTheme(value: string | null | undefined): ThemeMode {
  return value === 'light' || value === 'dark' ? value : 'auto';
}
export function phaseForHour(hour: number): ThemePhase {
  return hour >= 6 && hour < 11 ? 'morning' : hour >= 11 && hour < 17 ? 'day' : hour >= 17 && hour < 21 ? 'evening' : 'night';
}
