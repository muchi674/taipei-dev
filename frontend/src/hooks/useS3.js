import { useMemo, useCallback } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";

const region = process.env.REACT_APP_AWS_REGION;

function useS3({ userId, cognitoIdentityId, cognitoToken }) {
  const client = useMemo(() => {
    return new S3Client({
      region,
      credentials: fromCognitoIdentity({
        identityId: cognitoIdentityId,
        logins: {
          "cognito-identity.amazonaws.com": cognitoToken,
        },
        clientConfig: { region },
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

      // app should crash if this is unsuccessful
      await client.send(command);
    },
    [userId, client]
  );

  return putObject;
}

export { useS3 };
