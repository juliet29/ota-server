import { Strategy } from "passport-facebook";
import { User } from "../entity/User";
import { getRepository } from "typeorm";
// import { url } from "../index";

export const FACEBOOK_APP_ID = "1647259942119049";
export const FACEBOOK_APP_SECRET = "068706050958c7751f2c9315b9fa5214";

const facebookCallbackUrl =
  process.env.NODE_ENV === "production"
    ? "https://peaceful-oasis-92942.herokuapp.com/auth/facebook/callback"
    : "http://localhost:4000/auth/facebook/callback";

export const facebookStrategy = new Strategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: facebookCallbackUrl,
    profileFields: ["id", "displayName", "photos", "email"],
  },
  async (_, __, profile, cb) => {
    const { id, displayName, emails } = profile;

    // see if there is a user w this id is in the db
    const query = getRepository(User)
      .createQueryBuilder("user")
      .where("user.facebookId = :id", { id });

    let email: string | null = null;

    // conditionally see if this email exists in the db
    if (emails) {
      email = emails[0].value;
      query.orWhere("user.email = :email", { email });
    }

    let user = await query.getOne();

    if (!user) {
      // this user needs to be registered
      user = await User.create({
        facebookId: id,
        username: displayName,
        email,
      }).save();
    } else if (!user.facebookId) {
      // merge account
      // we found user by email -> never clicked on sign in w FB, but do have account
      user.facebookId = id;
      await user.save();
    } else {
      // we have a facebookId
      // login
    }

    return cb(null, { id: user.id });
  }
);
