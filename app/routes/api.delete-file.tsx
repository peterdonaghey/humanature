import {json, type ActionFunctionArgs} from "@remix-run/node";
import {deleteFromS3} from "~/utils/aws.server";
import {requireAdmin} from "~/utils/auth.server";

export async function action({request}: ActionFunctionArgs) {
  await requireAdmin(request);

  if (request.method !== "POST") {
    return json({error: "Method not allowed"}, {status: 405});
  }

  try {
    const {fileUrl} = await request.json();

    if (!fileUrl || typeof fileUrl !== "string") {
      return json({error: "File URL is required"}, {status: 400});
    }

    await deleteFromS3(fileUrl);
    return json({success: true});
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return json({error: "Failed to delete file"}, {status: 500});
  }
}
