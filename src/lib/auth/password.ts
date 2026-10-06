import bcrypt from "bcrypt";

export const BCRYPT_ROUNDS = 12;
const ROUNDS = BCRYPT_ROUNDS;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, passwordHash);
}
