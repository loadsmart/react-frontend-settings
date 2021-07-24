import { SettingsValue } from '@/context/provider';

export function parseSettings(keys: string[], settings: SettingsValue): Array<boolean | null | unknown> {
  return keys.map((key) =>
    key.split('.').reduce((acc, curr) => {
      const obj = acc === null ? settings : acc;

      if (!obj) return acc;

      return curr in obj ? obj[curr] : null;
    }, null as null | Record<string, unknown>),
  );
}
