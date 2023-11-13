import { mongoConnect } from '@/utils/mongoConnect';
import { Snippet } from '@/models/snippet';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    await mongoConnect();

    const res = await Snippet.deleteMany({ author: { $exists: 0 } });

    return NextResponse.json({
      success: true,
      message: 'snippets deleted successfully',
    });
  } catch (err) {
    console.log(err);
  }
}
