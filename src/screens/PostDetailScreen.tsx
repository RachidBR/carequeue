import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';

import {RootState} from '../state/store';
import {Post} from '../state/posts/types';
import { PostsStackParamList } from '@/types/navigation';

type DetailRoute = RouteProp<PostsStackParamList, 'PostDetail'>;

const PostDetailScreen: React.FC = () => {
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {id} = route.params;

  const postFromStore = useSelector((state: RootState) =>
    state.posts.items.find(p => p.id === id),
  );

  const [post, setPost] = useState<Post | null>(postFromStore ?? null);
  const [loading, setLoading] = useState(!postFromStore);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('postDetail.title'),
    });
  }, [navigation, t]);

  // If the post isn’t in Redux (e.g. cold start via deep link), fetch from Firestore
  useEffect(() => {
    if (postFromStore) return;

    const fetch = async () => {
      try {
        const doc = await firestore().collection('posts').doc(id).get();
        if (doc.exists) {
          const raw = doc.data()!;
          setPost({
            id,
            title: (raw.title as string) ?? '',
            body: (raw.body as string) ?? '',
            imageUrl: (raw.imageUrl as string | null) ?? null,
            createdAt: (raw.createdAt as string) ?? '',
          });
        } else {
          setPost(null);
        }
      } catch (e) {
        console.error(e);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id, postFromStore]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>{t('postDetail.notFound')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      {post.imageUrl ? (
        <Image source={{uri: post.imageUrl}} style={styles.image} />
      ) : null}
      <Text style={styles.body}>{post.body}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  container: {padding: 16},
  title: {fontSize: 20, fontWeight: '700', marginBottom: 12},
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#e5e5e5',
  },
  body: {fontSize: 16, lineHeight: 22},
});

export default PostDetailScreen;
