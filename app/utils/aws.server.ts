import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export const s3Client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  endpoint: `https://s3.eu-central-1.amazonaws.com`,
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;

export async function uploadStreamToS3(
  stream: ReadableStream,
  filename: string
): Promise<string> {
  // Generate a unique filename to prevent collisions
  const uniqueFilename = `${crypto
    .randomBytes(16)
    .toString("hex")}-${filename}`;
  const key = `uploads/${uniqueFilename}`;

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: stream,
        ContentType: getContentType(filename),
      },
    });

    await upload.done();

    // Return direct S3 URL
    return `https://${BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${key}`;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file to S3");
  }
}

function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
