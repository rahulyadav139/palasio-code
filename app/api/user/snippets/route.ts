import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { mongoConnect } from '@/utils';
import { Snippet } from '@/models';

export async function GET(
  req: NextRequest,
  test: { searchParams?: { [key: string]: string | string[] | undefined } }
) {
  if (req.method !== 'GET') {
    return NextResponse.json({
      success: false,
      message: `${req.method} method is not allowed`,
    });
  }
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }

  const { sub: userId } = jwt.verify(token.value, process.env.JWT_SECRET!);

  try {
    await mongoConnect();

    const snippets = await Snippet.find({
      $or: [{ author: userId }, { collaborators: userId }],
    });

    return NextResponse.json(
      {
        success: false,
        message: 'snippets fetched successfully',
        snippets,
      },
      { status: 200 }
    );
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
