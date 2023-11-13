import { NextRequest, NextResponse } from 'next/server';
import { Snippet } from '@/models/snippet';
import { mongoConnect } from '@/utils/mongoConnect';

export async function GET(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      {
        success: false,
        message: `${req.method} method is not allowed`,
      },
      { status: 405 }
    );
  }
  try {
    await mongoConnect();

    const snippet = await Snippet.findOne({ uid: params.snippetId });

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

    return NextResponse.json({
      success: false,
      message: 'internal server error',
    });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
) {
  if (req.method !== 'PATCH') {
    return NextResponse.json(
      {
        success: false,
        message: `${req.method} method is not allowed`,
      },
      { status: 405 }
    );
  }
  try {
    await mongoConnect();

    const payload = await req.json();

    await Snippet.findOneAndUpdate(
      { uid: params.snippetId },
      {
        data: payload.data,
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
