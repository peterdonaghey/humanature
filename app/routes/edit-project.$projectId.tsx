import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  getProject,
  updateProject,
  deleteProject,
} from "~/utils/projects.server";
import {Layout} from "../components/Layout";
import {BannerUpload} from "~/components/BannerUpload";
import {useState} from "react";
import {requireAdmin} from "~/utils/auth.server";

export async function loader({params, request}: LoaderFunctionArgs) {
  await requireAdmin(request);

  const project = await getProject(params.projectId as string);
  if (!project) {
    throw new Response("Project not found", {status: 404});
  }
  return json({project});
}

export async function action({request, params}: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const result = await deleteProject(params.projectId as string);
    if (!result.success) {
      return json({error: result.error}, {status: 500});
    }
    return redirect("/projects");
  }

  // Default action is update
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const banner = formData.get("banner") as string;
  const currentBanner = formData.get("currentBanner") as string;

  if (!name || !description) {
    return json({error: "Name and description are required"}, {status: 400});
  }

  await updateProject(
    params.projectId as string,
    name,
    description,
    banner || undefined,
    currentBanner || undefined
  );
  return redirect(`/projects/${params.projectId}`);
}

export default function EditProject() {
  const {project} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isDeleting =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "delete";
  const [banner, setBanner] = useState<string | undefined>(
    project.banner || undefined
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-emerald-800 mb-8">
          Edit Project
        </h1>

        {actionData?.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={project.name}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={project.description}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <BannerUpload
            currentBanner={banner}
            onBannerChange={setBanner}
            cleanupPrevious={true}
          />

          <input type="hidden" name="banner" value={banner || ""} />
          <input
            type="hidden"
            name="currentBanner"
            value={project.banner || ""}
          />

          <div className="flex justify-end gap-4">
            <a
              href="/projects"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Update Project
            </button>
          </div>
        </Form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Danger Zone
          </h2>
          <Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <button
              type="submit"
              className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors ${
                isDeleting ? "opacity-50" : ""
              }`}
              disabled={isDeleting}
              onClick={(e) => {
                if (
                  !confirm(
                    `Are you sure you want to delete "${project.name}"? This will permanently delete the project and all its posts and documents. This action cannot be undone.`
                  )
                ) {
                  e.preventDefault();
                }
              }}
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </button>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
