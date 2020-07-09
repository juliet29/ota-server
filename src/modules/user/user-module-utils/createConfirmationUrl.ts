// // create confirmation URL that the user will have to click on in their email
// // to show that they actually own that email
// import { v4 } from "uuid";
// import { redis } from "../../global-utils/redis";
// import { confirmUserPrefix } from "../constants/redisPrefixes";

// export const createConfirmationUrl = async (userId: number) => {
//   const token = v4();
//   await redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24); // 1 day
//   // TODO need to fix not real
//   return `http://localhost:4000/user/confirm/${token}`;
// };
