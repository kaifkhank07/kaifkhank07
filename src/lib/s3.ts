import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  const bucketName = process.env.AWS_BUCKET!;
  const cloudFrontUrl = process.env.AWS_CLOUDFRONT_URL!;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Return the CloudFront URL if available, else S3 object URL
  if (cloudFrontUrl) {
    return `${cloudFrontUrl}/${fileName}`;
  }
  
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

export const deleteFromS3 = async (fileUrl: string) => {
  try {
    const bucketName = process.env.AWS_BUCKET!;
    const cloudFrontUrl = process.env.AWS_CLOUDFRONT_URL!;
    
    let key = "";
    
    if (cloudFrontUrl && fileUrl.startsWith(cloudFrontUrl)) {
        key = fileUrl.replace(`${cloudFrontUrl}/`, "");
    } else {
        const urlParts = fileUrl.split("/");
        key = urlParts[urlParts.length - 1];
    }

    if (!key) return;

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
  }
};
