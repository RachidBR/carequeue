import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Post, AddPostPayload } from './types';

type PostsState = {
    items: Post[];
};

const initialState: PostsState = {
    items: [],
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts(state, action: PayloadAction<Post[]>) {
            state.items = action.payload;
        },
        addPost(state, action: PayloadAction<AddPostPayload>) {
            const now = new Date().toISOString();
            const newPost: Post = {
                id: Date.now().toString(),
                createdAt: now,
                ...action.payload,
            };
            state.items.unshift(newPost);
        },
    },
});

export const { setPosts, addPost } = postsSlice.actions;
export default postsSlice.reducer;
