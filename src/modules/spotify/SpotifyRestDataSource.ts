import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
// import { getSpotifyAccessToken } from "../../utils-global/spotifyToken";
import { spotifyApi } from "../../index";

// get access token
// let spotifyAccessToken = getSpotifyAccessToken();

export class SpotifyDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.spotify.com/v1/";
  }

  async getArtist(id: string) {
    return this.get(`artists/${id}`);
  }

  async search(query: string, type: string) {
    console.log(query);
    return this.get(`search?q=${query}&type=${type}&limit=5`);
  }

  willSendRequest(request: RequestOptions) {
    const spotifyAccessToken = spotifyApi.getAccessToken();
    spotifyAccessToken
      ? console.log("spotify access token exists, applying middleware...")
      : console.warn("no spotify access token");
    request.headers.set("Authorization", `Bearer ${spotifyAccessToken}`);
  }
}
