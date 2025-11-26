import React, {useLayoutEffect, useMemo} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {RootState} from '../state/store';
import {Colors, Spacing, Radius, TextPresets, FontSize} from '../theme';
import { PostsStackParamList } from '@/types/navigation';

type DetailRoute = RouteProp<PostsStackParamList, 'PostDetail'>;

const PostDetailScreen: React.FC = () => {
  const route = useRoute<DetailRoute>();
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

  const formattedDate = useMemo(() => {
    if (!post?.createdAt) return '';
    return new Date(post.createdAt).toLocaleString();
  }, [post?.createdAt]);

  if (!post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundTitle}>
          {t('postDetail.notFoundTitle')}
        </Text>
        <Text style={styles.notFoundSubtitle}>
          {t('postDetail.notFoundSubtitle')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {post.imageUrl ? (
        <Image source={{uri: post.imageUrl}} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{post.title}</Text>

      {formattedDate ? <Text style={styles.meta}>{formattedDate}</Text> : null}

      <Text style={styles.body}>{post.body}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.m,
    paddingBottom: Spacing.xl,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.l,
  },
  notFoundTitle: {
    ...TextPresets.title,
    marginBottom: Spacing.xs,
  },
  notFoundSubtitle: {
    ...TextPresets.body,
    color: Colors.muted,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: Radius.xl,
    marginBottom: Spacing.m,
    backgroundColor: Colors.border, // fallback
  },
  title: {
    ...TextPresets.h1,
    marginBottom: Spacing.xs,
  },
  meta: {
    ...TextPresets.caption,
    color: Colors.muted,
    marginBottom: Spacing.m,
  },
  body: {
    ...TextPresets.body,
    fontSize: FontSize.m,
    lineHeight: 22,
  },
});

export default PostDetailScreen;
