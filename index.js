import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';

import App from './App';
import {name as appName} from './app.json';

// Background messages (Android; iOS only in very specific cases)
const app = getApp();
const msg = getMessaging(app);

setBackgroundMessageHandler(msg, async remoteMessage => {
  console.log('[FCM] background message:', remoteMessage);
  // If later you want: show a Notifee local notification here.
});

AppRegistry.registerComponent(appName, () => App);
