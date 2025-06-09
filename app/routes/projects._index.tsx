import {json} from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import {getProjects} from "~/utils/projects.server";
import {Layout} from "../components/Layout";
import {formatDateShort} from "~/utils/date";

export async function loader() {
  const projects = await getProjects();
  return json({projects});
}

export default function ProjectsIndex() {
  const {projects} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800">Projects</h1>
          <Link
            to="/create-project"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Project
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6 border border-emerald-100">
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
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
