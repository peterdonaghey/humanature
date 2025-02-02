import {json, redirect} from "@remix-run/node";
import {Form, useActionData} from "@remix-run/react";
import type {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {Layout} from "~/components/Layout";
import {createUser, getUser} from "~/utils/auth.server";

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const privilages = formData.getAll("privilages");
  const email = formData.get("email");
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !Array.isArray(privilages) ||
    typeof email !== "string"
  ) {
    return json({error: "Invalid form data"}, {status: 400});
  }

  const result = await createUser({
    username,
    password,
    privilages: privilages as string[],
    email,
  });

  if ("error" in result) {
    return json({error: result.error}, {status: 400});
  }

  return redirect("/users");
}

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!user?.privilages.includes("userAdmin")) {
    return redirect("/");
  }
  return null;
}

export default function CreateUser() {
  const actionData = useActionData<typeof action>();
  const privilegesOptions = ["admin", "userAdmin"];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Create New User</h1>

        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="privilages"
              className="block text-sm font-medium mb-2"
            >
              Privilages
            </label>
            <div className="space-y-2">
              {privilegesOptions.map((priv) => (
                <label key={priv} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="privilages"
                    value={priv}
                    className="rounded text-emerald-600"
                  />
                  <span>{priv}</span>
                </label>
              ))}
            </div>
          </div>

          {actionData?.error && (
            <div className="text-red-600 text-sm">{actionData.error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Create User
          </button>
        </Form>
      </div>
    </Layout>
  );
}
