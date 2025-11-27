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
import {ensureDefaultUser, initDB, loadPosts} from '@/services/db';
import {setPosts} from '@/state/posts/postsSlice';

export default function App() {
  const [dbReady, setDbReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const db = await initDB();
        await ensureDefaultUser(db);
        const posts = await loadPosts(db);
        store.dispatch(setPosts(posts));
        setDbReady(true);
      } catch (e) {
        console.error('[DB] init error', e);
        setDbReady(true);
      }
    })();

    requestNotificationPermissionOnce();
    initFCM().catch(err => console.warn('[FCM] init error', err));
  }, []);

  if (!dbReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
