import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { getSpotifyAccessToken } from "../../utils-global/spotifyToken";

// get access token
let spotifyAccessToken = getSpotifyAccessToken();

export class SpotifyDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.spotify.com/v1/";
  }

  async getArtist(id: string) {
    return this.get(`artists/${id}`);
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set("Authorization", `Bearer ${spotifyAccessToken}`);
  }
}
