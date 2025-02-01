import {json, redirect} from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import type {LoaderFunctionArgs, ActionFunctionArgs} from "@remix-run/node";
import {Layout} from "~/components/Layout";
import db from "~/utils/db.server";
import {getUser, updateUserPassword} from "~/utils/auth.server";
import {formatTimeAgo} from "~/functions/time";

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user?.privilages.includes("superAdmin")) {
    return redirect("/");
  }

  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      privilages: true,
      createdAt: true,
      email: true,
      lastLogin: true,
    },
    orderBy: {createdAt: "desc"},
  });

  return json({users});
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!userId || !newPassword) {
    return json({error: "Missing required fields"}, {status: 400});
  }

  await updateUserPassword(userId, newPassword);

  return redirect("/users");
}

export default function Users() {
  const {users} = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Users</h1>
          <Link
            to="/create-user"
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Create New User
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Privilages
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.privilages.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.lastLogin
                      ? formatTimeAgo(new Date(user.lastLogin))
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-4">
                    <Link
                      to={`/edit-user/${user.id}`}
                      className="text-emerald-600 hover:text-emerald-800 transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
