import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/state/store';
import {Post} from '@/state/posts/types';
import {useNavigation} from '@react-navigation/native';

const PostsListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const posts = useSelector<RootState, Post[]>(state => state.posts.items);

  const handleCreatePress = () => {
    navigation.navigate('CreatePost'); // 👈 make sure this route exists in AppNavigator
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('PostDetail', {postId: item.id})
            }>
            <Text style={styles.title}>{item.title}</Text>
            {item.authorName ? (
              <Text style={styles.meta}>👤 {item.authorName}</Text>
            ) : null}
            <Text style={styles.body} numberOfLines={2}>
              {item.body}
            </Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating "+" button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePress}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  title: {fontSize: 16, fontWeight: '600', marginBottom: 4},
  meta: {fontSize: 12, color: '#777', marginBottom: 4},
  body: {fontSize: 14, color: '#555'},
  separator: {height: 12},
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    marginTop: -2,
  },
});

export default PostsListScreen;
