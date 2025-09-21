import dotenv from 'dotenv';

dotenv.config();

export const env = (key, required = true) => {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
};
