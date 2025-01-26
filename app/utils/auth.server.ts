import bcrypt from "bcrypt";
import {createCookieSessionStorage, redirect} from "@remix-run/node";
import db from "./db.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set!");
}

// Session storage configuration
const storage = createCookieSessionStorage({
  cookie: {
    name: "humanature_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

// Create user session
async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Get user session
async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// Get logged in user
async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) return null;

  try {
    const user = await db.user.findUnique({
      where: {id: userId},
    });
    return user;
  } catch {
    return null;
  }
}

// Login user
async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await db.user.findUnique({
    where: {username},
  });

  if (!user) {
    return {error: "Invalid credentials"};
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return {error: "Invalid credentials"};
  }

  return {user};
}

// Logout user
async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export {login, logout, createUserSession, getUserSession, getUser};
