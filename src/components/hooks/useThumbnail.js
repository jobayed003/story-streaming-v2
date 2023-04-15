const useThumbnail = (videoUrls, size) => {
  let video, results;
  let img = [];

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

export default useThumbnail;
