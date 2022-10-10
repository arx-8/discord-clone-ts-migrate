import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import socketIo from './socket/io';
import { getConnection } from './lib/redisConnection';

let server: $TSFixMe;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');

  server = http.createServer({}, app);

  // init redis connection
  getConnection();

  // init socket
  // @ts-expect-error TS(2554): Expected 1 arguments, but got 2.
  socketIo.setup(server, cors);

  server.listen(config.port, () => {
    console.info(`--- 🌟  Started --- http://localhost:${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: $TSFixMe) => {
  console.log(error);
  // exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  // if (server) {
  //   server.close();
  // }
});
