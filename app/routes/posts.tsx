import {json, LoaderFunction} from "@remix-run/node";
import {useLoaderData, Link} from "@remix-run/react";
import {Layout} from "../components/Layout";
import {getPosts} from "~/utils/posts.server";
import {Post} from "@prisma/client";

type LoaderData = {
  posts: Post[];
};

// Loader function to fetch posts
export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json({posts});
};

export default function Posts() {
  const {posts} = useLoaderData<LoaderData>();

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
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-800">
                  {post.content.length > 200
                    ? `${post.content.substring(0, 200)}...`
                    : post.content}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
