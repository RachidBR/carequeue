// src/screens/PostDetailScreen.tsx
import React, {useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../state/store';
import {useTranslation} from 'react-i18next';
import { PostsStackParamList } from '@/types/navigation';

type PostDetailRouteProp = RouteProp<PostsStackParamList, 'PostDetail'>;

const PostDetailScreen: React.FC = () => {
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {id} = route.params;

  const post = useSelector((state: RootState) =>
    state.posts.items.find(p => p.id === id),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: post?.title ?? t('postDetail.titleFallback'),
    });
  }, [navigation, post, t]);

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>{t('postDetail.notFound')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {post.imageUrl ? (
        <Image source={{uri: post.imageUrl}} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.date}>
        {new Date(post.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.body}>{post.body}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  content: {padding: 16},
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {fontSize: 20, fontWeight: '700', marginBottom: 8},
  date: {fontSize: 12, color: '#6b7280', marginBottom: 16},
  body: {fontSize: 14, lineHeight: 20},
});

export default PostDetailScreen;
