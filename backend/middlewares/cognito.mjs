import {
  CognitoIdentityClient,
  GetOpenIdTokenForDeveloperIdentityCommand,
  DeleteIdentitiesCommand,
} from "@aws-sdk/client-cognito-identity";

import { users } from "../utils/mongoDB.mjs";
import { HttpError } from "../utils/httpError.mjs";

const region = process.env.AWS_REGION;
const identityPoolId = process.env.COGNITO_IDENTITY_POOL_ID;
const client = new CognitoIdentityClient({ region });

async function getCognitoIdAndToken(req, res, next) {
  const { userId } = req.session;
  const input = {
    IdentityPoolId: identityPoolId, // required
    Logins: {
      bakiAuctions: userId,
    },
    TokenDuration: 60 * 60, // seconds
  };
  const command = new GetOpenIdTokenForDeveloperIdentityCommand(input);
  let response;

  try {
    response = await client.send(command);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Cannot Get Cognito Id and Token", 500));
  }

  try {
    await users.updateOne(
      { _id: userId },
      { $set: { cognitoId: response.IdentityId } }
    );
  } catch (error) {
    return next(new HttpError("Cannot Update User's CognitoId", 500));
  }

  res.json({
    cognitoIdentityId: response.IdentityId,
    cognitoToken: response.Token,
  });
}

async function deleteCognitoIdentity(req, res, next) {
  const { userId } = req.session;
  let user;

  try {
    user = await users.findOne({ _id: userId }, { _id: 0, cognitoId: 1 });
  } catch (error) {
    return next(new HttpError("Cannot Find User", 500));
  }

  if (!("cognitoId" in user)) {
    return next();
  }

  const input = { IdentityIdsToDelete: [user.cognitoId] };
  const command = new DeleteIdentitiesCommand(input);

  try {
    const response = await client.send(command);

    console.log(response);
    if (
      "UnprocessedIdentityIds" in response &&
      response.UnprocessedIdentityIds.length > 0
    ) {
      throw new Error("AWS Error: Deletion Unprocessed");
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError("Cannot Delete Cognito Identity", 500));
  }

  next();
}

export { getCognitoIdAndToken, deleteCognitoIdentity };
