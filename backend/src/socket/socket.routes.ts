import { getConnection } from '../lib/redisConnection';
const redis = getConnection();
import userService from '../services/user.service';

const SOCKET_ID_IN_ROOM = 'socketIdInRoom-';
const USER = 'user-';
const ONLINE_USER = 'online-user-';
const USERS_IN_ROOM = 'usersInRoom-';

export default [
  {
    name: 'online',
    controller: async (socket: $TSFixMe, {
      userId
    }: $TSFixMe) => {
      await redis.set(`${ONLINE_USER}${socket.id}`, userId);

      socket.join(userId);
    },
  },
  {
    name: 'joinRoom',
    controller: async (socket: $TSFixMe, {
      roomId,
      userId
    }: $TSFixMe) => {
      const userObject = await userService.getUserById(userId);

      await Promise.all([
        redis.set(`${SOCKET_ID_IN_ROOM}${socket.id}`, roomId),
        redis.set(`${USER}${socket.id}`, JSON.stringify(userObject)),
        redis.hSet(`${USERS_IN_ROOM}${roomId}`, userId, socket.id),
      ]);

      socket.join(roomId);
    },
  },
  {
    name: 'roomSendMessage',
    controller: async (socket: $TSFixMe, {
      msg,
      receiverId
    }: $TSFixMe) => {
      const [roomId, userObject] = await Promise.all([
        redis.get(`${SOCKET_ID_IN_ROOM}${socket.id}`),
        redis.get(`${USER}${socket.id}`),
      ]);

      const newMessage = msg;
      newMessage.senderId = JSON.parse(userObject);

      if (roomId) socket.to(roomId).emit('roomNewMessage', newMessage);

      const totalUsers = await redis.hGetAll(`${USERS_IN_ROOM}${roomId}`);

      if (Object.keys(totalUsers).length === 1) {
        socket.to(receiverId).emit('roomOpened');
      }
    },
  },
  {
    name: 'sendFriendRequest',
    controller: async (socket: $TSFixMe, {
      receiverId
    }: $TSFixMe) => {
      if (receiverId) {
        socket.to(receiverId).emit('friendRequest');
      }
    },
  },
  {
    name: 'sendFriendAcceptRequest',
    controller: async (socket: $TSFixMe, {
      receiverId
    }: $TSFixMe) => {
      if (receiverId) {
        socket.to(receiverId).emit('friendAcceptRequest');
      }
    },
  },
  {
    name: 'sendRoomDeleteMessage',
    controller: async (socket: $TSFixMe, {
      roomId,
      messageId
    }: $TSFixMe) => {
      if (roomId) {
        socket.to(roomId).emit('roomDeleteMessage', { messageId, roomId });
      }
    },
  },
  {
    name: 'roomSendEditMessage',
    controller: async (socket: $TSFixMe, message: $TSFixMe) => {
      if (message) {
        socket.to(message.roomId).emit('roomEditMessage', message);
      }
    },
  },
  {
    name: 'leaveRoom',
    controller: async (socket: $TSFixMe, roomId: $TSFixMe) => {
      redis.del(`${SOCKET_ID_IN_ROOM}${socket.id}`);
      socket.leave(roomId);
    },
  },
  {
    name: 'logOut',
    controller: async (socket: $TSFixMe, userId: $TSFixMe) => {
      redis.del(`${ONLINE_USER}${socket.id}`);
      redis.del(`${SOCKET_ID_IN_ROOM}${socket.id}`);

      socket.leave(userId);
    },
  },
];
