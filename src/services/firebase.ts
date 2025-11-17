import {  initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

let app = null;


export const initFirebase = () => {
    // if (app) return app;
    // // Place your Firebase config in native files (GoogleService-Info.plist / google-services.json)
    // // JS initializeApp() will use them automatically with RNFB.
    // app =  initializeApp();


    // // Optional: iOS permission prompt deferred to Notifee step
    // messaging().setAutoInitEnabled(true);
    // return app;
};