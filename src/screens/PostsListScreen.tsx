import React, {useLayoutEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../state/store';
import {useTranslation} from 'react-i18next';
import {Post} from '@/state/posts/types';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

const PostsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const posts = useSelector((state: RootState) => state.posts.items);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('postsList.title'),
    });
  }, [navigation, t]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{t('postsList.emptyTitle')}</Text>
      <Text style={styles.emptySubtitle}>{t('postsList.emptySubtitle')}</Text>
    </View>
  );

  const renderItem = ({item}: {item: Post}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('PostDetail' as never, {id: item.id} as never)
      }>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.cardBody}>
        {item.body}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={posts.length === 0 && styles.emptyListContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost' as never)}>
        <Text style={styles.fabText}>{t('postsList.fabLabel')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.backgroundMuted},
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.LARGE,
    fontWeight: FontWeight.SEMI_BOLD,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: FontSize.MEDIUM,
    color: Colors.grey,
    textAlign: 'center',
  },
  emptyListContent: {flexGrow: 1, justifyContent: 'center'},
  card: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: Spacing.sm,
    elevation: 2,
  },
  cardTitle: {
    fontSize: Spacing.md,
    fontWeight: FontWeight.SEMI_BOLD,
    marginBottom: Spacing.xxs,
  },
  cardBody: {fontSize: FontSize.MEDIUM, color: Colors.grey},
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.lg,
    backgroundColor: '#2563eb',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    elevation: Spacing.xxs,
  },
  fabText: {color: Colors.white, fontWeight: FontWeight.SEMI_BOLD},
});

export default PostsListScreen;
