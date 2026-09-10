"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/password-reset-token";
import { setPasswordSchema, type SetPasswordInput } from "@/lib/validations/signup";

type SetPasswordResult = { success: true } | { success: false; error: string };

export async function setPasswordWithToken(
  token: string,
  input: SetPasswordInput,
): Promise<SetPasswordResult> {
  const parsed = setPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const tokenHash = hashToken(token);

  const user = await db.user.findFirst({
    where: { passwordResetTokenHash: tokenHash },
  });

  if (!user || !user.passwordResetTokenExpiresAt || user.passwordResetTokenExpiresAt < new Date()) {
    return {
      success: false,
      error: "This link is invalid or has expired. Please sign up again.",
    };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
    },
  });

  return { success: true };
}