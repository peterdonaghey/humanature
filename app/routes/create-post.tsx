import {Layout} from "../components/Layout";
import {Form, useActionData, useNavigation} from "@remix-run/react";
import {json, redirect} from "@remix-run/node";
import type {ActionFunction} from "@remix-run/node";
import {createPost} from "~/utils/posts.server";

export const action: ActionFunction = async ({request}) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return json({error: "Invalid form submission"}, {status: 400});
  }

  await createPost(title, content);
  return redirect("/posts");
};

export default function CreatePost() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Create New Post</h1>

        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {actionData?.error && (
            <div className="text-red-600 text-sm">{actionData.error}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </Form>
      </div>
    </Layout>
  );
}
