import { useContext, useMemo, useCallback } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";

import { AppContext } from "../context/AppContext";

const region = process.env.AWS_REGION;

function useS3({ userId, cognitoIdentityId, cognitoToken }) {
  const { setShowAlert, setAlertMessage } = useContext(AppContext);
  const client = useMemo(() => {
    return new S3Client({
      region,
      credentials: fromCognitoIdentity({
        identityId: cognitoIdentityId,
        logins: {
          "cognito-identity.amazonaws.com": cognitoToken,
        },
      }),
    });
  }, [cognitoIdentityId, cognitoToken]);

  const putObject = useCallback(
    async (file, lotId) => {
      const command = new PutObjectCommand({
        Bucket: "baki-auctions-taipei-dev",
        Key: `user-data/${userId}/${lotId}/${file.name}`,
        Body: file,
      });

      try {
        await client.send(command);
      } catch (error) {
        setShowAlert(true);
        setAlertMessage(`Cannot upload ${file.name} to s3`);
        throw error;
      }
    },
    [userId, client, setShowAlert, setAlertMessage]
  );

  return putObject;
}

export { useS3 };
