import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { mongoConnect } from '@/utils';
import { User } from '@/models';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function GET(req: NextRequest) {
  let token: RequestCookie | undefined | string = req.cookies.get('token');

  if (!token) {
    token = req.headers.get('Authorization') ?? undefined;
  } else {
    token = token.value;
  }

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }

  try {
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET!);

    await mongoConnect();

    const user = await User.findById(userId).select({ salt: 0, hash: 0 });

    return NextResponse.json(
      {
        success: false,
        message: 'user fetched successfully',
        user,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);

    const responseBody = { success: false, message: 'internal server error' };

    const date = new Date();

    date.setDate(date.getDate() - 1);

    const response = new NextResponse(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        'Set-Cookie': `token=; Path=/; Expires=${date}; Secure;`,
      },
    });

    return response;
  }
}
