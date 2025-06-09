import {Layout} from "../components/Layout";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {Editor} from "~/components/RichTextEditor";
import {useState} from "react";
import {getProjects} from "~/utils/projects.server";
import db from "~/utils/db.server";
import {requireAdmin} from "~/utils/auth.server";

export async function loader({params, request}: LoaderFunctionArgs) {
  await requireAdmin(request);

  const post = await db.post.findUnique({
    where: {id: params.postId},
    include: {project: true},
  });

  if (!post) {
    throw new Response("Post not found", {status: 404});
  }

  const projects = await getProjects();
  return json({post, projects});
}

export async function action({request, params}: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const projectId = formData.get("projectId");

  if (!title || !content || !projectId) {
    return json(
      {error: "Title, content and project are required"},
      {status: 400}
    );
  }

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    typeof projectId !== "string"
  ) {
    return json({error: "Invalid form submission"}, {status: 400});
  }

  await db.post.update({
    where: {id: params.postId},
    data: {
      title,
      content,
      project: {
        connect: {id: projectId},
      },
    },
  });

  return redirect(`/project/${projectId}`);
}

export default function EditPost() {
  const {post, projects} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [content, setContent] = useState(post.content);

  return (
    <Layout>
      <div className="w-[950px] mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Post</h1>

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
              defaultValue={post.project?.id}
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
              defaultValue={post.title}
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

          <div className="flex justify-end gap-4">
            <a
              href={`/project/${post.project?.id}`}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
