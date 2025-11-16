import * as React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import {Post} from '@/types/post';

export default function PostCard({
  post,
  onPress,
}: {
  post: Post;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {post.imageUrl ? (
        <Image source={{uri: post.imageUrl}} style={styles.thumb} />
      ) : null}
      <View style={{flex: 1}}>
        <Text numberOfLines={2} style={styles.text}>
          {post.text}
        </Text>
        <Text style={styles.meta}>
          {new Date(post.createdAt).toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  thumb: {width: 64, height: 64, borderRadius: 6, backgroundColor: '#eee'},
  text: {fontSize: 16},
  meta: {fontSize: 12, opacity: 0.6, marginTop: 4},
});
