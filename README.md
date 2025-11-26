# CareQueue

A small React Native demo app for managing a feed of posts (like simple care updates or status messages).  
Built as an interview preparation project to showcase:

- Modern React Native architecture (0.75+)
- Type-safe navigation
- Redux Toolkit state management
- Local theming system (colors, typography, spacing)
- Basic i18n (FR/EN)
- Local notifications + Firebase Cloud Messaging (FCM) wiring
- Simple “Posts” & “Profile / Settings” flows

---

## 1. Features

### Core user flows

- **Posts list**
  - See a list of locally stored posts
  - Tap a post to see its details
- **Create post**
  - Title + body
  - Optional image from camera or gallery
  - Local Redux state storage (can be swapped for Firestore later)
  - Shows a local notification on creation
- **Post detail**
  - Read title, body and (later) remote image
- **Profile / Settings**
  - Simple “fake” user profile
  - Language toggle (FR/EN)
  - Theme preview

### Technical highlights

- **Navigation**
  - `@react-navigation/native`
  - `@react-navigation/native-stack` for stacks
  - `@react-navigation/bottom-tabs` for the main tab bar
  - Dedicated `navigationRef` for navigating from outside React components
- **State management**
  - `@reduxjs/toolkit` + `react-redux`
  - `postsSlice` for the posts list
- **Theming**
  - Centralized tokens under `src/theme`:
    - `colors.ts`
    - `spacing.ts`
    - `typography.ts`
    - `layout.ts`
  - Screens/styles import tokens instead of hardcoding magic numbers
- **i18n**
  - `react-i18next`
  - Language files under `src/i18n/locales`
  - Runtime language switch via Settings/Profile screen
- **Notifications**
  - **Notifee**: local notifications when creating a post
  - **Firebase Cloud Messaging (FCM)**: device token retrieval + listeners
- **Deep links (basis)**
  - `linking` config prepared to handle `carequeue://` style deep links
  - FCM tap handlers navigate by post id

---

## 2. Tech stack

- **Language**: TypeScript
- **UI runtime**: React Native (Hermes)
- **Navigation**: React Navigation
- **State**: Redux Toolkit
- **Internationalization**: react-i18next
- **Notifications**: notifee
- **Push / backend wiring**: Firebase Cloud Messaging
- **Build tooling**:
  - Android: Gradle
  - iOS: CocoaPods + Xcode

---

## 3. Project structure

```text
carequeue/
  android/
  ios/
  src/
    components/
    i18n/
      index.ts
      locales/
        en.json
        fr.json
    navigation/
      AppNavigator.tsx
      linking.ts
      navigationRef.ts
      types.ts
    screens/
      PostsListScreen.tsx
      PostDetailScreen.tsx
      CreatePostScreen.tsx
      SettingsScreen.tsx
    services/
      notifications.ts      # local notifee helpers
      pushNotifications.ts  # FCM init + deep-link navigation
      firebase.ts           # (optional / future) Firebase app init
    state/
      posts/
        postsSlice.ts
        types.ts
      store.ts
    theme/
      colors.ts
      spacing.ts
      typography.ts
      layout.ts
  App.tsx
  index.js
  README.md
```

The idea: **screens are dumb**, most logic is delegated to slices, services, or hooks. Styling is driven by theme tokens so you don’t sprinkle raw hex or pixel values everywhere.

---

## 4. Getting started

### 4.1. Prerequisites

- Node.js (LTS recommended)
- Yarn or npm
- Watchman (macOS)
- Xcode (for iOS)
- Android Studio + Android SDK (for Android)
- CocoaPods (for iOS pods)
- A Firebase project (if you want FCM to fully work)

Make sure your React Native environment is set up:

```bash
npx react-native doctor
```

### 4.2. Install dependencies

```bash
# install JS deps
npm install

# install iOS pods
cd ios
pod install
cd ..
```

### 4.3. Configure Firebase (minimal)

1. **Create a Firebase project** in the Firebase console.
2. Add an **Android app** with the package id `com.carequeue` (or change it and update the native project).
3. Download `google-services.json` and place it under `android/app/`.
4. Add an **iOS app** with the bundle id `com.carequeue` (or update Xcode project accordingly).
5. Download `GoogleService-Info.plist` and place it in `ios/carequeue/` (and add it to the Xcode project).

The project already uses `@react-native-firebase/app` and `@react-native-firebase/messaging` integration patterns, so once the native files are correctly placed and app id / bundle id match, FCM should work.

> For production, you’ll also need valid APNs keys / certificates for iOS push.

---

## 5. Running the app

### 5.1. iOS

```bash
# in project root
npx react-native run-ios
# or choose a specific simulator
npx react-native run-ios --simulator "iPhone 17 Pro"
```

You can also open `ios/carequeue.xcworkspace` in Xcode and run from there.

### 5.2. Android

```bash
# start an Android emulator first
npx react-native run-android
```

Metro bundler usually starts automatically; if not, run:

```bash
npx react-native start
```

---

## 6. State & data model

### 6.1. Post type

```ts
export type Post = {
  id: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  createdAt: string;
};
```

### 6.2. Redux slice

`src/state/posts/postsSlice.ts` exposes:

- `addPost(payload: { title: string; body: string; imageUrl?: string | null })`
- (optionally) `setPosts(payload: Post[])` if you plug Firestore later

The `CreatePostScreen` dispatches `addPost`, and `PostsListScreen` subscribes to `state.posts.items`.

---

## 7. Theming system

All styling is based on a tiny design token setup:

- `colors.ts` – app palette (primary, background, text, danger…)
- `spacing.ts` – spacing scale (xs, sm, md, lg…)
- `typography.ts` – text styles (H1, H2, body, caption…)
- `layout.ts` – reusable layout helpers (screen container, card, row spacing…)

Example:

```ts
// typography.ts
export const Typography = {
  H1: {
    fontSize: 24,
    fontWeight: '700',
  },
  H2: {
    fontSize: 20,
    fontWeight: '600',
  },
  Body: {
    fontSize: 14,
    fontWeight: '400',
  },
};
```

Then in a screen:

```ts
import { Typography } from '@/theme/typography';
import { Colors } from '@/theme/colors';

const styles = StyleSheet.create({
  title: {
    ...Typography.H2,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
});
```

This keeps the UI consistent and makes global design tweaks easy.

---

## 8. i18n

- Config entry point: `src/i18n/index.ts`
- Locale files:
  - `src/i18n/locales/en.json`
  - `src/i18n/locales/fr.json`

Usage in a component:

```ts
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<Text>{t('postsList.title')}</Text>;
```

The Settings/Profile screen lets you switch language at runtime and persists the choice via i18next storage.

---

## 9. Notifications

### 9.1. Local notifications (Notifee)

When a post is created, the app calls `notifyNewPost` (in `src/services/notifications.ts`) which:

1. Ensures notification permissions are granted.
2. Creates a default Android channel (once).
3. Shows a notification like: “New post published: {title} – {body}…”.

This is mainly for UX and to show knowledge of Notifee / local notifications.

### 9.2. Firebase Cloud Messaging (FCM)

`src/services/pushNotifications.ts` exposes `initFCM`:

- Requests push permission
- Gets the **device FCM token** (logged in Metro)
- Sets listeners:
  - `onMessage` for foreground notifications
  - `onNotificationOpenedApp` for background → foreground taps
  - `getInitialNotification` for cold-start taps

On notification tap with a `data.postId` field, `navigateToPostFromNotification` deep-links to the correct post detail screen:

```ts
navigate('MainTabs', {
  screen: 'PostsTab',
  params: {
    screen: 'PostDetail',
    params: { id: postId },
  },
});
```

> Sending pushes is done from Firebase Console or a backend using the FCM REST API.  
> This project focuses on the **client-side integration + deep-link navigation**.

---

## 10. SQLite (optional extension)

The app is ready for a local persistence layer using SQLite (e.g. with `react-native-sqlite-storage` or `expo-sqlite`). The idea would be:

- Add a `db` helper under `src/services/db.ts`
- On app start, create a `posts` table if not exists
- When `addPost` is dispatched, persist to SQLite
- On app launch, hydrate Redux from SQLite

This is intentionally left as an extension to keep the core demo focused and readable.

---

## 11. Login & profile (lightweight)

The current version includes:

- A simple “Login” flow (email + password inputs, mocked auth)
- A basic “Profile” screen showing fake user data and language toggle

The goal is to showcase screen composition, form handling, and navigation – **not** full auth or secure session management.

In a real app, you’d plug this into:

- Firebase Auth, or
- A custom backend with JWT / OAuth2, etc.

---

## 12. Scripts

Common scripts (check `package.json` for full list):

```bash
# Start Metro bundler
npm run start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type-check
npm run typecheck

# Lint
npm run lint
```
