import type {ActionFunctionArgs} from "@remix-run/node";
import {logout} from "~/utils/auth.server";

export async function action({request}: ActionFunctionArgs) {
  return await logout(request);
}
