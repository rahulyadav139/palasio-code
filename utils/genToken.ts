import jwt from 'jsonwebtoken';
interface IPayload {
  sub: string;
}

export const genToken = (payload: IPayload, options?: jwt.SignOptions) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { ...options });
};
