import { mongoConnect, genPassword } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models';
import { genToken } from '@/utils';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({
      success: false,
      message: `${req.method} method is not allowed`,
    });
  }

  try {
    const { email, password, name } = await req.json();

    await mongoConnect();

    const { salt, hash } = genPassword(password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'existing user' },
        { status: 409 }
      );
    }

    const user = new User({ email, salt, hash, name });

    await user.save();

    const token = genToken(
      { sub: user?._id.toString() },
      { expiresIn: '195d' }
    );

    const responseBody = {
      success: true,
      message: 'user registered successfully',
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

    return NextResponse.json({
      success: false,
      message: 'internal server error',
    });
  }
}
