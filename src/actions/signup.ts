"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signupSchema, type SignupInput } from "@/lib/validations/signup";

type SignupResult = { success: true } | { success: false; error: string };

export async function signUpUser(input: SignupInput): Promise<SignupResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const email = parsed.data.email.toLowerCase().trim();

  const [existingAdmin, existingUser] = await Promise.all([
    db.admin.findUnique({ where: { email } }),
    db.user.findUnique({ where: { email } }),
  ]);

  if (existingAdmin || existingUser) {
    return { success: false, error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await db.user.create({
    data: {
      name: parsed.data.fullName,
      email,
      password: hashedPassword,
    },
  });

  return { success: true };
}