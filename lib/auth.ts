import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./prisma";

const SESSION_COOKIE = "ops_session";
const SESSION_TTL_DAYS = 7;

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  mustChangePassword: boolean;
};

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return;
  }
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await prisma.session.deleteMany({ where: { tokenHash } });
  cookies().set(SESSION_COOKIE, "", { path: "/", expires: new Date(0) });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const session = await prisma.session.findFirst({
    where: { tokenHash, expiresAt: { gt: new Date() } },
    include: { user: true },
  });
  if (!session) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    mustChangePassword: session.user.mustChangePassword,
  };
}

export async function requireSession() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }
  return user;
}
