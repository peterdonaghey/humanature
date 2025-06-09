import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import {Link, useLoaderData, Form, useNavigation} from "@remix-run/react";
import {getProject} from "~/utils/projects.server";
import {deletePost} from "~/utils/posts.server";
import {Layout} from "../components/Layout";
import {useState} from "react";
import db from "~/utils/db.server";
import {deleteFromS3} from "~/utils/aws.server";
import {formatDate} from "~/utils/date";
import {ProjectBanner} from "~/components/ProjectBanner";
import {getUser, isAdmin, requireAdmin} from "~/utils/auth.server";

export async function action({request}: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "deletePost") {
    const postId = formData.get("postId");

    if (typeof postId !== "string") {
      return json({error: "Invalid post ID"}, {status: 400});
    }

    const result = await deletePost(postId);
    if (!result.success) {
      return json({error: result.error}, {status: 500});
    }

    return json({success: true});
  }

  if (intent === "deleteDocument") {
    const documentId = formData.get("documentId");

    if (typeof documentId !== "string") {
      return json({error: "Invalid document ID"}, {status: 400});
    }

    try {
      // First get the document to get its URL
      const document = await db.document.findUnique({
        where: {id: documentId},
      });

      if (!document) {
        return json({error: "Document not found"}, {status: 404});
      }

      // Delete from S3 first
      await deleteFromS3(document.url);

      // Then delete from database
      await db.document.delete({
        where: {id: documentId},
      });

      return json({success: true});
    } catch (error) {
      console.error("Error deleting document:", error);
      return json({error: "Failed to delete document"}, {status: 500});
    }
  }

  return json({error: "Invalid action"}, {status: 400});
}

export async function loader({params, request}: LoaderFunctionArgs) {
  console.log("Project detail loader called with params:", params);

  if (!params.projectId) {
    console.error("No projectId provided");
    throw new Response("Project ID is required", {status: 400});
  }

  try {
    const user = await getUser(request);
    const project = await getProject(params.projectId);
    console.log("Project found:", project ? "yes" : "no");

    if (!project) {
      throw new Response("Project not found", {status: 404});
    }

    return json({project, isAdmin: isAdmin(user)});
  } catch (error) {
    console.error("Error loading project:", error);
    throw new Response("Error loading project", {status: 500});
  }
}

export default function ProjectDetails() {
  const {project, isAdmin: userIsAdmin} = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("fileSize", file.size.toString());
      // Determine file type from extension if browser doesn't provide it
      let fileType = file.type;
      if (!fileType || fileType === "application/octet-stream") {
        const ext = file.name.split(".").pop()?.toLowerCase();
        switch (ext) {
          case "csv":
            fileType = "text/csv";
            break;
          case "txt":
            fileType = "text/plain";
            break;
          case "pdf":
            fileType = "application/pdf";
            break;
          default:
            fileType = "application/octet-stream";
        }
      }
      formData.append("fileType", fileType);

      console.log("Uploading file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const response = await fetch(`/upload-document/${project.id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      console.log("Upload success:", result);

      // Show success message
      alert("Document uploaded successfully!");

      // Reload the page to show the new document
      window.location.reload();
    } catch (error) {
      console.error("Error uploading document:", error);
      alert(
        `Failed to upload document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {project.banner && (
          <ProjectBanner
            banner={project.banner}
            projectName={project.name}
            className="mb-8"
            variant="page"
          />
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-emerald-800">
              {project.name}
            </h1>
            {userIsAdmin && (
              <div className="space-x-4">
                <Link
                  to={`/edit-project/${project.id}`}
                  className="inline-flex items-center px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Edit Project
                </Link>
                <Link
                  to="/create-post"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  New Post
                </Link>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="text-sm text-gray-500">
            Created {formatDate(project.createdAt)}
          </div>
        </div>

        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-emerald-800">
              Documents
            </h2>
            {userIsAdmin && (
              <div className="relative">
                <input
                  type="file"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="document-upload"
                  className={`inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    "Upload Document"
                  )}
                </label>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {!project.documents || project.documents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No documents uploaded yet
              </p>
            ) : (
              project.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {document.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(document.size)} • {document.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      Download
                    </a>
                    {userIsAdmin && (
                      <Form method="post" className="inline">
                        <input
                          type="hidden"
                          name="intent"
                          value="deleteDocument"
                        />
                        <input
                          type="hidden"
                          name="documentId"
                          value={document.id}
                        />
                        <button
                          type="submit"
                          className={`inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                            isDeleting ? "opacity-50" : ""
                          }`}
                          disabled={isDeleting}
                          onClick={(e) => {
                            if (
                              !confirm(
                                "Are you sure you want to delete this document?"
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </Form>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-emerald-800">Posts</h2>
          </div>

          {project.posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No posts created yet</p>
              {userIsAdmin && (
                <Link
                  to="/create-post"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Create First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {project.posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-emerald-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-emerald-800">
                      {post.title}
                    </h3>
                    {userIsAdmin && (
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="text-emerald-600 hover:text-emerald-700 text-sm"
                        >
                          Edit
                        </Link>
                        <Form method="post" className="inline">
                          <input
                            type="hidden"
                            name="intent"
                            value="deletePost"
                          />
                          <input type="hidden" name="postId" value={post.id} />
                          <button
                            type="submit"
                            className={`text-red-600 hover:text-red-700 text-sm ${
                              isDeleting ? "opacity-50" : ""
                            }`}
                            disabled={isDeleting}
                            onClick={(e) => {
                              if (
                                !confirm(
                                  "Are you sure you want to delete this post?"
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </Form>
                      </div>
                    )}
                  </div>
                  <div
                    className="prose prose-emerald max-w-none"
                    dangerouslySetInnerHTML={{__html: post.content}}
                  />
                  <div className="mt-4 text-sm text-gray-500">
                    Created {formatDate(post.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
