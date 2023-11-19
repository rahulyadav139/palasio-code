import { mongoConnect } from '@/utils';
import { Snippet } from '@/models';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { success: false, message: `${req.method} method is not allowed` },
      { status: 405 }
    );
  }
  try {
    await mongoConnect();

    const token = req.headers.get('authorization');

    if (token !== `Bearer ${process.env.CRON_SECRET!}`) {
      return NextResponse.json(
        {
          success: false,
          message: 'unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const today = new Date();

    await Snippet.deleteMany({
      author: { $exists: 0 },
      created_at: { $lt: new Date(today.setDate(today.getDate() - 7)) },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'snippets deleted successfully',
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { success: false, message: 'internal server error' },
      {
        status: 500,
      }
    );
  }
}
