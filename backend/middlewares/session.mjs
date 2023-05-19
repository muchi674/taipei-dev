import mongoDBClient from "../utils/mongoDBClient.mjs";
import { HttpError } from "../utils/httpError.mjs";

async function createSession(req, res, next) {
  const { googleIdTokenPayload } = req;
  let sessionId;

  try {
    const bakiAuctionsDB = mongoDBClient.db("bakiAuctionsDB");
    const sessions = bakiAuctionsDB.collection("sessions");
    const result = await sessions.insertOne({
      userId: googleIdTokenPayload["sub"],
      createdAt: new Date(),
    });

    sessionId = result.insertedId;
  } catch (error) {
    return next(new HttpError("Cannot Create Session", 500));
  }

  /*
  session doc is expired 1 hr after its createdAt value;
  cookie expires in 59 minutes.
  */

  res
    .status(201)
    .cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 59 * 60 * 1000,
      secure: true,
      signed: true,
      sameSite: "none",
    })
    .send();
}

async function verifySession(req, res, next) {
  /*
  This middleware should only be called against user requests
  for protected (i.e. requires authorization) resources.
  */
  const sessionId = req.signedCookies.sessionId;

  if (sessionId === false) {
    return next(new HttpError("Tampered sessionId", 401));
  }

  if (typeof sessionId === "undefined") {
    return next(new HttpError("Missing sessionId", 401));
  }

  try {
    const bakiAuctionsDB = mongoDBClient.db("bakiAuctionsDB");
    const sessions = bakiAuctionsDB.collection("sessions");
    const session = await sessions.findOne(
      { _id: sessionId },
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
    const bakiAuctionsDB = mongoDBClient.db("bakiAuctionsDB");
    const sessions = bakiAuctionsDB.collection("sessions");
    await sessions.deleteOne({ _id: sessionId });
  } catch (error) {
    return next(new HttpError("Cannot Sign Out", 500));
  }

  res.clearCookie("sessionId", {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    signed: true,
    sameSite: "none",
  });
}

export { createSession, verifySession, deleteSession };
