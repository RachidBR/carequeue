import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/state/store';

import PostsListScreen from '../screens/PostsListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import { MainTabsParamList, PostsStackParamList, RootStackParamList } from '@/types/navigation';
import LoginScreen from '@/screens/LoginScreen';
import ProfileScreen from '@/screens/ProfileScreen';


const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabsParamList>();
const PostsStack = createNativeStackNavigator<PostsStackParamList>();

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
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: () => <Text>👤</Text>,
        }}
      />
    </Tabs.Navigator>
  );
}

const AppNavigator = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {currentUser ? (
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        <RootStack.Screen name="Login" component={LoginScreen} />
      )}
    </RootStack.Navigator>
  );
};

export default AppNavigator;
