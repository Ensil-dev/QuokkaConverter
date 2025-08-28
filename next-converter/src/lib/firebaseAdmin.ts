export function getDb() {
  try {
    const app = eval('require')('firebase-admin/app');
    const firestore = eval('require')('firebase-admin/firestore');
    if (!app.getApps().length) {
      const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (!key) return null;
      app.initializeApp({ credential: app.cert(JSON.parse(key)) });
    }
    return firestore.getFirestore();
  } catch {
    return null;
  }
}
