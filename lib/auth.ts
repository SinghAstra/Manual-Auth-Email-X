import { AccessTokenPayload } from "@/interfaces/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRATION = "7d";

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables."
  );
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET as string
    ) as unknown as AccessTokenPayload;
    return decoded;
  } catch (error) {
    console.log("Access token verification failed.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return null;
  }
}
