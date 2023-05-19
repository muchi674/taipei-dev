import { OAuth2Client } from "google-auth-library";

import { HttpError } from "../utils/httpError.mjs";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function verifyGoogleIdToken(req, res, next) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID,
    });
    req.googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    return next(new HttpError("Authentication Failed", 401));
  }

  next();
}

export { verifyGoogleIdToken };
