import {
    enablePromise,
    openDatabase,
    SQLiteDatabase,
} from 'react-native-sqlite-storage';
import type { Post } from '@/state/posts/types';

enablePromise(true);

const DB_NAME = 'carequeue.db';
const POSTS_TABLE = 'posts';
const USERS_TABLE = 'users';

export type DbUser = {
    id: number;
    email: string;
    password: string;
    displayName: string | null;
};

export async function getDB(): Promise<SQLiteDatabase> {
    return openDatabase({ name: DB_NAME, location: 'default' });
}

export async function initDB() {
    const db = await getDB();

    // posts
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${POSTS_TABLE} (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      imageUrl TEXT,
      createdAt TEXT NOT NULL
    );`,
    );

    // users
    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${USERS_TABLE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      displayName TEXT
    );`,
    );

    return db;
}

export async function ensureDefaultUser(db: SQLiteDatabase) {
    const [res] = await db.executeSql(
        `SELECT id FROM ${USERS_TABLE} WHERE email = ?`,
        ['user@mail.com'],
    );

    if (res.rows.length === 0) {
        await db.executeSql(
            `INSERT INTO ${USERS_TABLE} (email, password, displayName)
       VALUES (?, ?, ?)`,
            ['user@mail.com', 'pass123', 'Demo User'],
        );
    }
}

export async function validateUserCredentials(
    db: SQLiteDatabase,
    email: string,
    password: string,
): Promise<DbUser | null> {
    const [res] = await db.executeSql(
        `SELECT id, email, password, displayName
     FROM ${USERS_TABLE}
     WHERE email = ? AND password = ?`,
        [email, password],
    );

    if (res.rows.length === 0) return null;

    const row = res.rows.item(0);
    return {
        id: row.id,
        email: row.email,
        password: row.password,
        displayName: row.displayName,
    };
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
