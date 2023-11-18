import { NextRequest, NextResponse } from 'next/server';

export function DELETE(req: NextRequest) {
  if (req.method !== 'DELETE') {
    return NextResponse.json({
      success: false,
      message: `${req.method} method is not allowed`,
    });
  }

  try {
    const responseBody = { success: true, message: 'user logout successfully' };

    const date = new Date();

    date.setDate(date.getDate() - 1);

    const response = new NextResponse(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        'Set-Cookie': `token=; Path=/; Expires=${date}; Secure;`,
      },
    });

    return response;
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { success: false, message: 'internal server error' },
      { status: 500 }
    );
  }
}
