import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import { getSpotifyAccessToken } from "../../utils-global/spotifyToken";

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

  willSendRequest(request: RequestOptions) {
    const spotifyAccessToken = getSpotifyAccessToken();
    const tempToken =
      "BQDmiLdd_VB7pNpGqzDqTkxVxw59TWmTrBFpwjRqYn3S0ng_bSaHVmm-Ou8ACvbSfkvLe1LLPAyDVpenii5nut6dkh4xXFOLUOQ1Fx3tIXqVvk6FmxID8CNnPAsNGhecXUZUPyu_sQr8jFI";
    console.log("applying middleware...", spotifyAccessToken);
    console.log("applying middleware for real...", tempToken);
    request.headers.set("Authorization", `Bearer ${spotifyAccessToken}`);
  }
}
