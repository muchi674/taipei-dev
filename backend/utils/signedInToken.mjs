import jwt from "jsonwebtoken";

function getSignedInToken(userId) {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { token };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

export { getSignedInToken };
