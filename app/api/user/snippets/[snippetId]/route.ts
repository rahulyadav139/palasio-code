import { mongoConnect } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Snippet } from '@/models';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
) {
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

  const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET!);
  try {
    await mongoConnect();

    const payload = await req.json();

    await Snippet.findOneAndUpdate(
      {
        _id: params.snippetId,
        $or: [{ collaborators: userId }, { author: userId }],
      },
      {
        data: payload.data,
        name: payload.name,
        language: payload.language,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'snippet updated successfully!',
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
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

    await Snippet.findOneAndDelete({
      _id: params.snippetId,
      author: userId,
    });

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
