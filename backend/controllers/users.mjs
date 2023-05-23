import { mongoDBClient, users, sessions } from "../utils/mongoDB.mjs";
import { HttpError } from "../utils/httpError.mjs";

async function createUser(req, res, next) {
  const { googleIdTokenPayload } = req;

  try {
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

async function deleteUser(req, res, next) {
  /*
  Wraps
  1. deleting a user
  2. deleting that user's sessions
  in a transaction because a session references a user
  */

  const { userId } = req.session;
  const session = mongoDBClient.startSession();

  try {
    session.startTransaction();

    await users.deleteOne({ _id: userId }, { session });
    await sessions.deleteMany({ userId }, { session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return next(new HttpError("Cannot Delete User and Their Sessions", 500));
  } finally {
    await session.endSession();
  }

  next();
}

export { createUser, deleteUser };
