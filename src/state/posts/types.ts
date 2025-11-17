export type Post = {
    id: string;
    title: string;
    body: string;
    imageUrl?: string | null;
    createdAt: string; // ISO string
    authorName?: string;
};

export type PostsState = {
    items: Post[];
};
