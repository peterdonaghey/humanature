import {Form, useActionData} from "@remix-run/react";
import type {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {useLanguage} from "~/contexts/LanguageContext";
import {login, createUserSession, getUser} from "~/utils/auth.server";
import {Layout} from "~/components/Layout";

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username !== "string" || typeof password !== "string") {
    return json({error: "Invalid form data"}, {status: 400});
  }

  const {user, error} = await login({username, password});

  if (error) {
    return json({error}, {status: 400});
  }

  if (!user) {
    return json({error: "Invalid credentials"}, {status: 400});
  }

  return createUserSession(user.id, "/");
}

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
}

export default function Login() {
  const {language} = useLanguage();
  const actionData = useActionData<typeof action>();

  const texts = {
    title: language === "pt" ? "Entrar" : "Login",
    username: language === "pt" ? "Nome de usuário" : "Username",
    password: language === "pt" ? "Senha" : "Password",
    submit: language === "pt" ? "Entrar" : "Sign In",
  };

  return (
    <Layout>
      <div className="py-24 flex items-center justify-center bg-stone-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-emerald-600">
              {texts.title}
            </h2>
          </div>

          <Form method="post" className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  {texts.username}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                           shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {texts.password}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                           shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {actionData?.error && (
              <div className="text-red-600 text-sm text-center">
                {actionData.error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                       transition-colors duration-200"
            >
              {texts.submit}
            </button>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
