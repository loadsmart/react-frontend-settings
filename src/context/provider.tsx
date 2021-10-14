import React, { ReactElement, ReactNode, useEffect, useState } from 'react';

import { SettingsContext, SettingsProviderValue } from './context';

export type SettingsValue = Pick<SettingsProviderValue, 'settings' | 'flags'>;

interface Props {
  children: ReactNode;
  getSettings: () => Promise<SettingsValue>;
  updateIntervalMs?: number;
}

export function SettingsProvider({ children, getSettings, updateIntervalMs }: Props): ReactElement<Props> {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState<SettingsValue>({ flags: {}, settings: {} });

  useEffect(() => {
    function load() {
      if (isLoading) return;
      setLoading(true);
      getSettings()
        .then(setValue)
        .finally(() => setLoading(false));
    }

    load();

    const intervalId = window.setInterval(load, updateIntervalMs);

    return function cleanup() {
      window.clearInterval(intervalId);
    };
  }, []);

  return <SettingsContext.Provider value={{ ...value, isLoading }}>{children}</SettingsContext.Provider>;
}
