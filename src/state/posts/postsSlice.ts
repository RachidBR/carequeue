import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, PostsState } from './types';

const initialState: PostsState = {
    items: [],
};

interface AddPostPayload {
    title: string;
    body: string;
    imageUrl: string | null;
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<AddPostPayload>) => {
            const { title, body, imageUrl } = action.payload;
            const now = new Date().toISOString();

            const newPost: Post = {
                id: Date.now().toString(),
                title,
                body,
                imageUrl,
                createdAt: now,
            };

            state.items.unshift(newPost);
        },

        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.items = action.payload;
        },
    },
});

export const { addPost, setPosts } = postsSlice.actions;
export default postsSlice.reducer;
