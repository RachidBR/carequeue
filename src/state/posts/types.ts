export type PostId = string;

export interface Post {
    id: PostId;
    title: string;
    body: string;
    imageUrl: string | null;
    createdAt: string; // ISO string
}

export interface PostsState {
    items: Post[];
}
