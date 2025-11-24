import { RootStackParamList } from '@/types/navigation';
import type { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['carequeue://', 'https://carequeue.app'],

    config: {
        screens: {
            MainTabs: {
                screens: {
                    PostsTab: {
                        screens: {
                            PostsList: 'posts',
                            PostDetail: 'posts/:id',
                            CreatePost: 'posts/new',
                        },
                    },
                    SettingsTab: 'settings',
                },
            },
        },
    },
};

export default linking;