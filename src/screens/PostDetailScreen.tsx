import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '@/state/store';
import {Post} from '@/state/posts/types';
import {useTranslation} from 'react-i18next';

type RouteParams = {
  postId: string;
};

const PostDetailScreen: React.FC = () => {
  const {t} = useTranslation();
  const route = useRoute<any>();
  const {postId} = route.params as RouteParams;

  const post = useSelector<RootState, Post | undefined>(state =>
    state.posts.items.find(p => p.id === postId),
  );

  const createdAt = useMemo(() => {
    if (!post?.createdAt) return '';
    try {
      return new Date(post.createdAt).toLocaleString();
    } catch {
      return post.createdAt;
    }
  }, [post?.createdAt]);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('postDetail.notFoundTitle')}</Text>
        <Text style={styles.body}>{t('postDetail.notFoundBody')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      {post.authorName ? (
        <Text style={styles.meta}>
          {t('posts.author')}: {post.authorName}
        </Text>
      ) : null}
      {createdAt ? (
        <Text style={styles.meta}>
          {t('posts.createdAt')}: {createdAt}
        </Text>
      ) : null}

      <View style={styles.bodyWrapper}>
        <Text style={styles.body}>{post.body}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: '700', marginBottom: 8},
  meta: {fontSize: 13, color: '#777'},
  bodyWrapper: {marginTop: 16},
  body: {fontSize: 15, lineHeight: 22, color: '#333'},
});

export default PostDetailScreen;
