import mongoDBClient from "../utils/mongoDBClient.mjs";
import { HttpError } from "../utils/httpError.mjs";

async function createUser(req, res, next) {
  const { googleIdTokenPayload } = req;

  try {
    const bakiAuctionsDB = mongoDBClient.db("bakiAuctionsDB");
    const users = bakiAuctionsDB.collection("users");

    await users.updateOne(
      { _id: googleIdTokenPayload["sub"] },
      {
        $set: {
          email: googleIdTokenPayload["email"],
          family_name: googleIdTokenPayload["family_name"],
          given_name: googleIdTokenPayload["given_name"],
          picture: googleIdTokenPayload["picture"],
        },
      },
      { upsert: true }
    );
  } catch (error) {
    return next(new HttpError("Cannot Create User", 500));
  }

  next();
}

export { createUser };
