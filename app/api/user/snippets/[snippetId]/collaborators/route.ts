import { mongoConnect } from '@/utils';
import { Snippet } from '@/models';
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
) {
  try {
    await mongoConnect();

    const payload = await req.json();

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

    const snippet = await Snippet.findOne({
      _id: params.snippetId,
      isCollaborative: true,
      author: userId,
    });

    let collaborators = JSON.parse(JSON.stringify(snippet)).collaborators;

    collaborators = collaborators
      .filter((el: string) => !payload.remove.includes(el))
      .concat(payload.add);

    snippet.collaborators = collaborators;

    await snippet.save();

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
