// src/navigation/types.ts

export type PostsStackParamList = {
    PostsList: undefined;
    PostDetail: { id: string };
    CreatePost: undefined;
};

export type MainTabsParamList = {
    PostsTab: undefined;
    SettingsTab: undefined;
};

export type RootStackParamList = {
    MainTabs: undefined;
};