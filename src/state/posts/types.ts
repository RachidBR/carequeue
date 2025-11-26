export type Post = {
    id: string;
    title: string;
    body: string;
    imageUrl: string | null;
    createdAt: string;
};

export type AddPostPayload = {
    title: string;
    body: string;
    imageUrl: string | null;
};
