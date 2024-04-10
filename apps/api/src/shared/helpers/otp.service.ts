import { randomInt, randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcryptjs';
export async function generateOtp() {
  const newotp: number = randomInt(100000, 999999);
  return newotp;
}

export async function generateArgonHash(data: string) {
  const salt = randomBytes(64);

  const valueWithSecret = (data + process.env.ARGON_SECRET_PEPPER) as string;

  const hashed = await argon2.hash(valueWithSecret, { salt });
  return hashed;
}
export async function generateHash(data: string) {
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);

  const valueWithSecret = (data + process.env.ARGON_SECRET_PEPPER) as string;

  const hashed = await bcrypt.hash(valueWithSecret, salt);
  return hashed;
}

export async function generateOtpHash(data: string) {
  const valueWithSecret = (data + process.env.ARGON_SECRET_PEPPER) as string;
  const hashed = await bcrypt.hash(
    valueWithSecret,
    process.env.ARGON_SECRET_PEPPER,
  );
  return hashed;
}

export async function verifyHash(otphashed: string, data: string) {
  const valueWithSecret = (data + process.env.ARGON_SECRET_PEPPER) as string;
  const isValid = await bcrypt.compare(otphashed, valueWithSecret);
  return isValid;
}
