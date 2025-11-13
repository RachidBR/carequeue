import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PostsListScreen from '@/screens/PostsListScreen';
import PostDetailScreen from '@/screens/PostDetailScreen';
import CreatePostScreen from '@/screens/CreatePostScreen';
import SettingsScreen from '@/screens/SettingsScreen';

export type RootStackParamList = {
  Tabs: undefined;
  PostDetail: {id: string};
  CreatePost: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function TabsNav() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        lazy: true,
        detachInactiveScreens: true,
      }}>
      <Tabs.Screen
        name="Home"
        component={PostsListScreen}
        options={{title: 'Posts'}}
      />
      <Tabs.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabsNav}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{title: 'Post'}}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{title: 'New Post'}}
      />
    </Stack.Navigator>
  );
}
