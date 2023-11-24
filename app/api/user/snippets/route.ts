import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { mongoConnect } from '@/utils';
import { Snippet } from '@/models';
import { FilterQuery } from 'mongoose';
import { ISnippet } from '@/schema';

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

    // const filter: FilterQuery<ISnippet> = {};

    // const searchParams = new URLSearchParams(req.nextUrl.searchParams);

    // const snippetsCreatedBy = searchParams.get('createdBy');

    // switch (snippetsCreatedBy) {
    //   case 'me':
    //     filter.author = userId;
    //     break;
    //   case 'others':
    //     filter.saved_by = userId;
    //     break;
    //   default:
    //     filter.$or = [
    //       {
    //         author: userId,
    //       },
    //       {
    //         saved_by: { $in: userId },
    //       },
    //     ];
    // }

    const snippets = await Snippet.find({ author: userId });

    console.log(snippets, 's');

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
