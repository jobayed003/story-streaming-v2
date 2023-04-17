import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase.config';

function parseVideoIDFromYoutubeURL(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

function ytDurationToSeconds(duration) {
  var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  match = match.slice(1).map(function (x) {
    if (x != null) {
      return x.replace(/\D/, '');
    }
  });
  var hours = parseInt(match[0]) || 0;
  var minutes = parseInt(match[1]) || 0;
  var seconds = parseInt(match[2]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

export { parseVideoIDFromYoutubeURL, ytDurationToSeconds };

export const fetchData = async (collecName) => {
  let data = [];
  const dataRef = await getDocs(collection(db, collecName));
  dataRef.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });

  return data;
};

export const updateUserRole = async (id, role) => {
  const userRef = doc(db, 'users', id);

  await updateDoc(userRef, {
    role: role,
  });
};

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
