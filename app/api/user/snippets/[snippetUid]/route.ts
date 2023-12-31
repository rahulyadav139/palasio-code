import { mongoConnect } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Snippet } from '@/models';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { snippetUid: string } }
) {
  try {
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
    await mongoConnect();

    await Snippet.findOneAndDelete({ uid: params.snippetUid, author: userId });

    return NextResponse.json(
      {
        success: true,
        message: 'snippet deleted successfully',
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
        message: 'internal server error',
      },
      {
        status: 500,
      }
    );
  }
}
