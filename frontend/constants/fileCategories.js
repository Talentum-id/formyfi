export const image = 'image';
export const video = 'video';
export const audio = 'audio';

export const fileCategories = [
  image,
  video,
  audio,
];

export const fileExtensions = type => {
  switch (type) {
    case audio:
      return '.mp3, .wav, .aac, .flac, .m4a';
    case video:
      return '.mp4, .mkv, .avi, .mov, .webm';
    default:
      return '.jpeg, .png, .jpg, .gif, .svg';
  }
};