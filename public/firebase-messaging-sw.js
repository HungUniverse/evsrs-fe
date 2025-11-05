importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCZK9kR0_KVYt4GXG765GnDGVuMDUJmtQ4",
  authDomain: "evsrs-fe.firebaseapp.com",
  projectId: "evsrs-fe",
  storageBucket: "evsrs-fe.firebasestorage.app",
  messagingSenderId: "336922402305",
  appId: "1:336922402305:web:341b01db8a5324609a6a00",
  measurementId: "G-J5FQ5CQDQW",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

console.log("[firebase-messaging-sw.js] Service Worker initialized");
