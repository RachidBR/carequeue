export type Post = {
    id: string;
    text: string;
    imageUrl?: string;
    createdAt: number; // ms
    authorId: string;
};

