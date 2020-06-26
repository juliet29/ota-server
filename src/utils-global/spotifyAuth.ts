// import * as passport from "passport";
// import { Strategy } from "passport-spotify";
// import { app } from "../index";

// export const SpotifyAuth = () => {
//   passport.use(
//     new Strategy(
//       {
//         clientID: process.env.SPOTIFY_CLIENT_ID as string,
//         clientSecret: process.env.SPOTIFY__CLIENT_SECRET as string,
//         callbackURL: "http://localhost:4000/auth/spotify/callback",
//       },

//       function (profile) {
//         console.log(profile);
//         /// hello
//       }
//     )
//   );

//   app.use(passport.initialize());

//   app.get("/auth/spotify", passport.authenticate("spotify"), function (
//   ) {
//     // The request will be redirected to spotify for authentication, so this
//     // function will not be called.
//   });

//   app.get(
//     "/auth/spotify/callback",
//     passport.authenticate("spotify", { session: false }),
//     function (res) {
//       // Successful authentication, redirect home.
//       res.redirect("/");
//     }
//   );
// };
