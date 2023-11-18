import crypto from 'crypto';

export const isPasswordValid = (
  salt: string,
  hash: string,
  password: string
): boolean => {
  const existingHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return existingHash === hash;
};
