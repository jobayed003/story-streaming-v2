import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

export const updateUserDoc = async (id, payload) => {
  const userRef = doc(db, 'users', id);

  await updateDoc(userRef, payload);
};
