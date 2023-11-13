import { mongoConnect } from '@/utils/mongoConnect';
import { Snippet } from '@/models/snippet';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {

    if(req.method !== 'GET') {
        
        return NextResponse.json({success: false, message: `${req.method} method is not allowed`}, {status: 405})
    }
  try {
    await mongoConnect();

    const token = req.headers.get('Authorization');

    if(token !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({
            success: false,
            message: 'unauthorized'
        }, {
            status: 401
        })
    }

    const res = await Snippet.deleteMany({ author: { $exists: 0 } });

    return NextResponse.json({
      success: true,
      message: 'snippets deleted successfully',
    }, {status: 200});
  } catch (err) {
    console.log(err);

    return NextResponse.json({success: false, message: 'internal server error'}, {
        status: 500
    })
  }
}
