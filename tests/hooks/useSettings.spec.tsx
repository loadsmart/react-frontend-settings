import React, { ReactNode } from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { useSettings } from '@/hooks/useSettings';
import { SettingsContext, SettingsProviderValue } from '@/context/context';

const wrapper = (value: Partial<SettingsProviderValue>) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <SettingsContext.Provider value={value as SettingsProviderValue}>{children}</SettingsContext.Provider>;
  };

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
