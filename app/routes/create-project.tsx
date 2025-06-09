import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {Form, useActionData} from "@remix-run/react";
import {createProject} from "~/utils/projects.server";
import {Layout} from "~/components/Layout";
import {BannerUpload} from "~/components/BannerUpload";
import {useState} from "react";
import {requireAdmin} from "~/utils/auth.server";

export async function loader({request}: LoaderFunctionArgs) {
  await requireAdmin(request);
  return null;
}

export async function action({request}: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const banner = formData.get("banner") as string;

  if (!name || !description) {
    return json({error: "Name and description are required"}, {status: 400});
  }

  await createProject(name, description, banner || undefined);
  return redirect("/projects");
}

export default function CreateProject() {
  const actionData = useActionData<typeof action>();
  const [banner, setBanner] = useState<string | undefined>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-emerald-800 mb-8">
          Create Project
        </h1>

        <Form method="post" className="space-y-6">
          {actionData?.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {actionData.error}
            </div>
          )}

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
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <BannerUpload currentBanner={banner} onBannerChange={setBanner} />

          <input type="hidden" name="banner" value={banner || ""} />

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
              Create Project
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
