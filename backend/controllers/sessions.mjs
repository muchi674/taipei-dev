import { ObjectId } from "mongodb";

import { sessions } from "../utils/mongoDB.mjs";
import { HttpError } from "../utils/httpError.mjs";

async function createSession(req, res, next) {
  const { googleIdTokenPayload } = req;
  const creationDate = new Date();
  let sessionId;

  try {
    const result = await sessions.insertOne({
      userId: googleIdTokenPayload["sub"],
      createdAt: creationDate,
    });

    sessionId = result.insertedId;
  } catch (error) {
    return next(new HttpError("Cannot Create Session", 500));
  }

  /*
  session doc is expired 1 hr after its createdAt value;
  cookie expires in 59 minutes.
  */

  const cookieExpirationDate = new Date(
    creationDate.getTime() + 59 * 60 * 1000
  );

  res
    .status(201)
    .cookie("sessionId", sessionId, {
      httpOnly: true,
      expires: cookieExpirationDate,
      secure: true,
      signed: true,
      sameSite: "none",
    })
    .json({ signOutDate: cookieExpirationDate });
}

async function verifySession(req, res, next) {
  const sessionId = req.signedCookies.sessionId;

  if (sessionId === false) {
    return next(new HttpError("Tampered sessionId", 401));
  }

  if (typeof sessionId === "undefined") {
    return next(new HttpError("Missing sessionId", 401));
  }

  try {
    const session = await sessions.findOne(
      { _id: new ObjectId(sessionId) },
      { _id: 0, userId: 1 }
    );

    if (session === null) {
      return next(new HttpError("Session Expired", 401));
    }

    req.session = session;
  } catch (error) {
    return next(new HttpError("Cannot Verify Session", 500));
  }

  next();
}

async function deleteSession(req, res, next) {
  const sessionId = req.signedCookies.sessionId;

  if (sessionId === false) {
    return next(new HttpError("Tampered sessionId", 401));
  }

  if (typeof sessionId === "undefined") {
    return res.json({
      message: "Missing sessionId Cookie. Could Already be Expired",
    });
  }

  try {
    await sessions.deleteOne({ _id: new ObjectId(sessionId) });
  } catch (error) {
    return next(new HttpError("Cannot Sign Out", 500));
  }

  next();
}

function unsetSessionIdCookie(req, res, next) {
  res.clearCookie("sessionId", {
    httpOnly: true,
    expires: new Date(),
    secure: true,
    signed: true,
    sameSite: "none",
  });

  next();
}

export { createSession, verifySession, deleteSession, unsetSessionIdCookie };
