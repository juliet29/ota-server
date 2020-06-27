import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";
import { CreateSchema } from "./utils-global/createSchema";
import { createTypeormConnection } from "./utils-global/createTypeormConn";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { sendRefreshToken } from "./utils-global/sendRefreshToken";
import { createRefreshToken, createAccessToken } from "./utils-global/auth";
// import * as passport from "passport";
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from "./utils-global/secrets";
import {
  setSpotifyAccessToken,
  getSpotifyAccessToken,
} from "./utils-global/spotifyToken";
import { SpotifyDataSource } from "./modules/spotify/SpotifyRestDataSource";

const main = async () => {
  const app = Express();
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:19006", // where the app will be hosted TODO: change this for expo
    })
  );
  app.use(cookieParser());
  // home page
  app.get("/", (_req, res) =>
    res.send("Welcome to the OnTheAuxServer. GraphQL playground is at /graphql")
  );
  ////////// REFRESH TOKEN ///////////////
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
    // token is valid, send back an access token
    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    //TODO versions
    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  // connect to postgresql database, run migrations if needed
  const conn = await createTypeormConnection();
  await conn.runMigrations();

  ////////// SPOTIFY AUTH!///////////////
  // const SpotifyAccessToken: string;

  const url =
    process.env.NODE_ENV === "production"
      ? "https://peaceful-oasis-92942.herokuapp.com"
      : "http://localhost:4000";

  passport.use(
    new SpotifyStrategy(
      {
        clientID: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET,
        callbackURL: `${url}/auth/spotify/callback/`,
      },
      function (
        accessToken: any,
        refreshToken: any,
        expires_in: any,
        profile: any,
        done: any
      ) {
        console.log(accessToken, refreshToken, expires_in);
        setSpotifyAccessToken(accessToken);

        // asynchronous verification, for effect...
        process.nextTick(function () {
          console.log("");
          return done(null, profile, accessToken);
        });
      }
    )
  );

  app.use(passport.initialize());

  app.get("/auth/spotify", passport.authenticate("spotify"), function () {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });

  app.get(
    "/auth/spotify/callback",
    passport.authenticate("spotify", { session: false }),
    async (_req, res) => {
      // give user a session
      // Successful authentication, redirect home.
      // check if we got that token...
      let quick_tok = getSpotifyAccessToken();
      console.log("spot acc is", quick_tok);
      res.redirect("/");
    }
  );

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

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`server started on  http://localhost:${port}/graphql`);
  });
};

main();
