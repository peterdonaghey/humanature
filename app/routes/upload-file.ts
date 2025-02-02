import {json, unstable_parseMultipartFormData} from "@remix-run/node";
import type {ActionFunctionArgs} from "@remix-run/node";
import {uploadStreamToS3} from "~/utils/aws.server";

export async function action({request}: ActionFunctionArgs) {
  try {
    const formData = await unstable_parseMultipartFormData(
      request,
      async ({data, name, filename}) => {
        if (name !== "file" || !filename) {
          return undefined;
        }

        const stream = new ReadableStream({
          async start(controller) {
            for await (const chunk of data) {
              controller.enqueue(chunk);
            }
            controller.close();
          },
        });

        const uploadedFileUrl = await uploadStreamToS3(stream, filename);
        return uploadedFileUrl;
      }
    );

    const fileUrl = formData.get("file");

    if (!fileUrl || typeof fileUrl !== "string") {
      return json({error: "No file uploaded"}, {status: 400});
    }

    return json({url: fileUrl});
  } catch (error) {
    console.error("Upload error:", error);
    return json(
      {error: "Error uploading file. Please try again."},
      {status: 500}
    );
  }
}
