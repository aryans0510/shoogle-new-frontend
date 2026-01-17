import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@shared/index";

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: env.AWS_IAM_ACCESS_KEY,
    secretAccessKey: env.AWS_IAM_SECRET_ACCESS_KEY,
  },
});

export const generateSignedUrlForListingImage = async (type: string, userId: string) => {
  try {
    if (!type || !userId) {
      return null;
    }

    const command = new PutObjectCommand({
      Bucket: "shoogle-user-listings",
      Key: `listings/${userId}/${Date.now()}`,
      ContentType: `image/${type}`,
    });

    return await getSignedUrl(client, command, {
      expiresIn: 600,
    });
  } catch (error) {
    return null;
  }
};
