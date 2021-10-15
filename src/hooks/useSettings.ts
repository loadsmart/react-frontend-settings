import { useContext } from 'react';

import { SettingsContext } from '~/src/context/context';
import { parseSettings } from '~/src/utils/settings';

export function useSettings(keys: string[]): {
  values: Array<boolean | null | unknown>;
  isLoading: boolean;
} {
  const { isLoading, ...settings } = useContext(SettingsContext);
  const values = parseSettings(keys, settings);

  return { values, isLoading };
}
