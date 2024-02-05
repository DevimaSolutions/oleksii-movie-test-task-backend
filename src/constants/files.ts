const fileConstants = {
  filePng: "image/png",
  fileJpeg: "image/jpeg",
  fileJpg: "image/jpg",
  fileWebp: "image/webp",
  fileGif: "image/gif",
  mediaSize: 1024 * 1024 * 8,
  videoSize: 1024 * 1024 * 500,
  imageSize: 1024 * 1024 * 8,
  fileSize: 1024 * 1024 * 3,
  videoMimeTypesRegexp: `^.*.(mp4|webm|quicktime)$`,
  mediaMimeTypesRegexp: `^.*.(jpg|jpeg|png|gif|webp|heic|heif|mp4|webm|quicktime)|application\/octet-stream$`,
  imageMimeTypesRegexp: `^.*.(jpg|jpeg|png|gif|webp|heic|heif)|application\/octet-stream$`,
  fileMimeTypesRegexp: `^.*.(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|pdf)$`,
  heicMimeTypes: ["image/heic", "image/heif", "application/octet-stream"],
};

export default fileConstants;
