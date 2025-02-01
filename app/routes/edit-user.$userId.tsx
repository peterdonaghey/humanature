import {json, redirect} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import type {LoaderFunctionArgs, ActionFunctionArgs} from "@remix-run/node";
import {Layout} from "~/components/Layout";
import db from "~/utils/db.server";
import {
  getUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} from "~/utils/auth.server";
import {AvailablePrivilages} from "~/functions/prililages";

export async function loader({request, params}: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user?.privilages.includes("superAdmin")) {
    return redirect("/");
  }

  const editUser = await db.user.findUnique({
    where: {id: params.userId},
    select: {id: true, username: true, privilages: true, email: true},
  });

  if (!editUser) return redirect("/users");

  return json({
    currentUser: user,
    editUser,
  });
}

export async function action({request, params}: ActionFunctionArgs) {
  const currentUser = await getUser(request);
  if (!currentUser?.privilages.includes("superAdmin")) {
    return redirect("/");
  }

  const formData = await request.formData();
  const actionType = formData.get("_action");

  // Handle deletion
  if (actionType === "delete") {
    if (currentUser.id === params.userId) {
      return json({error: "You cannot delete yourself"}, {status: 400});
    }

    await deleteUser(params.userId!);
    return redirect("/users");
  }

  const userId = formData.get("userId") as string;
  const username = formData.get("username") as string;
  const privilages = formData.getAll("privilages") as string[];
  const newPassword = formData.get("newPassword") as string | null;
  const email = formData.get("email") as string;
  // Handle password update only if field is filled
  if (newPassword) {
    const result = await updateUserPassword(userId, newPassword);
    if ("error" in result) {
      return json({error: result.error}, {status: 400});
    }
  }

  // Always update user details
  const userResult = await updateUser(userId, username, privilages, email);
  if ("error" in userResult) {
    return json({error: userResult.error}, {status: 400});
  }

  return redirect("/users");
}

export default function EditUser() {
  const {currentUser, editUser} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">Edit User</h1>

        <Form method="post" className="space-y-6">
          <input type="hidden" name="userId" value={editUser.id} />

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              name="username"
              defaultValue={editUser.username}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="newPassword"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={editUser.email ?? ""}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2">
              Privileges
            </legend>
            <div className="space-y-2">
              {AvailablePrivilages.map((priv) => (
                <label key={priv} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="privilages"
                    value={priv}
                    defaultChecked={editUser.privilages.includes(priv)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{priv}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </Form>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-bold text-red-700 mb-4">Danger Zone</h2>

          <Form method="post">
            <input type="hidden" name="_action" value="delete" />
            <input type="hidden" name="userId" value={editUser.id} />

            <button
              type="submit"
              onClick={(e) => {
                if (
                  !confirm("This will permanently delete the user. Continue?")
                ) {
                  e.preventDefault();
                }
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              disabled={editUser.id === currentUser?.id}
            >
              Delete User Forever
            </button>

            {editUser.id === currentUser?.id && (
              <p className="text-sm text-red-600 mt-2">
                You cannot delete your own account
              </p>
            )}
          </Form>
        </div>
      </div>
    </Layout>
  );
}
