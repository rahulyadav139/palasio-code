import { NextRequest, NextResponse } from 'next/server';
import { Snippet } from '@/models/snippet';
import { mongoConnect } from '@/utils/mongoConnect';

export async function GET(
  req: NextRequest,
  { params }: { params: { snippetId: string } }
) {
  try {
    await mongoConnect();

    // req.nextUrl.searchParams.
    // const url = new URL(req.url);
    // url.searchParams
    // console.log(params.snippetId, 'test');
    const snippet = await Snippet.findOne({ uid: params.snippetId });

    if (!snippet) {
      throw new Error('not found');
    }

    return NextResponse.json({
      success: true,
      message: 'snippet fetched successfully!',
      //   data: '',
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
