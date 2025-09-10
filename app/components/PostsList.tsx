import {useState} from "react";
import {Link, Form, useNavigation} from "@remix-run/react";
import {ArticleView} from "./ArticleView";

type PostWithContent = {
  id: string;
  title: string;
  content: string | null;
  documentUrl: string | null;
  createdAt: string;
  project?: {id: string; name: string} | null;
  author?: {username: string} | null;
  htmlContent: string;
};

interface PostsListProps {
  posts: PostWithContent[];
  isAdmin: boolean;
  showCreateButton?: boolean;
}

export function PostsList({
  posts,
  isAdmin,
  showCreateButton = false,
}: PostsListProps) {
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const togglePost = (postId: string) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-4">
          No posts yet. Create your first one!
        </p>
        {showCreateButton && (
          <Link
            to="/create-post"
            className="bg-emerald-400 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
          >
            Create post
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <div
          key={post.id}
          className="w-full mx-auto p-6 bg-stone-50 rounded-lg my-4"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative group">
            {/* Admin controls */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {isAdmin && (
                <div className="flex gap-2 bg-white p-2 rounded shadow-lg">
                  <Link
                    to={`/edit-post/${post.id}`}
                    className="text-emerald-600 hover:text-emerald-800 transition-colors"
                  >
                    Edit
                  </Link>
                  <Form method="post" className="inline">
                    <input type="hidden" name="intent" value="deletePost" />
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
              )}
            </div>

            <ArticleView
              post={post}
              htmlContent={post.htmlContent}
              isCollapsible={true}
              isExpanded={expandedPosts.has(post.id)}
              onToggle={() => togglePost(post.id)}
            />

            {/* View full page link */}
            {!expandedPosts.has(post.id) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/post/${post.id}`}
                  className="text-emerald-600 hover:text-emerald-800 font-medium text-sm"
                >
                  View full page →
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
