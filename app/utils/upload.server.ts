import {json} from "@remix-run/node";
import {s3Client} from "./aws.server";
import {PutObjectCommand} from "@aws-sdk/client-s3";

export async function uploadToS3(file: File, folder: string = "posts") {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${folder}/${Date.now()}-${file.name}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return json({
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    throw json({error: "Upload failed"}, {status: 500});
  }
}
