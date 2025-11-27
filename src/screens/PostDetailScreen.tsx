import React, {useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../state/store';
import {useTranslation} from 'react-i18next';
import { PostsStackParamList } from '@/types/navigation';
import { Colors, FontSize, Radius, Spacing, TextPresets } from '../theme';

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
    <View style={styles.centered}>
      <Text style={styles.notFoundTitle}>
        {t('postDetail.notFound')}
      </Text>
      <Text style={styles.notFoundSubtitle}>
        {t('postDetail.notFoundHelp')}
      </Text>
    </View>
  );
}

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {post.imageUrl ? (
        <Image source={{uri: post.imageUrl}} style={styles.image} />
      ) : null}

      <Text style={styles.title}>id : {post.id}</Text>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.date}>
        {new Date(post.createdAt).toLocaleString()}
      </Text>
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
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  notFoundTitle: {
    ...TextPresets.title,
    marginBottom: Spacing.xs,
  },
  notFoundSubtitle: {
    ...TextPresets.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: Radius.pill,
    marginBottom: Spacing.md,
    backgroundColor: Colors.border,
  },
  title: {
    ...TextPresets.h1,
    marginBottom: Spacing.xs,
  },
  id: {
    ...TextPresets.h1,
    marginBottom: Spacing.xs,
  },
  date: {
    ...TextPresets.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  meta: {
    ...TextPresets.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  body: {
    ...TextPresets.body,
    fontSize: FontSize.MEDIUM,
    lineHeight: Spacing.sm,
  },
});


export default PostDetailScreen;
