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
  REFRESH_TOKEN_SECRET,
} from "./global-utils/secrets";
import { sendRefreshToken } from "./global-utils/sendRefreshToken";
import { facebookStrategy } from "./global-utils/facebookPassport";

import passport from "passport";

export const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
});

const port = process.env.PORT || 4000;

const url =
  process.env.NODE_ENV === "production"
    ? "https://peaceful-oasis-92942.herokuapp.com"
    : `http://localhost:${port}`;

const redirectUrl =
  process.env.NODE_ENV === "production"
    ? "exp://192.168.0.27:19000"
    : "http://localhost:19006";

const main = async () => {
  const app = Express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:19006", // where the app will be hosted TODO: change this for expo
    })
  );

  app.use(cookieParser());

  ////////// HOME PAGE ///////////////
  app.get("/", (_req, res) =>
    res.send(
      `Welcome to the OnTheAuxServer. GraphQL playground is at ${url}/graphql`
    )
  );

  ////////// REFRESH TOKEN FOR USER AUTH ///////////////
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    console.log("\n");
    // console.log(
    //   `THIS REQUEST: ${token} THIS REQUEST2: ${req.cookies}
    //  `
    // );
    if (req) {
      console.log("token", token);
      console.log("\n");
      console.log("cookies", req.cookies);
    }

    console.log("\n");

    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, REFRESH_TOKEN_SECRET);
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

  ////////// FACEBOOK OAUTH ///////////////
  passport.use("FacebookStrategy", facebookStrategy);

  app.use(passport.initialize());

  app.get("/auth/facebook", passport.authenticate("FacebookStrategy"));

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("FacebookStrategy", { session: false }),
    (req, res) => {
      console.log((req.user as any).id);
      // (req.session as any).userId = (req.user as any).id;
      // @todo redirect to frontend
      res.redirect(redirectUrl);
    }
  );

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
  await conn.runMigrations();
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
    console.log(`server started on ${url}/graphql`);
  });
};

main();
