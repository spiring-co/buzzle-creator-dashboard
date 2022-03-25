importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDgOaSoXj1mz4U-BiIROG4EQL1h2TrjrUE",
    authDomain: "buzzle-dev.firebaseapp.com",
    projectId: "buzzle-dev",
    storageBucket: "buzzle-dev.appspot.com",
    messagingSenderId: "645987891897",
    appId: "1:645987891897:web:70215e856e7ef9e3e87968"
});
let messaging = null;
if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notification here
        const notificationTitle = 'Message Alert';
        const notificationOptions = {
            body: payload.data.title,
        };

        self.registration.showNotification(notificationTitle,
            notificationOptions);
    });
}
