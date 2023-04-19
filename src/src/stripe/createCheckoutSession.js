import { addDoc, collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';

export async function createCheckoutSession(uid) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docRef = await addDoc(collection(db, `users/${uid}/checkout_sessions`), {
      price: 'price_1M8I6BBSRclYDGVloXcQLeKo',
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    onSnapshot(docRef, async (snap) => {
      const { error, url } = snap.data();
      if (error) {
        console.log(error.message);
      }
      if (url) {
        window.location.assign(url);
      }
    });
  }
}
