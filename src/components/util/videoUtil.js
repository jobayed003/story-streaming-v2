import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase.config';

export const fetchVideos = async (quer) => {
  let videos = [];

  const collectionRef = collection(db, 'series');

  // const q = query(collectionRef, where('type', '==', quer));

  onSnapshot(collectionRef, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      videos.push({ ...doc.data() });
    });
  });

  return videos;
};

fetchVideos();

export const getSeriesData = async (id) => {
  const seriesRef = doc(db, 'series', id);
  const seriesSnap = await getDoc(seriesRef);

  if (seriesSnap.exists()) {
    return seriesSnap.data();
  }
};

export const updateSeries = async (id, updatedDetails) => {
  const seriesRef = doc(db, 'series', id);

  await updateDoc(seriesRef, {
    ...updatedDetails,
  });
};

export const getVideoUrls = (videos) => {
  let videoUrl = [];
  videos.forEach((el) => {
    videoUrl.push(el.episodes[0].url);
    // el.episodes.forEach((item) => videoUrl.push(item.url));
  });
  return videoUrl;
};
