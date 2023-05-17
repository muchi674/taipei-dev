import client from "../utils/mongoDBClient.mjs";
import { HttpError } from "../utils/httpError.mjs";
import { verify } from "../utils/googleIdToken.mjs";

async function signIn(req, res, next) {
  const verificationResponse = await verify(req.body.credential);

  if ("error" in verificationResponse) {
    return next(new HttpError("Authentication Failed", 401));
  }

  const { payload } = verificationResponse;
  const session = client.startSession();
  let signedInSessionId;

  try {
    session.startTransaction();

    const bakiAuctionsDB = client.db("bakiAuctionsDB");

    await bakiAuctionsDB.collection("users").updateOne(
      { _id: payload["sub"] },
      {
        $set: {
          email: payload["email"],
          family_name: payload["family_name"],
          given_name: payload["given_name"],
          picture: payload["picture"],
        },
      },
      { session: session, upsert: true }
    );
    const sessionInsertionResult = await bakiAuctionsDB
      .collection("sessions")
      .insertOne(
        { userId: payload["sub"], createdAt: new Date() },
        { session }
      );
    signedInSessionId = sessionInsertionResult.insertedId;

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return next(new HttpError("Sign In/Up Failed", 500));
  } finally {
    await session.endSession();
  }

  res
    .status(201)
    .cookie("sessionId", signedInSessionId, {
      httpOnly: true,
      maxAge: 59 * 60 * 1000,
      secure: true,
      signed: true,
      sameSite: "none",
    })
    .send();
}

export { signIn };
