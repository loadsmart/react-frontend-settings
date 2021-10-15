import type { ReactNode } from 'react';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { useSettings } from '../../src/hooks/useSettings';
import type { SettingsProviderValue } from '../../src/context/context';
import { SettingsContext } from '../../src/context/context';

function wrapper(value: Partial<SettingsProviderValue>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <SettingsContext.Provider value={value as SettingsProviderValue}>{children}</SettingsContext.Provider>;
  };
}

describe('useSettings', () => {
  const value: SettingsProviderValue = {
    flags: {
      AAA: true,
      BBB: false,
      CCC: true,
    },
    settings: {
      DDD: 'foo',
      EEE: 'bar',
      FFF: 'baz',
    },
    isLoading: false,
  };

  it('extracts settings from context', () => {
    const { result } = renderHook(() => useSettings(['flags.AAA', 'settings.EEE']), { wrapper: wrapper(value) });
    expect(result.current).toStrictEqual({ isLoading: value.isLoading, values: [value.flags.AAA, value.settings.EEE] });
  });
});
