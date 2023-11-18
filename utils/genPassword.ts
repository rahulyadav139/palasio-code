import crypto from 'crypto';

export const genPassword = (password: string) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt,
    hash,
  };
};
