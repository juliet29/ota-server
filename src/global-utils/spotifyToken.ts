let spotifyAccessToken = "";

export const setSpotifyAccessToken = (s: string) => {
  spotifyAccessToken = s;
};

export const getSpotifyAccessToken = () => {
  return spotifyAccessToken;
};
