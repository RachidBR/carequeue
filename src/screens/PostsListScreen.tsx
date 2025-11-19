// src/screens/PostsListScreen.tsx
import React, {useEffect, useLayoutEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../state/store';
import {useTranslation} from 'react-i18next';

import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from '@react-native-firebase/firestore';

import {Post} from '@/state/posts/types';
import {setPosts} from '@/state/posts/postsSlice';

const PostsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.posts.items);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('postsList.title'),
    });
  }, [navigation, t]);

  useEffect(() => {
    const db = getFirestore();

    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const data: Post[] = snapshot.docs.map(docSnap => {
        const raw = docSnap.data() as any;
        return {
          id: raw.id ?? docSnap.id,
          title: raw.title ?? '',
          body: raw.body ?? '',
          imageUrl: raw.imageUrl ?? null,
          createdAt: raw.createdAt ?? new Date().toISOString(),
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
      onPress={() =>
        navigation.navigate('PostDetail' as never, {id: item.id} as never)
      }>
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost' as never)}>
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
