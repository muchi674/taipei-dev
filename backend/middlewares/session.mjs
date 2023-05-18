import mongoDBClient from "../utils/mongoDBClient.mjs";

async function verifySession(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (typeof sessionId === "undefined") {
    next();
  }

  const bakiAuctionsDB = mongoDBClient.db("bakiAuctionsDB");
  const sessions = bakiAuctionsDB.collection("sessions");
  const session = await sessions.findOne(
    { _id: sessionId },
    { _id: 0, userId: 1 }
  );

  if (session === null) {
    next();
  }

  req.session = session;

  next();
}

export { verifySession };
