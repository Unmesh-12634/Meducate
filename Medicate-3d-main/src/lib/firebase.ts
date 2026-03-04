import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1vUrZqzJgEHmChJI0QqRCbOUVgG-MT1I",
    authDomain: "meducate-3d.firebaseapp.com",
    projectId: "meducate-3d",
    storageBucket: "meducate-3d.firebasestorage.app",
    messagingSenderId: "337525336234",
    appId: "1:337525336234:web:f78ed586dbbd89e49bc8d3",
    measurementId: "G-074W3EJ4PL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let analytics: any;
// Analytics often requires cookies/storage. In restricted envs (incognito), this throws.
// We strictly catch it to prevent app crash.
try {
    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
} catch (e) {
    console.warn("Analytics disabled due to restricted storage context:", e);
}

// Initialize Firebase Authentication with fallback persistence
import { initializeAuth, browserLocalPersistence, inMemoryPersistence, browserPopupRedirectResolver } from "firebase/auth";

let persistence = browserLocalPersistence;
try {
    // Try to write to localStorage to see if it's available
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
} catch (e) {
    console.warn("Storage restricted, falling back to in-memory persistence for Auth.");
    persistence = inMemoryPersistence;
}

// browserPopupRedirectResolver is required for signInWithPopup to work.
// Without it, Firebase throws auth/argument-error when the popup is attempted.
export const auth = initializeAuth(app, {
    persistence,
    popupRedirectResolver: browserPopupRedirectResolver,
});
