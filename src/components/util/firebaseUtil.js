import { getDownloadURL, getStorage, ref } from 'firebase/storage';

// export const getAllAvatar =async () => {
//   const storage = getStorage();
//   let imageUrls = [];

//   const images = ['avatar_1.png', 'avatar_2.png', 'avatar_3.png', 'avatar_4.png', 'avatar_5.png'];

//   //   Promise.all(
//   //     images.map((img) =>
//   //       getDownloadURL(ref(storage, `avatar/${img}`)).then((url) => imageUrls.push(url))
//   //     )
//   //   );
//   //   //   images.map((img) => {
//   //   //     getDownloadURL(ref(storage, `avatar/${img}`))
//   //   //       .then((url) => {
//   //   //         imageUrls.push(url);
//   //   //         // console.log(imageUrls);
//   //   //         return imageUrls;
//   //   //       })
//   //   //       .catch((error) => {
//   //   //         // Handle any errors
//   //   //   console.log(imag);

//   //   //   });

//   //   return imageUrls;

//   images.map( (img) => {
//       const imgRef = ref(storage, `avatar/${img}`);
//       const urls = await getDownloadURL(imgRef)
//     imageUrls.push(urls);
//   });
//   return imageUrls;
// };
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

const getImgUrl = async (img) => {
  const storage = getStorage();
  const imgRef = ref(storage, `avatar/${img}`);
  const imgUrl = await getDownloadURL(imgRef);
  return imgUrl;
  // .then((url) => {
  //   // This can be downloaded directly:
  //   // const xhr = new XMLHttpRequest();
  //   // xhr.responseType = 'blob';
  //   // xhr.onload = (event) => {
  //   //   const blob = xhr.response;
  //   // };
  //   // xhr.open('GET', url);
  //   // xhr.send();

  //   imgUrl = url;
  // })
  // .catch((error) => {});
};
