import {json, LoaderFunction, ActionFunction} from "@remix-run/node";
import {useLoaderData, Link} from "@remix-run/react";
import {Layout} from "../components/Layout";
import {PostsList} from "../components/PostsList";
import {getPosts, deletePost} from "~/utils/posts.server";
import {Post} from "@prisma/client";
import {getUser, requireAdmin} from "../utils/auth.server";
import {convertPdfToHtml} from "~/utils/pdf.server";

type PostWithContent = Post & {
  project?: {id: string; name: string} | null;
  author?: {username: string; name?: string | null} | null;
  htmlContent: string;
};

type LoaderData = {
  posts: PostWithContent[];
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
  const rawPosts = await getPosts();

  // Process each post to include HTML content
  const posts = await Promise.all(
    rawPosts.map(async (post) => {
      let htmlContent = post.content || "";

      // If there's a document URL, convert it to HTML
      if (post.documentUrl) {
        try {
          htmlContent = await convertPdfToHtml(post.documentUrl);
        } catch (error) {
          console.error("Error converting document:", error);
          // Fallback to regular content if document conversion fails
          htmlContent =
            post.content || "<p>Unable to load document content.</p>";
        }
      }

      return {
        ...post,
        htmlContent,
      };
    })
  );

  return json({posts, isAdmin});
};

export default function Posts() {
  const {posts, isAdmin} = useLoaderData<LoaderData>();

  console.log("isAdmin", isAdmin);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col justify-center items-center mb-16">
          <h1 className="text-3xl font-bold mb-8">Posts</h1>
          <Link
            to="/create-post"
            className="bg-emerald-400 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
          >
            Create post
          </Link>
        </div>

        <PostsList posts={posts} isAdmin={isAdmin} showCreateButton={true} />
      </div>
    </Layout>
  );
}
