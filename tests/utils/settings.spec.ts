import type { SettingsValue } from 'context/provider';
import { parseSettings } from 'utils/settings';

describe('parseSettings', () => {
  const settings: SettingsValue = {
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
  };

  it('extracts the values from settings', () => {
    expect(parseSettings(['flags.AAA', 'settings.EEE'], settings)).toStrictEqual([
      settings.flags.AAA,
      settings.settings.EEE,
    ]);
  });

  it('returns null for missing value', () => {
    expect(
      parseSettings(
        ['flags.AAA', 'settings.EEE', 'this is a missing value', 'flags.MISSING', 'settings.NOT_HERE'],
        settings,
      ),
    ).toStrictEqual([settings.flags.AAA, settings.settings.EEE, null, null, null]);
  });
});
