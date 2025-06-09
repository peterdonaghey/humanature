import {Link} from "@remix-run/react";
import {formatDateShort} from "~/utils/date";
import {ProjectBanner} from "./ProjectBanner";

interface Project {
  id: string;
  name: string;
  description: string;
  banner?: string | null;
  posts: {id: string}[];
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({project}: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-emerald-100">
        {project.banner && (
          <ProjectBanner
            banner={project.banner}
            projectName={project.name}
            className="h-48"
            variant="card"
          />
        )}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors">
            {project.name}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{project.posts.length} posts</span>
            <span>Created {formatDateShort(project.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
