import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';
import { Post } from './types';


type PostsState = {
    items: Post[];
};

const initialState: PostsState = {
    items: [],
};


type AddPostPayload = {
    title: string;
    body: string;
    authorName?: string;
    imageUri?: string | null;
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<AddPostPayload>) => {
            const { title, body, authorName, imageUri } = action.payload;
            const newPost: Post = {
                id: String(uuid.v4()),
                title,
                body,
                authorName: authorName ?? 'Infirmier·e',
                createdAt: new Date().toISOString(),
                imageUri: imageUri ?? null,
            };
            state.items.unshift(newPost); // newest first
        },
        updatePost: (
            state,
            action: PayloadAction<{ id: string; changes: Partial<Post> }>,
        ) => {
            const { id, changes } = action.payload;
            const existing = state.items.find(p => p.id === id);
            if (existing) {
                Object.assign(existing, changes);
            }
        },
        deletePost: (state, action: PayloadAction<{ id: string }>) => {
            state.items = state.items.filter(p => p.id !== action.payload.id);
        },
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.items = action.payload;
        },
    },
});

export const { addPost, updatePost, deletePost, setPosts } = postsSlice.actions;
export default postsSlice.reducer;
