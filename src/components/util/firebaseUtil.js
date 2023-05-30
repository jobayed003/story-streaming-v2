import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { db } from '../../firebase.config';

export const getAllAvatar = async (avatarName) => {
  const storage = getStorage();
  let imageUrls = [];

  const images = ['avatar_1.png', 'avatar_2.png', 'avatar_3.png', 'avatar_4.png', 'avatar_5.png'];

  images.forEach(async (img) => {
    const imgRef = ref(storage, `avatar/${img}`);
    const url = getDownloadURL(imgRef);
    imageUrls.push(url);
  });
  return await Promise.all(imageUrls);
};

export const updateUserDoc = async (id, payload) => {
  const userRef = doc(db, 'users', id);

  await updateDoc(userRef, payload);
};
