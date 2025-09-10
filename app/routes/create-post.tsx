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
import db from "~/utils/db.server";

type ActionData = {
  error?: string;
};

type LoaderData = {
  projects: Project[];
  users: {id: string; username: string; name: string | null}[];
};

export const loader: LoaderFunction = async ({request}) => {
  await requireAdmin(request);
  const projects = await getProjects();

  // Get all users for the author dropdown
  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return json({projects, users});
};

export const action: ActionFunction = async ({request}) => {
  const currentUser = await requireAdmin(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const projectId = formData.get("projectId");
  const authorId = formData.get("authorId");
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

  if (authorId && typeof authorId !== "string") {
    return json({error: "Invalid author selection"}, {status: 400});
  }

  if (documentUrl && typeof documentUrl !== "string") {
    return json({error: "Invalid document URL"}, {status: 400});
  }

  // Use selected author or fallback to current user
  const finalAuthorId = authorId || currentUser.id;

  const post = await createPost(
    title,
    content || "",
    projectId,
    finalAuthorId,
    documentUrl || null
  );
  return redirect(`/post/${post.id}`);
};

export default function CreatePost() {
  const {projects, users} = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [content, setContent] = useState("");
  const [documentUploading, setDocumentUploading] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");

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
            <label
              htmlFor="authorId"
              className="block text-sm font-medium mb-2"
            >
              Author
            </label>
            <select
              id="authorId"
              name="authorId"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select an author (optional)</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.username}
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
