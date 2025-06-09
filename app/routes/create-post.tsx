import {Layout} from "../components/Layout";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {json, redirect} from "@remix-run/node";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {createPost} from "~/utils/posts.server";
import {Editor} from "~/components/RichTextEditor";
import {useState} from "react";
import {getProjects} from "~/utils/projects.server";
import {Project} from "@prisma/client";
import {requireAdmin} from "~/utils/auth.server";

type ActionData = {
  error?: string;
};

type LoaderData = {
  projects: Project[];
};

export const loader: LoaderFunction = async ({request}) => {
  await requireAdmin(request);
  const projects = await getProjects();
  return json({projects});
};

export const action: ActionFunction = async ({request}) => {
  await requireAdmin(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const projectId = formData.get("projectId");

  console.log("content", content);

  switch (true) {
    case title === null:
      return json({error: "Missing title"}, {status: 400});
    case content === null:
      return json({error: "Missing content"}, {status: 400});
    case projectId === null:
      return json({error: "Please select a project"}, {status: 400});
    case typeof title !== "string" ||
      typeof content !== "string" ||
      typeof projectId !== "string":
      return json({error: "Invalid form submission"}, {status: 400});
    default:
      break;
  }

  await createPost(title, content, projectId);
  return redirect("/projects/" + projectId);
};

export default function CreatePost() {
  const {projects} = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [content, setContent] = useState("");

  return (
    <Layout>
      <div className="w-[950px] mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Create New Post</h1>

        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="projectId"
              className="block text-sm font-medium mb-2"
            >
              Project
            </label>
            <select
              id="projectId"
              name="projectId"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div className="prose w-full">
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <input type="hidden" name="content" value={content} />
            <Editor content={content} onChange={setContent} />
          </div>

          {actionData?.error && (
            <div className="text-red-600 text-sm">{actionData.error}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </Form>
      </div>
    </Layout>
  );
}
