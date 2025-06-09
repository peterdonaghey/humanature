import {json, type LoaderFunctionArgs} from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import {getProjects} from "~/utils/projects.server";
import {Layout} from "../components/Layout";
import {ProjectCard} from "~/components/ProjectCard";
import {getUser, isAdmin} from "~/utils/auth.server";

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  const projects = await getProjects();
  return json({projects, isAdmin: isAdmin(user)});
}

export default function ProjectsIndex() {
  const {projects, isAdmin: userIsAdmin} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800">Projects</h1>
          {userIsAdmin && (
            <Link
              to="/create-project"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Project
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
