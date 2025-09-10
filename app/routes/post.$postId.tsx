import {json, type LoaderFunctionArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {Layout} from "~/components/Layout";
import {ArticleView} from "~/components/ArticleView";
import db from "~/utils/db.server";
import {convertPdfToHtml} from "~/utils/pdf.server";

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
      <ArticleView
        post={post}
        htmlContent={htmlContent}
        showBreadcrumb={true}
        showFooter={true}
      />
    </Layout>
  );
}
