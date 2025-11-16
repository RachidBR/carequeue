import * as React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '@/navigation/AppNavigator';

export default function PostDetailScreen({
  route,
}: {
  route: RouteProp<RootStackParamList, 'PostDetail'>;
}) {
  const {id} = route.params;
  // TODO: fetch by id from Firestore
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post {id}</Text>
      <Image
        source={{uri: 'https://placekitten.com/600/400'}}
        style={styles.image}
      />
      <Text>Post content will load here…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, gap: 12},
  title: {fontSize: 22, fontWeight: '700'},
  image: {width: '100%', height: 200, borderRadius: 8, backgroundColor: '#eee'},
});
