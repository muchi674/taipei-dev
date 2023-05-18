import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function verifyGoogleIdToken(token) {
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

export { verifyGoogleIdToken };
