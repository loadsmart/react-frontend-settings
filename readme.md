# React Frontend Settings

Dynamic frontend settings for React applications.

This application is meant to be used together with [django-frontend-settings](https://github.com/loadsmart/django-frontend-settings)
or some other settings provider. The most important part is that the `getSettings` function must return a `Promise` which will resolve
to a json object like:

```json
{
  "settings": {
    "GOOGLE_MAPS_KEY": "abcd1234",
    "SOME_OTHER_SETTING": 123
  },
  "flags": {
    "ENABLE_FEATURE_AAA": true,
    "ENABLE_FEATURE_BBB": false
  }
}
```

## Usage/Examples

You will need to wrap your application with the `SettingsProvider` component, like this:

```javascript
import { SettingsProvider } from '@loadsmart/react-frontend-settings'

function getSettings() {
  return http.get('/api/frontend-settings')
}

function App() {
  return (
      <SettingsProvider getSettings={getSettings}>
        <ThemeProvider theme={myTheme}>
        <Suspense fallback={<p>Loading</p>}>
          {/* ... */}
        </Suspense>
      </SettingsProvider>
  )
}
```

After that you can use the hooks/hocs provided by the library:

### useSettings

```javascript
function AddressInput({ ...props }) {
  const {
    values: [gmapsKey],
    isLoading,
  } = useSettings(['settings.GOOGLE_MAPS_KEY']);

  const gMapsStaus = useScript(gmapsKey ? scriptUrl(gmapsKey) : '');

  if (isLoading) return null;

  return <GeoInput {...props} />;
}
```

### withSettings

```javascript
function AddressInput({ gmapsKey, allowedCountries, ...props }) {
  const country = allowedCountries?.split(',') || 'us';
  const gMapsStaus = useScript(gmapsKey ? scriptUrl(gmapsKey) : '');

  return <GeoInput country={country} {...props} />;
}

const options = {
  settingsMap: {
    gmapsKey: 'settings.GOOGLE_MAPS_KEY',
    allowedCountries: 'settings.ALLOWED_COUNTRIES',
  },
  loadingComponent: Loading,
};

export default withSettings(AddressInput, options);
```

### withFeatureFlag

```javascript
function ComponentV1() {
  return <span>V1</span>;
}

function ComponentV2() {
  return <span>V2</span>;
}

export default withFeatureFlag(ComponentV2, {
  flags: ['flags.ENABLE_COMPONENT_V1'],
  fallbackComponent: ComponentV1,
});
```
