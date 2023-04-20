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

const getVideoUrls = (videos) => {
  let videoUrl = [];

  videos.forEach((el) => {
    el.episodes.forEach((item) => videoUrl.push(item.url));
  });

  return videoUrl;
};

export const getThumbnails = (videos, size) => {
  let video, results;
  let img = [];

  const videoUrls = getVideoUrls(videos);

  videoUrls.forEach((url) => {
    const getThumb = () => {
      if (url === null) {
        return '';
      }
      size = size === null ? 'big' : size;
      results = url.match('[\\?&]v=([^&#]*)');
      video = results === null ? url : results[1];

      if (size === 'small') {
        return 'http://img.youtube.com/vi/' + video + '/2.jpg';
      }
      return 'http://img.youtube.com/vi/' + video + '/0.jpg';
    };
    img.push(getThumb());
  });
  return img;
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
