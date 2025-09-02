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
  const documentUrl = formData.get("documentUrl");

  if (!title || !projectId) {
    return json({error: "Title and project are required"}, {status: 400});
  }

  if (typeof title !== "string" || typeof projectId !== "string") {
    return json({error: "Invalid form submission"}, {status: 400});
  }

  // Validate optional fields
  if (content && typeof content !== "string") {
    return json({error: "Invalid content"}, {status: 400});
  }

  if (documentUrl && typeof documentUrl !== "string") {
    return json({error: "Invalid document URL"}, {status: 400});
  }

  await db.post.update({
    where: {id: params.postId},
    data: {
      title,
      content: content || "",
      documentUrl: documentUrl || null,
      project: {
        connect: {id: projectId},
      },
    },
  });

  return redirect(`/post/${params.postId}`);
}

export default function EditPost() {
  const {post, projects} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [content, setContent] = useState(post.content);
  const [documentUploading, setDocumentUploading] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(post.documentUrl || "");

  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      alert("Please select a Word document (.docx file)");
      return;
    }

    setDocumentUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/upload-file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setDocumentUrl(result.url);
      } else {
        alert("Error uploading document");
      }
    } catch (error) {
      alert("Error uploading document");
    } finally {
      setDocumentUploading(false);
    }
  };

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

          {/* Document Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">
              📄 Word Document Content
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a Word document (.docx) to automatically convert it to web
              article format with images and formatting preserved, or use the
              rich text editor below.
            </p>

            <div className="space-y-4">
              <input
                type="file"
                accept=".docx"
                onChange={handleDocumentUpload}
                disabled={documentUploading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />

              {documentUploading && (
                <div className="text-sm text-emerald-600">
                  Uploading document...
                </div>
              )}

              {documentUrl && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="text-sm text-emerald-800 mb-1">
                    ✅ Word document uploaded successfully!
                  </div>
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-800 text-sm"
                  >
                    View document ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => setDocumentUrl("")}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <input type="hidden" name="documentUrl" value={documentUrl} />
          </div>

          {/* Rich Text Editor - Optional if no document */}
          <div className="prose w-full">
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Rich Text Content (Optional - used if no document provided)
            </label>
            <input type="hidden" name="content" value={content} />
            <Editor content={content} onChange={setContent} />
          </div>

          {actionData?.error && (
            <div className="text-red-600 text-sm">{actionData.error}</div>
          )}

          <div className="flex justify-end gap-4">
            <a
              href={`/post/${post.id}`}
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
