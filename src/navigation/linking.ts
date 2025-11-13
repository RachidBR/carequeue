import { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './AppNavigator';


const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['carequeue://'],
    config: {
        screens: {
            Tabs: 'tabs',
            PostDetail: 'post/:id',
            CreatePost: 'create',
        },
    },
};


export default linking;