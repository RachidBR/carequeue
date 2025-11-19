import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Collection helper (so we don’t repeat the string everywhere)
export const postsCollection = () => firestore().collection('posts');

// Optional: helper to get a new post ref with an ID
export const newPostDoc = () => postsCollection().doc();

// Storage path for post images
export const postImageRef = (postId: string) =>
    storage().ref(`postImages/${postId}.jpg`);