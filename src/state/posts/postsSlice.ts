// src/state/postsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from './types';

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
    },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;