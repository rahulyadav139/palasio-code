import { NextRequest, NextResponse } from 'next/server';
import { Snippet } from '@/models/snippet';
import { mongoConnect } from '@/utils/mongoConnect';

export async function POST(req: Request) {
  const data = await req.json();

  try {
    await mongoConnect();
    const snippet = new Snippet(data);

    await snippet.save();

    return NextResponse.json({ success: true, message: 'snippet saved!' });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: 'internal server error',
    });
  }
}
