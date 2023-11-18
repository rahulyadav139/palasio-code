import { mongoConnect, genPassword } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({
      success: false,
      message: `${req.method} method is not allowed`,
    });
  }

  try {
    const { email, password } = await req.json();

    await mongoConnect();

    const { salt, hash } = genPassword(password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'existing user' },
        { status: 409 }
      );
    }

    const user = new User({ email, salt, hash });

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'user registered successfully',
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      success: false,
      message: 'internal server error',
    });
  }
}
