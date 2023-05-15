import db from "../utils/dbConn.mjs";
import { getSignedInToken } from "../utils/signedInToken.mjs";
import { HttpError } from "../utils/httpError.mjs";
import { verify } from "../utils/googleIdToken.mjs";

async function signIn(req, res, next) {
  const verificationResponse = await verify(req.body.credential);

  if ("error" in verificationResponse) {
    return next(new HttpError("Authentication Failed", 401));
  }

  const { payload } = verificationResponse;
  const query = { _id: payload["sub"] };
  const update = {
    $set: {
      email: payload["email"],
      family_name: payload["family_name"],
      given_name: payload["given_name"],
      picture: payload["picture"],
    },
  };
  const options = { upsert: true };

  try {
    await db.collection("users").updateOne(query, update, options);
  } catch (error) {
    return next(new HttpError("Sign In/Up Failed", 500));
  }

  const authorizationResponse = getSignedInToken(payload["sub"]);

  if ("error" in authorizationResponse) {
    return next(new HttpError("Authorization Failed", 500));
  }

  res.json({
    userId: payload["sub"],
    token: authorizationResponse["token"],
  });
}

export { signIn };
