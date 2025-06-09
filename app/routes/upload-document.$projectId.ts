import {json, unstable_parseMultipartFormData} from "@remix-run/node";
import type {ActionFunctionArgs} from "@remix-run/node";
import {uploadStreamToS3} from "~/utils/aws.server";
import db from "~/utils/db.server";
import {requireAdmin} from "~/utils/auth.server";

export async function action({request, params}: ActionFunctionArgs) {
  await requireAdmin(request);
  try {
    let fileName = "";
    const fileSize = 0;
    const fileType = "";
    let fileUrl = "";

    const formData = await unstable_parseMultipartFormData(
      request,
      async ({data, name, filename}) => {
        if (name === "file" && filename) {
          fileName = filename;

          const stream = new ReadableStream({
            async start(controller) {
              for await (const chunk of data) {
                controller.enqueue(chunk);
              }
              controller.close();
            },
          });

          fileUrl = await uploadStreamToS3(stream, filename, "documents");
          return fileUrl;
        } else if (name === "fileName") {
          // Extract the filename from form data
          let value = "";
          for await (const chunk of data) {
            value += new TextDecoder().decode(chunk);
          }
          return value;
        } else if (name === "fileSize") {
          // Extract the file size from form data
          let value = "";
          for await (const chunk of data) {
            value += new TextDecoder().decode(chunk);
          }
          return value;
        } else if (name === "fileType") {
          // Extract the file type from form data
          let value = "";
          for await (const chunk of data) {
            value += new TextDecoder().decode(chunk);
          }
          return value;
        }
        return undefined;
      }
    );

    // Get the uploaded file URL and metadata
    const uploadedUrl = formData.get("file") as string;
    const formFileName = formData.get("fileName") as string;
    const formFileSize = formData.get("fileSize") as string;
    const formFileType = formData.get("fileType") as string;

    // Use form data, fallback to extracted data
    const finalFileName = formFileName || fileName;
    const finalFileSize = formFileSize ? parseInt(formFileSize) : fileSize;
    const finalFileType =
      formFileType || fileType || "application/octet-stream";
    const finalFileUrl = uploadedUrl || fileUrl;

    console.log("Final file metadata:", {
      fileName: finalFileName,
      fileSize: finalFileSize,
      fileType: finalFileType,
      fileUrl: finalFileUrl,
    });

    if (!finalFileUrl || typeof finalFileUrl !== "string") {
      return json({error: "No file uploaded"}, {status: 400});
    }

    if (!finalFileName) {
      return json({error: "File name is required"}, {status: 400});
    }

    const document = await db.document.create({
      data: {
        name: finalFileName,
        url: finalFileUrl,
        type: finalFileType,
        size: finalFileSize,
        project: {
          connect: {
            id: params.projectId,
          },
        },
      },
    });

    return json({success: true, document});
  } catch (error) {
    console.error("Upload error:", error);
    return json(
      {error: "Error uploading file. Please try again."},
      {status: 500}
    );
  }
}
