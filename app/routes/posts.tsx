import {json, LoaderFunction, ActionFunction} from "@remix-run/node";
import {useLoaderData, Link, Form, useNavigation} from "@remix-run/react";
import {Layout} from "../components/Layout";
import {getPosts, deletePost} from "~/utils/posts.server";
import {Post} from "@prisma/client";
import {getUser, requireAdmin} from "../utils/auth.server";
import {formatDateShort} from "~/utils/date";

type LoaderData = {
  posts: Post[];
  isAdmin: boolean;
};

export const action: ActionFunction = async ({request}) => {
  await requireAdmin(request);

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
};

export const loader: LoaderFunction = async ({request}) => {
  const user = await getUser(request);
  const isAdmin = user?.privilages.includes("admin");
  const posts = await getPosts();
  return json({posts, isAdmin});
};

export default function Posts() {
  const {posts, isAdmin} = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";

  console.log("isAdmin", isAdmin);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col justify-center items-center mb-16">
          <h1 className="text-3xl font-bold mb-8">Posts</h1>
          <Link
            to="/create-post"
            className="bg-emerald-400 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
          >
            Create post
          </Link>
        </div>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-center text-gray-600">
              No posts yet. Create your first one!
            </p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="w-full mx-auto p-6 bg-stone-50 rounded-lg my-4"
              >
                <article className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="text-emerald-600 hover:text-emerald-800 transition-colors"
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

                  <Link
                    to={`/post/${post.id}`}
                    className="block group-hover:text-emerald-700 transition-colors"
                  >
                    <h2 className="text-2xl font-semibold mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {formatDateShort(post.createdAt)}
                    </p>

                    {post.documentUrl && (
                      <div className="mb-3 flex items-center gap-2 text-sm text-emerald-600">
                        <span>📄</span>
                        <span>Document Article</span>
                      </div>
                    )}

                    <div className="text-gray-700">
                      {post.content ? (
                        <p className="line-clamp-3">
                          {post.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 200)}
                          ...
                        </p>
                      ) : post.documentUrl ? (
                        <p className="text-gray-500 italic">
                          Click to view document-based article
                        </p>
                      ) : (
                        <p className="text-gray-500 italic">
                          No content available
                        </p>
                      )}
                    </div>

                    <div className="mt-4 text-emerald-600 font-medium">
                      Read more →
                    </div>
                  </Link>
                </article>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
