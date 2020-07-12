import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";
import { verify } from "jsonwebtoken";
import "reflect-metadata";
import SpotifyWebApi from "spotify-web-api-node";
import { User } from "./entity/User";
import { SpotifyDataSource } from "./modules/spotify/SpotifyRestDataSource";
import { createAccessToken, createRefreshToken } from "./global-utils/auth";
import { CreateSchema } from "./global-utils/createSchema";
import { createTypeormConnection } from "./global-utils/createTypeormConn";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from "./global-utils/secrets";
import { sendRefreshToken } from "./global-utils/sendRefreshToken";

export const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
});

const main = async () => {
  const app = Express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:19006", // where the app will be hosted TODO: change this for expo
    })
  );
  const port = process.env.PORT || 4000;

  const url =
    process.env.NODE_ENV === "production"
      ? "https://peaceful-oasis-92942.herokuapp.com/graphql"
      : `http://localhost:${port}/graphql`;

  app.use(cookieParser());

  ////////// HOME PAGE ///////////////
  app.get("/", (_req, res) =>
    res.send(`Welcome to the OnTheAuxServer. GraphQL playground is at ${url}`)
  );

  ////////// REFRESH TOKEN FOR USER AUTH ///////////////
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, "REFRESH_TOKEN_SEC");
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    //TODO versions
    // token is valid, send back an access token
    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  ////////// SPOTIFY CLIENT CREDENTIALS AUTH ///////////////

  //Retrieve an access token.
  const spotifyGrantCredentials = () => {
    spotifyApi.clientCredentialsGrant().then(
      function (data) {
        console.log("NEW SPOTIFY ACCESS TOKEN RECIEVED");
        // console.log("The access token expires in " + data.body["expires_in"]);
        // console.log("The access token is " + data.body["access_token"]);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body["access_token"]);
      },
      function (err) {
        console.warn("FAILURE TO GET NEW ACCESS TOKEN", err);
      }
    );
  };

  // get a new access token on starting the server
  spotifyGrantCredentials();

  // get a new access token after half an hour
  setInterval(spotifyGrantCredentials, 1.8e6);

  ////////// SET UP THE REST OF THE SERVER ///////////////

  // connect to postgresql database, run migrations if needed
  const conn = await createTypeormConnection();
  await conn.runMigrations({
    transaction: "each",
  });
  console.log("ran migrations");

  // create schema for Apollo from resolvers
  const schema = await CreateSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    dataSources: () => ({
      SpotifyAPI: new SpotifyDataSource(),
    }),
    introspection: true,
    playground: true,
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log(`server started on ${url}`);
  });
};

main();
