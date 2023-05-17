import { randomBytes } from "crypto";

function getCSRFToken(req, res, next) {
  let csrfToken;

  try {
    csrfToken = randomBytes(16).toString("base64");
  } catch (error) {
    return next(new HttpError("Failed to Generate CSRF Token", 500));
  }

  res
    .cookie("csrfToken", csrfToken, {
      encode: String,
      httpOnly: true,
      maxAge: 59 * 60 * 1000,
      secure: true,
      signed: true,
      sameSite: "none",
    })
    .json({ csrfToken });
}

export { getCSRFToken };
