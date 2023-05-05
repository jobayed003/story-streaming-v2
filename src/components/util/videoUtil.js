import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
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

export const getDuration = (duration) => {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;
  let time = '';
  if (hrs > 0) {
    time += '' + hrs + 'h ' + (mins < 10 ? '0' : '');
  }
  time += '' + mins + 'm ' + (secs < 10 ? '0' : '');
  time += '' + secs + 's';

  return time;
};

// export const getVideoUrls = (videos) => {
//   return videos.map(
//     (el) => el.episodes[0].url // el.episodes.forEach((item) => videoUrl.push(item.url));
//   );
// };
