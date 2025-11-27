// src/services/db.ts
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
      email TEXT PRIMARY KEY NOT NULL,
      password TEXT NOT NULL,
      displayName TEXT
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

// ---- users helpers ----
type DbUser = {
    email: string;
    password: string;
    displayName: string | null;
};

export async function findUserByEmail(
    db: SQLiteDatabase,
    email: string,
): Promise<DbUser | null> {
    const [result] = await db.executeSql(
        `SELECT email, password, displayName
     FROM ${USERS_TABLE}
     WHERE email = ?`,
        [email],
    );
    if (result.rows.length === 0) return null;
    const row = result.rows.item(0);
    return {
        email: row.email,
        password: row.password,
        displayName: row.displayName,
    };
}

export async function createUser(
    db: SQLiteDatabase,
    user: { email: string; password: string; displayName?: string },
) {
    await db.executeSql(
        `INSERT INTO ${USERS_TABLE} (email, password, displayName)
     VALUES (?, ?, ?)`,
        [user.email, user.password, user.displayName ?? null],
    );
}

export async function createUserIfNotExists(
    db: SQLiteDatabase,
    user: { email: string; password: string; displayName?: string },
) {
    const existing = await findUserByEmail(db, user.email);
    if (!existing) {
        await createUser(db, user);
    }
}

export async function updateUserDisplayName(
    db: SQLiteDatabase,
    email: string,
    displayName: string,
) {
    await db.executeSql(
        `UPDATE ${USERS_TABLE}
     SET displayName = ?
     WHERE email = ?`,
        [displayName, email],
    );
}


export async function ensureDefaultUser(db: SQLiteDatabase) {
    await createUserIfNotExists(db, {
        email: 'user@mail.com',
        password: 'pass123',
        displayName: 'Demo User',
    });
}