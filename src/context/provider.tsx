import type { ReactElement, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import type { SettingsProviderValue } from './context';
import { SettingsContext } from './context';

export type SettingsValue = Pick<SettingsProviderValue, 'settings' | 'flags'>;

type SettingsProviderOptions = {
  updateIntervalMs?: number;
  onGetSettingsFail?: 'keep-last' | 'reset';
};

interface Props {
  children: ReactNode;
  getSettings: () => Promise<SettingsValue>;
  options?: SettingsProviderOptions;
}

const tenMinInMs = 10 * 60 * 1000;
const initialValue = { flags: {}, settings: {} };

export function SettingsProvider({
  children,
  getSettings,
  options: { onGetSettingsFail = 'keep-last', updateIntervalMs = tenMinInMs } = {},
}: Props): ReactElement<Props> {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState<SettingsValue>(initialValue);

  useEffect(() => {
    async function load() {
      if (isLoading) return;
      setLoading(true);

      try {
        const newValue = await getSettings();
        setValue(newValue);
      } catch (err) {
        if (onGetSettingsFail === 'reset') {
          setValue(initialValue);
        }
      } finally {
        setLoading(false);
      }
    }

    load();

    const intervalId = window.setInterval(load, updateIntervalMs);

    return function cleanup() {
      window.clearInterval(intervalId);
    };
  }, []);

  return <SettingsContext.Provider value={{ ...value, isLoading }}>{children}</SettingsContext.Provider>;
}
