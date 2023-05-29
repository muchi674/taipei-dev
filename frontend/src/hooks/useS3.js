import { useMemo, useCallback } from "react";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";

const region = process.env.REACT_APP_AWS_REGION;
const bucket = process.env.REACT_APP_S3_BUCKET;
const bucketURL = process.env.REACT_APP_S3_BUCKET_URL;

function useS3({ userId, cognitoIdentityId, cognitoToken }) {
  const client = useMemo(() => {
    if (
      [cognitoIdentityId, cognitoToken].some(
        (element) => typeof element === "undefined"
      )
    ) {
      /*
      this shortcircuiting logic is added here because react
      custom hooks cannot be used conditionally (i.e. when it
      is guaranteed that all props passed to userS3 is valid).
      */
      return null;
    }

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
      // app should crash if this function errors
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: `user-data/${userId}/${lotId}/${file.name}`,
        Body: file,
      });

      await client.send(command);
    },
    [userId, client]
  );

  const getObjectKeys = useCallback(
    async (lotId) => {
      // app should crash if this function errors
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `user-data/${userId}/${lotId}/`,
      });
      const response = await client.send(command);
      const keys = [];

      for (const obj of response.Contents) {
        keys.push(obj.Key);
      }

      return keys;
    },
    [userId, client]
  );

  const getObjectURLs = useCallback(
    async (lotId) => {
      const objectKeys = await getObjectKeys(lotId);

      return objectKeys.map((key) => bucketURL + key);
    },
    [getObjectKeys]
  );

  return { putObject, getObjectKeys, getObjectURLs };
}

export { useS3 };
