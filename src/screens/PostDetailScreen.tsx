import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '@/state/store';
import {Post} from '@/state/posts/types';

type RouteParams = {
  postId: string;
};

const PostDetailScreen: React.FC = () => {
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
        <Text style={styles.title}>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      {post.authorName ? (
        <Text style={styles.meta}>👤 {post.authorName}</Text>
      ) : null}
      {createdAt ? <Text style={styles.meta}>🕒 {createdAt}</Text> : null}

      <View style={styles.bodyWrapper}>
        <Text style={styles.body}>{post.body}</Text>
      </View>

      {post.imageUrl ? (
        <Text style={styles.imageHint}>
          (Later: display image from {post.imageUrl})
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: '700', marginBottom: 8},
  meta: {fontSize: 13, color: '#777'},
  bodyWrapper: {marginTop: 16},
  body: {fontSize: 15, lineHeight: 22, color: '#333'},
  imageHint: {marginTop: 16, fontSize: 13, color: '#999'},
});

export default PostDetailScreen;
