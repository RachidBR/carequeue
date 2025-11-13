import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/state/store';
import AppNavigator from './src/navigation/AppNavigator';
import linking from './src/navigation/linking';
import './src/i18n';
import {initFirebase} from './src/services/firebase';

initFirebase();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
