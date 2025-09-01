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
  const pdfUrl = formData.get("pdfUrl");

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

  if (pdfUrl && typeof pdfUrl !== "string") {
    return json({error: "Invalid PDF URL"}, {status: 400});
  }

  const post = await createPost(
    title,
    content || "",
    projectId,
    pdfUrl || null
  );
  return redirect(`/post/${post.id}`);
};

export default function CreatePost() {
  const {projects} = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [content, setContent] = useState("");
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handlePdfUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    setPdfUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/upload-file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPdfUrl(result.url);
      } else {
        alert("Error uploading PDF");
      }
    } catch (error) {
      alert("Error uploading PDF");
    } finally {
      setPdfUploading(false);
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

          {/* PDF Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-medium mb-4">📄 PDF Article Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a PDF to automatically convert it to web article format, or
              use the rich text editor below.
            </p>

            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                disabled={pdfUploading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />

              {pdfUploading && (
                <div className="text-sm text-emerald-600">Uploading PDF...</div>
              )}

              {pdfUrl && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="text-sm text-emerald-800 mb-1">
                    ✅ PDF uploaded successfully!
                  </div>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-800 text-sm"
                  >
                    View PDF ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => setPdfUrl("")}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <input type="hidden" name="pdfUrl" value={pdfUrl} />
          </div>

          {/* Rich Text Editor - Optional if no PDF */}
          <div className="prose w-full">
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Rich Text Content (Optional - used if no PDF provided)
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
