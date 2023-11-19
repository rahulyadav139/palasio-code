import { User } from '@/models/user';
import { mongoConnect, isPasswordValid, genToken } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      {
        success: false,
        message: `${req.method} method is not allowed`,
      },
      { status: 405 }
    );
  }

  try {
    const { email, password } = await req.json();

    await mongoConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'invalid username or password',
        },
        { status: 401 }
      );
    }

    const isValidUser = isPasswordValid(user.salt, user.hash, password);

    if (!isValidUser) {
      return NextResponse.json(
        { success: false, message: 'invalid username or password' },
        { status: 401 }
      );
    }

    const token = genToken(
      { sub: user?._id.toString() },
      { expiresIn: '195d' }
    );

    const responseBody = {
      success: true,
      message: 'user fetched successfully',
      token,
    };

    const date = new Date();

    date.setTime(date.getTime() + 180 * 24 * 60 * 60 * 1000);

    const response = new NextResponse(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; Path=/; Expires=${date}; Secure;`,
      },
    });

    return response;
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        success: false,
        message: 'internal server error',
      },
      { status: 500 }
    );
  }
}
