import { User } from '@/models';
import { mongoConnect } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import { escapeRegExp } from '@/utils';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const query = params.get('query') ?? '';
  const limit = params.get('limit') ?? 10;

  let token = req.cookies.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }

  try {
    jwt.verify(token.value, process.env.JWT_SECRET!);

    await mongoConnect();

    const users = await User.find({
      $or: [
        {
          first_name: {
            $regex: escapeRegExp(query),
            $options: 'i',
          },
        },
        {
          last_name: {
            $regex: escapeRegExp(query),
            $options: 'i',
          },
        },
        {
          email: {
            $regex: escapeRegExp(query),
            $options: 'i',
          },
        },
      ],
    })
      .select({ name: 1, email: 1 })
      .limit(+limit);

    return NextResponse.json(
      {
        success: false,
        message: 'users fetched successfully',
        users,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        success: false,
        message: 'something went wrong',
      },
      {
        status: 500,
      }
    );
  }
}
