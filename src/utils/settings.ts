import { SettingsValue } from '../context/provider';

export function parseSettings(keys: string[], settings: SettingsValue): Array<boolean | null | unknown> {
  return keys.map((key) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key.split('.').reduce<any>((acc, curr) => {
      const obj = acc === null ? settings : acc;

      if (!obj) return acc;

      return curr in obj ? obj[curr] : null;
    }, null as null | Record<string, unknown>),
  );
}
