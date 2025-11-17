import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Post, PostsState } from './types';

const initialState: PostsState = {
    items: [
        {
            id: '1',
            title: 'Bienvenue sur CareQueue',
            body: "Ceci est un post de démo. Plus tard, ça viendra de Firestore 😉",
            createdAt: new Date().toISOString(),
            authorName: 'Admin',
        },
        {
            id: '2',
            title: 'Deuxième post',
            body: 'On utilise Redux pour gérer la liste en local pour le moment.',
            createdAt: new Date().toISOString(),
            authorName: 'Admin',
        },
    ],
};

type AddPostPayload = {
    title: string;
    body: string;
    imageUrl?: string | null;
    authorName?: string;
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<AddPostPayload>) => {
            const { title, body, imageUrl, authorName } = action.payload;
            const newPost: Post = {
                id: nanoid(),
                title,
                body,
                imageUrl: imageUrl ?? null,
                authorName: authorName ?? 'You',
                createdAt: new Date().toISOString(),
            };
            state.items.unshift(newPost); // new post at the top
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
