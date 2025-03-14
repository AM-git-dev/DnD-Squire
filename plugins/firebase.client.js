import { defineNuxtPlugin } from '#app';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
let db = null;

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId
  };

  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  nuxtApp.provide('firebaseDb', db);
});
export { db };