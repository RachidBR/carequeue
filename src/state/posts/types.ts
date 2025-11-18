export type Post = {
    id: string;
    title: string;
    body: string;
    imageUrl?: string | null;
    createdAt: string; 
    authorName?: string;
    imageUri?: string | null; 

};

export type PostsState = {
    items: Post[];
};
