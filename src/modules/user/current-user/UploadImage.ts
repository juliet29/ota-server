import { AuthenticationError } from "apollo-server-express";
import { Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../../../entity/User";
import { MyContext } from "../../../types/MyContext";
import { isAuth } from "../../middleware/isAuth";

// scalar Upload

// @ObjectType()
// export class Upload {
//   @Field()
//   path: string;

//   @Field()
//   filename: string;

//   @Field()
//   mimetype: string;
// }

// @InputType()
// export class UploadPictureInput {
//   @Field(() => Upload)
//   upload: Upload;
// }

// const storeUpload = async (stream: any, mimetype: string): Promise<any> => {
//   // aseq2
//   const extension = mimetype.split("/")[1];
//   const id = `${shortid.generate()}.${extension}`;
//   const path = `images/${id}`;

//   return new Promise((resolve, reject) =>
//     stream
//       .pipe(createWriteStream(path))
//       .on("finish", () => resolve({ id, path }))
//       .on("error", reject)
//   );
// };

// const processUpload = async (upload: Upload) => {
//   const { path: stream, mimetype } = await upload;
//   const { id } = await storeUpload(stream, mimetype);
//   return id;
// };

@Resolver()
export class UploadImageResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async uploadImage(
    // @Arg("data") data: UploadPictureInput,
    @Ctx() ctx: MyContext
  ) {
    // get the user from the context
    const user = await User.findOne(ctx.payload?.userId)!;

    if (!user) {
      throw new AuthenticationError("User not found");
    }
    // const pictureUrl = await processUpload(data.upload);
    // console.log(pictureUrl);

    // user.profilePicture = pictureUrl;

    // User.save(user);
  }

  //end of resolver
}
