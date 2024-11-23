import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { Server as IOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

import { YSocketIO } from 'y-socket.io/dist/server';

export const revalidate = 0;

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      transports: ['websocket', 'polling'], // Allow both WebSocket and polling
      cors: {
        origin: 'https://www.palasio.in', // Allow only your frontend URL
        methods: ['GET', 'POST'],
      },
    });

    const ysocketio = new YSocketIO(io, {
      authenticate: handshake => {
        return true;
        // const token = handshake.auth.token;

        // try {
        //   jwt.verify(token, process.env.JWT_SECRET!);
        //   return true;
        // } catch (err) {
        //   return false;
        // }
      },

      gcEnabled: true,
    });
    ysocketio.initialize();

    res.socket.server.io = io;
  }
  res.end();
}
