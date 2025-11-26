import {
    enablePromise,
    openDatabase,
    SQLiteDatabase,
} from 'react-native-sqlite-storage';
import type { Post } from '@/state/posts/types';

enablePromise(true);

const DB_NAME = 'carequeue.db';
const POSTS_TABLE = 'posts';

export async function getDB(): Promise<SQLiteDatabase> {
    return openDatabase({ name: DB_NAME, location: 'default' });
}

export async function initDB() {
    const db = await getDB();
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${POSTS_TABLE} (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      imageUrl TEXT,
      createdAt TEXT NOT NULL
    );`,
    );
    return db;
}

export async function loadPosts(db: SQLiteDatabase): Promise<Post[]> {
    const [result] = await db.executeSql(
        `SELECT id, title, body, imageUrl, createdAt
     FROM ${POSTS_TABLE}
     ORDER BY datetime(createdAt) DESC`,
    );

    const rows = result.rows;
    const posts: Post[] = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows.item(i);
        posts.push({
            id: row.id,
            title: row.title,
            body: row.body,
            imageUrl: row.imageUrl,
            createdAt: row.createdAt,
        });
    }

    return posts;
}

export async function insertPost(db: SQLiteDatabase, post: Post) {
    await db.executeSql(
        `INSERT INTO ${POSTS_TABLE} (id, title, body, imageUrl, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
        [post.id, post.title, post.body, post.imageUrl, post.createdAt],
    );
}
