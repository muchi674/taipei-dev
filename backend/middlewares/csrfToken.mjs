import { randomBytes } from "crypto";

import { HttpError } from "../utils/httpError.mjs";

function createCSRFToken(req, res, next) {
  let csrfToken;

  try {
    csrfToken = randomBytes(16).toString("base64");
  } catch (error) {
    return next(new HttpError("Cannot Generate CSRF Token", 500));
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

function verifyCSRFToken(req, res, next) {
  const cookieCSRFToken = req.signedCookies.csrfToken;
  const headerCSRFToken = req.get("X-CSRF-Token");

  if (cookieCSRFToken === false) {
    /*
    FROM https://www.npmjs.com/package/cookie-parser
    Signed cookies that fail signature validation
    will have the value false instead of the tampered value
    */
    return next(new HttpError("Tampered CSRF Token", 401));
  }

  if (!cookieCSRFToken || !headerCSRFToken) {
    return next(new HttpError("Missing CSRF Token", 401));
  }

  if (cookieCSRFToken !== headerCSRFToken) {
    return next(new HttpError("Invalid CSRF Token", 401));
  }

  next();
}

export { createCSRFToken, verifyCSRFToken };
