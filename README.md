# CareQueue

CareQueue is a small React Native demo app built for an interview exercise.

The goal of the app is to showcase **mobile fundamentals**:

- Modern React Native architecture (navigation, screens, theming)
- Local state management with **Redux Toolkit**
- Local persistence with **SQLite**
- Basic **login / profile** flow
- Internationalization (**i18n**) with French, English and German
- Local notifications with **Notifee**
- Wiring for **Firebase Cloud Messaging (FCM)** + deep link navigation into the app

The app is intentionally small but structured as a real-world project.

---

## 1. Tech Stack

- **React Native** (0.75.x)
- **TypeScript**
- **React Navigation**
  - Native stack navigator
  - Bottom tabs
- **Redux Toolkit** for app state
- **SQLite** via `react-native-sqlite-storage` for local persistence
- **i18next + react-i18next** for translations
- **Notifee** for local notifications
- **Firebase** (via React Native Firebase)
  - `@react-native-firebase/app`
  - `@react-native-firebase/messaging`

---

## 2. Features Overview

### 2.1 Feed / Posts

- A simple **announcements feed** for a care team.
- Screens:
  - `PostsListScreen` – list of posts
  - `CreatePostScreen` – create a new post with optional image
  - `PostDetailScreen` – full details of a post
- Posts are stored in **SQLite** and loaded on app startup.
- Each post has:
  - `id`
  - `title`
  - `body`
  - optional `imageUrl` (local URI for now)
  - `createdAt` (ISO string)

### 2.2 Login & Profile

- **LoginScreen**
  - Simple email/password login.
  - On first run, the app ensures a default user exists in SQLite:
    - email: `user@mail.com`
    - password: `pass123`
  - Login checks credentials against the local `users` table.
  - On success, a `currentUser` is stored in Redux.

- **ProfileScreen**
  - Shows current user email.
  - Allows editing of `displayName` (stored in Redux and optionally synced in SQLite).
  - Includes a **logout** button that clears `currentUser` and returns to Login.

### 2.3 Settings & i18n

- **SettingsScreen**
  - Lets the user switch app language between:
    - French (`fr`)
    - 🇬🇧 English (`en`)
    - 🇩🇪 German (`de`)
  - Uses `react-i18next` and language JSON files:
    - `src/i18n/locales/fr.json`
    - `src/i18n/locales/en.json`
    - `src/i18n/locales/de.json`
  - The main UI (tabs, titles, labels, errors) is translated via `t('...')` keys.

### 2.4 Notifications

- **Local notifications with Notifee**
  - When a new post is created, the app can trigger a local Notifee notification
    summarizing the title/body.
  - Permission is requested once on startup, then cached.

- **Firebase Cloud Messaging (FCM) wiring**
  - On startup, the app:
    - Requests push permission.
    - Fetches the FCM **device token** and logs it.
    - Subscribes to:
      - `onMessage` (foreground messages)
      - `onNotificationOpenedApp` (app opened from background tap)
      - `getInitialNotification` (app opened from killed state tap).
  - FCM + Notifee can be combined so that **remote messages** are rendered as
    local notifications while the app is in the foreground.

> Note: For actual production push flows, a backend would send structured
> FCM messages containing e.g. `postId` in `data` payloads. The app already
> contains a helper `navigateToPostFromNotification(postId)` to deep-link
> into the post detail screen.

---

## 3. Project Structure

High-level folders:

```text
.
├── App.tsx
├── src
│   ├── screens
│   │   ├── PostsListScreen.tsx
│   │   ├── CreatePostScreen.tsx
│   │   ├── PostDetailScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation
│   │   ├── AppNavigator.tsx
│   │   ├── linking.ts
│   │   └── navigationRef.ts
│   ├── state
│   │   ├── store.ts
│   │   ├── posts
│   │   │   ├── postsSlice.ts
│   │   │   └── types.ts
│   │   └── user
│   │       └── userSlice.ts
│   ├── services
│   │   ├── db.ts          # SQLite helpers for posts (and users)
│   │   ├── notifications.ts
│   │   └── pushNotifications.ts
│   ├── i18n
│   │   ├── index.ts
│   │   └── locales
│   │       ├── en.json
│   │       ├── fr.json
│   │       └── de.json
│   └── theme
│       ├── colors.ts
│       ├── spacing.ts
│       ├── typography.ts
│       └── index.ts
└── README.md
```

- **Navigation**
  - Root stack:
    - `Login` OR `MainTabs` depending on `currentUser`.
  - `MainTabs` bottom tab:
    - `PostsTab` (stack with list/detail/create)
    - `SettingsTab` (language settings)
    - `ProfileTab` (user profile)

- **Theme system**
  - `Colors`, `Spacing`, `FontSize`, `Radius`, and `TextPresets`
  - Screens import from `../theme` instead of hardcoding styles.

---

## 4. Local Development

### 4.1 Prerequisites

Make sure the standard React Native tooling is installed:

- Node.js
- Watchman (macOS)
- Xcode (for iOS)
- Android Studio + Android SDK (for Android)
- CocoaPods (for iOS pods)
- Java / JDK for Android builds

Run once from the project root:

```bash
# Install JS deps
npm install
# or
yarn
```

For iOS:

```bash
cd ios
pod install
cd ..
```

### 4.2 Running the app

Start Metro:

```bash
npm start
# or
yarn start
```

In another terminal:

```bash
# Android
npm run android
# or
yarn android

# iOS (simulator)
npm run ios
# or
yarn ios
```

---

## 5. SQLite Details

The SQLite integration lives in `src/services/db.ts`.

- Database name: **`carequeue.db`**
- Tables:
  - `posts`
    - `id TEXT PRIMARY KEY`
    - `title TEXT`
    - `body TEXT`
    - `imageUrl TEXT`
    - `createdAt TEXT`
  - `users` (if present in your codebase)
    - `id TEXT PRIMARY KEY`
    - `email TEXT UNIQUE`
    - `password TEXT` (demo only – plain text, not for production)
    - `displayName TEXT`

On app startup (`App.tsx`):

1. `initDB()` creates tables if they do not exist.
2. `loadPosts()` fetches posts and dispatches them into Redux.
3. `dbReady` flag ensures the UI only renders after the DB is initialized.

In the post creation screen:

- A new post object is created with `id = Date.now().toString()`.
- `insertPost(db, post)` persists it.
- Redux is updated via `addPost(...)` so the UI updates instantly.

> This pattern mirrors a typical offline-first flow: update local state,
> sync to DB, and later, potentially sync to backend.

---

## 6. Authentication (Demo Only)

The authentication in this app is intentionally **simple** and local-only:

- On first login, if no user exists, the app creates one with:
  - `email: user@mail.com`
  - `password: pass123`
- On subsequent logins, the app checks the `users` table.
- On success, it stores `currentUser` in Redux with `email` and optionally a `displayName`.
- There is no token, no backend, and no password hashing – this is purely for demo purposes.

**Never use this approach as-is in production.**

For a real app, you would plug into:

- Firebase Auth
- A custom backend
- OAuth providers, etc.

---

## 7. Notifications & FCM

### 7.1 Notifee

- The app uses **Notifee** for displaying local notifications.
- When a new post is created, `notifyNewPost({ title, body })` can be called:
  - Requests notification permission (once)
  - Creates a default channel on Android
  - Displays a banner notification with the post title/body.

### 7.2 Firebase Cloud Messaging (FCM)

- On startup, `initFCM()`:
  - Requests push permissions via the **modular** React Native Firebase API.
  - Fetches and logs the device token.
  - Subscribes to:
    - `onMessage` (foreground)
    - `onNotificationOpenedApp`
    - `getInitialNotification`

In foreground, FCM messages are received in JS and can be forwarded to Notifee
to display a local notification.

To test:

1. Grab the **device token** from Metro logs.
2. In Firebase Console → Cloud Messaging → Send test message.
3. Paste the token and send.

> Note: In Android emulator, you may not see system banners for FCM without
> additional setup. Using Notifee with `onMessage` guarantees a visible
> notification while the app is in the foreground.

---

## 8. Internationalization (i18n)

- `src/i18n/index.ts` configures i18next with three locales: `en`, `fr`, `de`.
- Translation files live in `src/i18n/locales`.
- UI strings are accessed via `const { t } = useTranslation();` and `t('key.path')`.
- The settings screen allows switching languages at runtime.

Example keys:

- `tabs.feed`, `tabs.settings`
- `postsList.title`, `createPost.titleLabel`
- `settings.languageTitle`, etc.
