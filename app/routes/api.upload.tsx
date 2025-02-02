import {ActionFunction, json} from "@remix-run/node";
import {uploadToS3} from "~/utils/upload.server";

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return json({error: "No file provided"}, {status: 400});
  }

  return uploadToS3(file);
};
