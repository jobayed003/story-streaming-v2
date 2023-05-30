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

const getVideoDetails = async (url) => {
  const videoID = parseVideoIDFromYoutubeURL(url);
  const data = { error: '', epDetails: {} };

  const videoDetails = await fetch(
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoID}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
  ).then((res) => res.json());

  if (videoDetails.items.length > 0) {
    const { contentDetails, snippet } = videoDetails.items[0] || {};
    data.epDetails = {
      contentDetails,
      id: videoID,
      url,
      title: snippet.title,
      description: snippet.description,
      duration: ytDurationToSeconds(contentDetails.duration),
      thumbnail: snippet.thumbnails.standard.url,
    };

    return data;
  } else {
    data.error = 'Something went wrong! Check the url and try again';
    return data;
  }
};

// const getThumbnails = (urls, size) => {
//   let video, results;
//   let img = [];

//   urls.forEach((url) => {
//     const getThumb = () => {
//       if (url === null) {
//         return '';
//       }
//       size = size === null ? 'big' : size;
//       results = url.match('[\\?&]v=([^&#]*)');
//       video = results === null ? url : results[1];

//       if (size === 'small') {
//         return 'http://img.youtube.com/vi/' + video + '/2.jpg';
//       }
//       return 'http://img.youtube.com/vi/' + video + '/0.jpg';
//     };
//     img.push(getThumb());
//   });
//   return img;
// };
// const getThumbnail = (url, size) => {
//   let video, results;
//   let img = [];

//   const getThumb = () => {
//     if (url === null) {
//       return '';
//     }
//     size = size === null ? 'big' : size;
//     results = url.match('[\\?&]v=([^&#]*)');
//     video = results === null ? url : results[1];

//     if (size === 'small') {
//       return 'http://img.youtube.com/vi/' + video + '/2.jpg';
//     }
//     return 'http://img.youtube.com/vi/' + video + '/0.jpg';
//   };
//   // img.push(getThumb());

//   return getThumb();
// };

export {
  parseVideoIDFromYoutubeURL,
  ytDurationToSeconds,
  getVideoDetails,
  // getThumbnails,
  // getThumbnail,
};
