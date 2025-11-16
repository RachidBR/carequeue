import * as React from 'react';
import {View, FlatList, Button} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/navigation/AppNavigator';
import PostCard from '@/components/PostCard';
import {Post} from '@/types/post';

// TODO: replace with Firestore subscription
const MOCK: Post[] = [
  {
    id: '1',
    text: 'Bienvenue à CareQueue',
    createdAt: Date.now(),
    authorId: 'u1',
  },
  {
    id: '2',
    text: 'Photo du jour',
    imageUrl: 'https://placekitten.com/300/200',
    createdAt: Date.now() - 5000,
    authorId: 'u2',
  },
];

export default function PostsListScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Tabs'>) {
  const [data] = React.useState(MOCK);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data}
        keyExtractor={it => it.id}
        renderItem={({item}) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', {id: item.id})}
          />
        )}
      />
      <View style={{padding: 12}}>
        <Button
          title="Create"
          onPress={() => navigation.navigate('CreatePost')}
        />
      </View>
    </View>
  );
}
