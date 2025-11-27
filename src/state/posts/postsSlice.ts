import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Post } from './types';

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

        addPost(state, action: PayloadAction<Post>) {
            state.items.unshift(action.payload);
        },
    },
});

export const { setPosts, addPost } = postsSlice.actions;
export default postsSlice.reducer;
