import {S3Client, DeleteObjectCommand} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
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
  filename: string,
  folder: string = "uploads"
): Promise<string> {
  // Generate a unique ID for the directory to prevent collisions
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const key = `${folder}/${uniqueId}/${filename}`;

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
    case "csv":
      return "text/csv";
    case "txt":
      return "text/plain";
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    default:
      return "application/octet-stream";
  }
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  try {
    // Extract key from URL
    // URL format: https://humanature.s3.eu-central-1.amazonaws.com/documents/filename.ext
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading /

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    console.log(`Successfully deleted ${key} from S3`);
  } catch (error) {
    console.error("S3 delete error:", error);
    throw new Error("Failed to delete file from S3");
  }
}
