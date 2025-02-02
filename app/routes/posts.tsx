import {json, LoaderFunction, ActionFunction} from "@remix-run/node";
import {useLoaderData, Link, Form, useNavigation} from "@remix-run/react";
import {Layout} from "../components/Layout";
import {getPosts, deletePost} from "~/utils/posts.server";
import {Post} from "@prisma/client";

type LoaderData = {
  posts: Post[];
};

export const action: ActionFunction = async ({request}) => {
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

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json({posts});
};

export default function Posts() {
  const {posts} = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

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
              <article
                key={post.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">
                  {formatDate(post.createdAt)}
                </p>
                <div
                  className="prose prose-sm sm:prose lg:prose-lg max-w-none prose-colors"
                  dangerouslySetInnerHTML={{__html: post.content}}
                />
              </article>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
