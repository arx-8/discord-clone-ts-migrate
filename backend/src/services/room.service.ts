import httpStatus from 'http-status';
import { FriendRequest, Room } from '../models';
import { FRIEND_STATUS } from '../config/constants/modelsConstants';
import ApiError from '../utils/ApiError';

/**
 * Create a direct room between a user and a friend
 * @param {Object} user
 * @param {Object} body
 * @returns {Promise<User>}
 */
const getOrCreateRoom = async (user: $TSFixMe, body: $TSFixMe) => {
  const { id } = body;

  const friendShip = await FriendRequest.findOne({
    $or: [
      { from: user._id, to: id },
      { from: id, to: user._id },
    ],
    status: FRIEND_STATUS.FRIEND,
  });

  if (!friendShip) {
    throw new ApiError(httpStatus.NOT_FOUND, `you and your friend do not have friendship!`);
  }

  if (friendShip._id.toString() === user._id.toString()) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, `You cannot send dm to yourself!`);
  }

  const alreadyRoom = await Room.findOne({
    $or: [
      {
        $and: [{ sender: user._id }, { receiver: id }],
      },
      {
        $and: [{ sender: id }, { receiver: user._id }],
      },
    ],
  });

  if (alreadyRoom) {
    if (alreadyRoom.sender.toString() === user._id.toString()) {
      alreadyRoom.roomDeletedBySender = false;
      alreadyRoom.save();
    } else {
      alreadyRoom.roomDeletedByReceiver = false;
      alreadyRoom.save();
    }

    return alreadyRoom;
  }

  const createdRoom = await Room.create({ sender: user._id, receiver: id });

  return createdRoom;
};

/**
 * all open rooms between a user and friends
 * @param {Object} user
 * @returns {Promise<User>}
 */
const getOpenRooms = async (user: $TSFixMe) => {
  const rooms = await Room.find({
    $or: [
      { sender: user._id, roomDeletedBySender: false },
      {
        receiver: user._id,
        roomDeletedByReceiver: false,
      },
    ],
  })
    .populate({ path: 'sender' })
    .populate({ path: 'receiver' });

  return rooms;
};

/**
 * close a room by sender or receiver
 * @param {Object} user
 * @param {string} roomId
 * @returns {Promise<User>}
 */
const closeRoom = async (user: $TSFixMe, roomId: $TSFixMe) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, `room not existed!`);
  }

  if (user._id.toString() !== room.sender.toString() && user._id.toString() !== room.receiver.toString()) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, `you are not allowed to do this!`);
  }

  if (user._id.toString() === room.sender.toString()) {
    room.roomDeletedBySender = true;
  } else if (user._id.toString() === room.receiver.toString()) {
    room.roomDeletedByReceiver = true;
  }

  await room.save();

  return room;
};

export default {
  getOrCreateRoom,
  getOpenRooms,
  closeRoom,
};
