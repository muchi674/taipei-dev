import { OAuth2Client } from "google-auth-library";

import db from "../db/conn.mjs";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: error.message };
  }
}

async function insertOrUpdate(user) {
  const query = { _id: user["sub"] };
  const update = {
    $set: {
      family_name: user["family_name"],
      given_name: user["given_name"],
    },
  };
  const options = { upsert: true };
  let succeeded;

  try {
    await db.collection("users").updateOne(query, update, options);
    succeeded = true;
  } catch (error) {
    succeeded = false;
  }

  return succeeded;
}

async function signIn(req, res, next) {}

export { signIn };
