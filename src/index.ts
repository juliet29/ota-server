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
  // refresh token page
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

  // SPOTIFY AUTH!!!!!!!!!!!!//////
  console.log(`spot id: ${SPOTIFY_CLIENT_ID}`);

  passport.use(
    new SpotifyStrategy(
      {
        clientID: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/spotify/callback/",
      },
      function (
        accessToken: any,
        refreshToken: any,
        expires_in: any,
        profile: any,
        done: any
      ) {
        console.log(accessToken, refreshToken, expires_in);
        // asynchronous verification, for effect...
        process.nextTick(function () {
          return done(null, profile);
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
      res.redirect("/");
    }
  );

  // create schema for Apollo from resolvers
  const schema = await CreateSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
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
