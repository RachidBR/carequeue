import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/state/store';
import AppNavigator from './src/navigation/AppNavigator';
import linking from './src/navigation/linking';
import './src/i18n';

import {initFCM} from '@/services/pushNotifications';
import {requestNotificationPermissionOnce} from '@/services/notifications';

export default function App() {
  React.useEffect(() => {
    requestNotificationPermissionOnce();
    initFCM().catch(err => {
      console.warn('[FCM] init error', err);
    });
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
