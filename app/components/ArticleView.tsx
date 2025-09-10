import {Link} from "@remix-run/react";
import {formatDateShort} from "~/utils/date";

interface ArticleViewProps {
  post: {
    id: string;
    title: string;
    content: string | null;
    documentUrl: string | null;
    createdAt: string;
    author?: {
      username: string;
    } | null;
    project?: {
      id: string;
      name: string;
    } | null;
  };
  htmlContent: string;
  isCollapsible?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  showBreadcrumb?: boolean;
  showFooter?: boolean;
}

export function ArticleView({
  post,
  htmlContent,
  isCollapsible = false,
  isExpanded = false,
  onToggle,
  showBreadcrumb = false,
  showFooter = false,
}: ArticleViewProps) {
  const containerClass = isCollapsible
    ? "relative"
    : "max-w-6xl mx-auto px-4 py-8";

  return (
    <article className={containerClass}>
      {/* Breadcrumb */}
      {showBreadcrumb && (
        <nav className="mb-8">
          <Link
            to={post.project ? `/projects/${post.project.id}` : "/posts"}
            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
          >
            ← Back to {post.project ? post.project.name : "Posts"}
          </Link>
        </nav>
      )}

      {/* Article Header */}
      <header
        className={`${isCollapsible ? "mb-6 cursor-pointer group" : "mb-12"}`}
        onClick={isCollapsible ? onToggle : undefined}
        onKeyDown={
          isCollapsible
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle?.();
                }
              }
            : undefined
        }
        role={isCollapsible ? "button" : undefined}
        tabIndex={isCollapsible ? 0 : undefined}
      >
        <div>
          <div className="flex items-center">
            <h1
              className={`font-bold text-gray-900 ${
                isCollapsible
                  ? "text-2xl group-hover:text-emerald-700 transition-colors"
                  : "text-4xl"
              }`}
            >
              {post.title}
            </h1>

            {isCollapsible && (
              <div className="ml-2 text-emerald-600 group-hover:text-emerald-800 transition-colors">
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>

          <div
            className={`flex items-center gap-4 text-sm text-gray-600 ${
              isCollapsible ? "mt-2" : "mt-4"
            }`}
          >
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
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.project.name}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div
        className={`relative ${
          isCollapsible && !isExpanded ? "max-h-64 overflow-hidden" : ""
        }`}
      >
        <div
          className={
            isCollapsible ? "prose max-w-none" : "prose prose-lg max-w-none"
          }
        >
          <div
            className="article-content text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{__html: htmlContent}}
          />
        </div>

        {/* Fade out overlay for collapsed state */}
        {isCollapsible && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* Document link for expanded articles */}
      {post.documentUrl && (isExpanded || !isCollapsible) && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <a
            href={post.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
          >
            📄 View original document ↗
          </a>
        </div>
      )}

      {/* Article Footer */}
      {showFooter && (
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
      )}
    </article>
  );
}
