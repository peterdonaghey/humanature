import {json, type LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData, Link} from "@remix-run/react";
import {Layout} from "~/components/Layout";
import db from "~/utils/db.server";
import {convertPdfToHtml} from "~/utils/pdf.server";
import {formatDateShort} from "~/utils/date";

export async function loader({params}: LoaderFunctionArgs) {
  const post = await db.post.findUnique({
    where: {id: params.postId},
    include: {
      project: true,
      author: true,
    },
  });

  if (!post) {
    throw new Response("Post not found", {status: 404});
  }

  let htmlContent = post.content;

  // If there's a document URL, convert it to HTML
  if (post.documentUrl) {
    try {
      htmlContent = await convertPdfToHtml(post.documentUrl);
    } catch (error) {
      console.error("Error converting document:", error);
      // Fallback to regular content if document conversion fails
      htmlContent = post.content || "<p>Unable to load document content.</p>";
    }
  }

  return json({post, htmlContent});
}

export default function PostView() {
  const {post, htmlContent} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to={post.project ? `/projects/${post.project.id}` : "/posts"}
            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
          >
            ← Back to {post.project ? post.project.name : "Posts"}
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <time dateTime={post.createdAt}>
              {formatDateShort(post.createdAt)}
            </time>
            {post.author && (
              <>
                <span>•</span>
                <span>by {post.author.username}</span>
              </>
            )}
            {post.project && (
              <>
                <span>•</span>
                <Link
                  to={`/projects/${post.project.id}`}
                  className="text-emerald-600 hover:text-emerald-800"
                >
                  {post.project.name}
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {post.documentUrl && (
            <div className="mb-8 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-800 mb-2">
                📄 This article was generated from a document
              </p>
              <a
                href={post.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
              >
                View original document ↗
              </a>
            </div>
          )}

          <div
            className="article-content text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{__html: htmlContent}}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link
              to={post.project ? `/projects/${post.project.id}` : "/posts"}
              className="text-emerald-600 hover:text-emerald-800 font-medium"
            >
              ← Back to {post.project ? post.project.name : "Posts"}
            </Link>

            {post.project && (
              <Link
                to={`/projects/${post.project.id}`}
                className="text-gray-600 hover:text-gray-800"
              >
                More from {post.project.name}
              </Link>
            )}
          </div>
        </footer>
      </article>
    </Layout>
  );
}
