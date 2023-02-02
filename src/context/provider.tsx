import type { ReactElement, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import type { SettingsProviderValue } from 'context/context';
import { SettingsContext } from 'context/context';

export type SettingsValue = Pick<SettingsProviderValue, 'settings' | 'flags'>;

type SettingsProviderOptions = {
  updateIntervalMs?: number;
  onGetSettingsFail?: 'keep-last' | 'reset';
  autoUpdate?: boolean;
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
  options: { onGetSettingsFail = 'keep-last', updateIntervalMs = tenMinInMs, autoUpdate = true } = {},
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
    let intervalId: number | null = null;
    if (autoUpdate) {
      intervalId = window.setInterval(load, updateIntervalMs);
    }

    return function cleanup() {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return <SettingsContext.Provider value={{ ...value, isLoading }}>{children}</SettingsContext.Provider>;
}
