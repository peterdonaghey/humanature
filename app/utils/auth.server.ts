import {createCookieSessionStorage, redirect} from "@remix-run/node";
import {randomBytes, scryptSync} from "crypto";
import db from "./db.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set!");
}

// Password hashing functions
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  const [salt, hash] = hashedPassword.split(":");
  const hashVerify = scryptSync(password, salt, 64).toString("hex");
  return hash === hashVerify;
}

// Session storage configuration
export const storage = createCookieSessionStorage({
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
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

// Get user session
export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// Get logged in user
export async function getUser(request: Request) {
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
export async function login({
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

  const isValidPassword = verifyPassword(password, user.password);

  if (!isValidPassword) {
    return {error: "Invalid credentials"};
  }

  await db.user.update({
    where: {id: user.id},
    data: {lastLogin: new Date()},
  });

  return {user};
}

// Logout user
export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUser({
  username,
  password,
  privilages,
  email,
}: {
  username: string;
  password: string;
  privilages: string[];
  email: string;
}) {
  const existingUser = await db.user.findUnique({
    where: {username},
  });

  if (existingUser) {
    return {error: "Username already exists"};
  }

  const hashedPassword = hashPassword(password);

  return db.user.create({
    data: {
      username,
      password: hashedPassword,
      privilages,
      email,
    },
  });
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const hashedPassword = hashPassword(newPassword);

  return db.user.update({
    where: {id: userId},
    data: {
      password: hashedPassword,
      updatedAt: new Date(),
    },
  });
}

export async function updateUser(
  userId: string,
  newUsername: string,
  newPrivilages: string[],
  newEmail: string
) {
  const existingUser = await db.user.findUnique({
    where: {username: newUsername},
  });

  if (existingUser && existingUser.id !== userId) {
    return {error: "Username already taken"};
  }

  return db.user.update({
    where: {id: userId},
    data: {
      username: newUsername,
      privilages: newPrivilages,
      email: newEmail,
      updatedAt: new Date(),
    },
  });
}

export async function deleteUser(userId: string) {
  return db.user.delete({
    where: {id: userId},
  });
}
