import React, { ReactElement, ReactNode } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';

import { SettingsContext, SettingsProviderValue } from 'context/context';

export type SettingsValue = Pick<SettingsProviderValue, 'settings' | 'flags'>;

interface Props {
  children: ReactNode;
  getSettings: () => Promise<SettingsValue>;
  options?: UseQueryOptions<SettingsValue>;
}

export function SettingsProvider({ children, getSettings, options = {} }: Props): ReactElement<Props> {
  const {
    data: { settings, flags },
    isLoading,
  } = useQuery('react-settings-provider', getSettings, options);
  return <SettingsContext.Provider value={{ settings, flags, isLoading }}>{children}</SettingsContext.Provider>;
}
