import { NextRequest, NextResponse } from 'next/server';
import { Snippet } from '@/models';
import { mongoConnect } from '@/utils';
import { FilterQuery } from 'mongoose';
import { ISnippet } from '@/schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { snippetUid: string } }
) {
  const searchParams = req.nextUrl.searchParams;
  const isCollaborative = searchParams.get('isCollaborative');
  try {
    await mongoConnect();

    const filter: FilterQuery<ISnippet> = {
      uid: params.snippetUid,
    };

    if (isCollaborative) {
      filter.isCollaborative = isCollaborative;
    }

    let query = Snippet.findOne(filter);

    if (isCollaborative) {
      query = query.populate({
        path: 'collaborators',
        select: {
          name: 1,
          email: 1,
        },
      });
    }

    const snippet = await query.exec();

    if (!snippet) {
      throw new Error('not found');
    }

    return NextResponse.json({
      success: true,
      message: 'snippet fetched successfully!',
      snippet,
    });
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { snippetUid: string } }
) {
  try {
    await mongoConnect();

    const payload = await req.json();

    await Snippet.findOneAndUpdate(
      {
        uid: params.snippetUid,
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
