export const getYoutubeId = (url: string): string | null => {
  const m = url.match(/(?:shorts\/|youtu\.be\/|embed\/|[?&]v=)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};
