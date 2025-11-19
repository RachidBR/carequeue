// src/navigation/AppNavigator.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';

import PostsListScreen from '../screens/PostsListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import SettingsScreen from '../screens/SettingsScreen';

import {
  RootStackParamList,
  MainTabsParamList,
  PostsStackParamList,
} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabsParamList>();
const PostsStack = createNativeStackNavigator<PostsStackParamList>();

// Stack used inside the "Posts" tab
function PostsStackNavigator() {
  return (
    <PostsStack.Navigator>
      <PostsStack.Screen
        name="PostsList"
        component={PostsListScreen}
        options={{title: 'Posts'}}
      />
      <PostsStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{title: 'Post'}}
      />
      <PostsStack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{title: 'New post'}}
      />
    </PostsStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        name="PostsTab"
        component={PostsStackNavigator}
        options={{title: 'Posts'}}
      />
      <Tabs.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: () => <Text>⚙️</Text>,
        }}
      />
    </Tabs.Navigator>
  );
}

// Root stack
const AppNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
    </RootStack.Navigator>
  );
};

export default AppNavigator;
