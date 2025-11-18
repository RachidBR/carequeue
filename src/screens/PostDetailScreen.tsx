import React, {useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../state/store';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';

type RootStackParamList = {
  PostDetail: {id: string};
};

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

const PostDetailScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<PostDetailRouteProp>();

  const post = useSelector((state: RootState) =>
    state.posts.items.find(p => p.id === route.params.id),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('postDetail.title'),
    });
  }, [navigation, t]);

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>Post not found.</Text>
      </View>
    );
  }

  const createdDate = format(new Date(post.createdAt), 'dd.MM.yyyy HH:mm');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.meta}>
        {t('postDetail.createdAt', {date: createdDate})}
      </Text>

      {post.imageUri && (
        <Image source={{uri: post.imageUri}} style={styles.image} />
      )}

      <Text style={styles.body}>{post.body}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  content: {padding: 16},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 20, fontWeight: '700', marginBottom: 8},
  meta: {fontSize: 12, color: '#6b7280', marginBottom: 16},
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#e5e7eb',
  },
  body: {fontSize: 15, lineHeight: 22},
});

export default PostDetailScreen;
