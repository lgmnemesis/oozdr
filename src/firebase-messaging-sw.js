// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBIc6xJd9MopPMgCATSHz4VLAUIsIyJae0",
  authDomain: "reconnect-i.firebaseapp.com",
  databaseURL: "https://reconnect-i.firebaseio.com",
  projectId: "reconnect-i",
  storageBucket: "reconnect-i.appspot.com",
  messagingSenderId: "15338544369",
  appId: "1:15338544369:web:870238a038bbc520561d50",
  measurementId: "G-XPLGQ5LX96"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();