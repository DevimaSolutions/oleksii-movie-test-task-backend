const s3Folders = {
  imagesFolder: "images/",
  movieImageFolder: (movieId: string) =>
    `${s3Folders.imagesFolder}posters/${movieId}/`,
};

export default s3Folders;
