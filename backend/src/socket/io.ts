import socketIo from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { getSubConnection, getConnection } from '../lib/redisConnection';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pass... Remove this comment to see the full error message
import passport from 'passport';
// @ts-expect-error TS(2614): Module '"../config/passport"' has no exported memb... Remove this comment to see the full error message
import { jwtStrategy } from '../config/passport';
import routes from './socket.routes';

// https://philenius.github.io/web%20development/2021/03/31/use-passportjs-for-authentication-in-socket-io.html
// authenticate socket.io connection using passport jwt strategy
passport.use('jwt', jwtStrategy);
passport.serializeUser(function (user: $TSFixMe, done: $TSFixMe) {
  if (user) done(null, user);
});

passport.deserializeUser(function (id: $TSFixMe, done: $TSFixMe) {
  done(null, id);
});
const wrapMiddlewareForSocketIo = (middleware: $TSFixMe) => (socket: $TSFixMe, next: $TSFixMe) => middleware(socket.request, {}, next);

let io: $TSFixMe;

const getSocketIo = async () => {
  if (!io) {
    throw new Error('socket not available');
  }

  return io;
};

const setup = async (server: $TSFixMe) => {
  // const subClient = await getSubConnection()
  // const pubClient = await getConnection()

  // const socketIo = new Server();
  // socketIo.adapter(createAdapter(pubClient, subClient));
  // @ts-expect-error TS(2349): This expression is not callable.
  io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })
    .use(wrapMiddlewareForSocketIo(passport.initialize()))
    .use(wrapMiddlewareForSocketIo(passport.session()))
    .use(wrapMiddlewareForSocketIo(passport.authenticate(['jwt'])))
    .on('connection', (socket: $TSFixMe) => {
      // init routes
      routes.map((route) => socket.on(route.name, (data: $TSFixMe) => route.controller(socket, data)));
    });

  return io;
};

export default {
  setup,
  getSocketIo,
};
