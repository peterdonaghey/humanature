import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import {useLoaderData, Form, useNavigation} from "@remix-run/react";
import {Layout} from "~/components/Layout";
import {getUser, requireUser} from "~/utils/auth.server";
import db from "~/utils/db.server";

export async function action({request}: ActionFunctionArgs) {
  const user = await requireUser(request);

  const formData = await request.formData();
  const name = formData.get("name");
  const bio = formData.get("bio");

  if (typeof name !== "string" || typeof bio !== "string") {
    return json({error: "Invalid form data"}, {status: 400});
  }

  try {
    await db.user.update({
      where: {id: user.id},
      data: {
        name: name.trim() || null,
        bio: bio.trim() || null,
      },
    });

    return json({success: true, message: "Profile updated successfully!"});
  } catch (error) {
    console.error("Error updating profile:", error);
    return json({error: "Failed to update profile"}, {status: 500});
  }
}

export async function loader({request}: LoaderFunctionArgs) {
  const user = await requireUser(request);

  const fullUser = await db.user.findUnique({
    where: {id: user.id},
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      email: true,
      createdAt: true,
    },
  });

  if (!fullUser) {
    throw new Response("User not found", {status: 404});
  }

  return json({user: fullUser});
}

export default function Profile() {
  const {user} = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">
              Manage your profile information and bio
            </p>
          </div>

          <Form method="post" className="space-y-6">
            {/* Username (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Username cannot be changed
              </p>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Display Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user.name || ""}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                This name will be displayed on your posts and articles
              </p>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={user.bio || ""}
                placeholder="Tell us a bit about yourself..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Share a brief description about yourself and your work
              </p>
            </div>

            {/* Account Info */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {user.email || "Not provided"}
                </div>
                <div>
                  <span className="font-medium">Member since:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
