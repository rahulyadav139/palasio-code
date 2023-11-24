import { mongoConnect } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Snippet } from '@/models';
import crypto from 'crypto';

export async function POST(
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

    const existingSnippet = await Snippet.findOne({
      uid: params.snippetUid,
      saved_by: { $nin: userId },
    });

    if (!existingSnippet) {
      return NextResponse.json(
        {
          success: false,
          message: 'saved already',
        },
        {
          status: 409,
        }
      );
    }

    const snippetObj = JSON.parse(JSON.stringify(existingSnippet));

    const [uid] = crypto.randomUUID().split('-');

    const snippet = new Snippet({
      data: snippetObj.data,
      author: userId,
      language: snippetObj.language,
      name: snippetObj.name,
      uid,
      original_uid: snippetObj.uid,
    });

    await snippet.save();

    existingSnippet.saved_by.push(userId);

    await existingSnippet.save();

    return NextResponse.json(
      {
        success: true,
        message: 'snippet saved successfully',
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
