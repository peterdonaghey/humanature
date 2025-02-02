import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import {Link, useLoaderData, Form, useNavigation} from "@remix-run/react";
import {getProject} from "~/utils/projects.server";
import {deletePost} from "~/utils/posts.server";
import {Layout} from "../components/Layout";

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
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

export async function loader({params}: LoaderFunctionArgs) {
  console.log("Project detail loader called with params:", params);

  if (!params.projectId) {
    console.error("No projectId provided");
    throw new Response("Project ID is required", {status: 400});
  }

  try {
    const project = await getProject(params.projectId);
    console.log("Project found:", project ? "yes" : "no");

    if (!project) {
      throw new Response("Project not found", {status: 404});
    }

    return json({project});
  } catch (error) {
    console.error("Error loading project:", error);
    throw new Response("Error loading project", {status: 500});
  }
}

export default function ProjectDetails() {
  const {project} = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-emerald-800">
              {project.name}
            </h1>
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
          </div>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="text-sm text-gray-500">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {project.posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No posts yet.</p>
              <Link
                to="/create-post"
                className="inline-block mt-4 text-emerald-600 hover:text-emerald-700"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            project.posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity space-x-4">
                  <Link
                    to={`/edit-post/${post.id}`}
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <Form method="post" className="inline">
                    <input type="hidden" name="postId" value={post.id} />
                    <button
                      type="submit"
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={(e) => {
                        if (
                          !confirm("Are you sure you want to delete this post?")
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </Form>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-emerald-800 mb-2">
                    {post.title}
                  </h2>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{__html: post.content}}
                  />
                  <div className="mt-4 text-sm text-gray-500">
                    Posted {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
