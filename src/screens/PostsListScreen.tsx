// src/screens/PostsListScreen.tsx
import React, {useEffect, useLayoutEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';

import {RootState} from '../state/store';
import {setPosts} from '../state/posts/postsSlice';
import {Post} from '../state/posts/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { PostsStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<PostsStackParamList, 'PostsList'>;

const PostsListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.posts.items);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('postsList.title'),
    });
  }, [navigation, t]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data: Post[] = snapshot.docs.map(doc => {
          const raw = doc.data();
          return {
            id: (raw.id as string) ?? doc.id,
            title: (raw.title as string) ?? '',
            body: (raw.body as string) ?? '',
            imageUrl: (raw.imageUrl as string | null) ?? null,
            createdAt: (raw.createdAt as string) ?? new Date().toISOString(),
          };
        });
        dispatch(setPosts(data));
      });

    return () => unsubscribe();
  }, [dispatch]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{t('postsList.emptyTitle')}</Text>
      <Text style={styles.emptySubtitle}>{t('postsList.emptySubtitle')}</Text>
    </View>
  );

  const renderItem = ({item}: {item: Post}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PostDetail', {id: item.id})}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.cardBody}>
        {item.body}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={posts.length === 0 && styles.emptyListContent}
      />

      {/* Floating "New post" button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}>
        <Text style={styles.fabText}>{t('postsList.fabLabel')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {fontSize: 18, fontWeight: '600', marginBottom: 8},
  emptySubtitle: {fontSize: 14, color: '#555', textAlign: 'center'},
  emptyListContent: {flexGrow: 1, justifyContent: 'center'},
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {fontSize: 16, fontWeight: '600', marginBottom: 4},
  cardBody: {fontSize: 14, color: '#555'},
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    elevation: 4,
  },
  fabText: {color: 'white', fontWeight: '600'},
});

export default PostsListScreen;
