import httpStatus from 'http-status';
import { FriendRequest, Room, Message } from '../models';
import { FRIEND_STATUS } from '../config/constants/modelsConstants';
import ApiError from '../utils/ApiError';

function friendId(user: $TSFixMe, object: $TSFixMe) {
  if (user._id.toString() === object.sender.toString()) return object.receiver;

  return object.sender;
}

/**
 * Create a message between a user and a friend
 * @param {Object} user
 * @param {Object} body
 * @returns {Promise<User>}
 */
const createMessage = async (user: $TSFixMe, body: $TSFixMe) => {
  const { roomId, text } = body;

  const room = await Room.findOne({
    $or: [{ sender: user._id }, { receiver: user._id }],

    _id: roomId,
  });

  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, `there is no room between you and your friend!`);
  }

  const friendShip = await FriendRequest.findOne({
    $or: [
      { from: user._id, to: friendId(user, room) },
      { to: user._id, from: friendId(user, room) },
    ],
    status: FRIEND_STATUS.FRIEND,
  });

  if (!friendShip) {
    throw new ApiError(httpStatus.NOT_FOUND, `you and your friend do not have friendship!`);
  }

  const message = await Message.create({
    senderId: user._id,
    roomId,
    message: text,
  });

  return message;
};

/**
 * Query for Message
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMessages = async (filter: $TSFixMe, options: $TSFixMe, user: $TSFixMe) => {
  const filterClone = { ...filter };
  const room = await Room.findOne({
    $or: [{ sender: user._id }, { receiver: user._id }],

    _id: filter.roomId,
  });

  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, `there is no room between you and your friend!`);
  }

  if (user._id.toString() === room.sender.toString()) {
    filterClone.messageDeletedBySender = false;
  } else {
    filterClone.messageDeletedByReceiver = false;
  }

  const messages = await Message.paginate(filterClone, options);
  return messages;
};

/**
 * edit a message
 * @param {Object} user
 * @param {Object} data
 * @returns {Promise<User>}
 */
const editMessage = async (user: $TSFixMe, data: $TSFixMe) => {
  const { messageId, message } = data;

  const result = await Message.findOneAndUpdate(
    { _id: messageId, senderId: user._id },
    { message },
    { upsert: true, new: true }
  );

  return result;
};

/**
 * delete a message
 * @param {ObjectId} messageId
 * @returns {Promise<User>}
 */
const deleteMessage = async (user: $TSFixMe, messageId: $TSFixMe) => {
  const message = await Message.findOne({ _id: messageId, senderId: user._id });

  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, `there is no such a message!`);
  }

  // activate below lines only when give sender ability to choose delete mode!

  // const room = await Room.findById(message.roomId);

  // if (user._id.toString() === room.sender.toString()) {
  //   message.messageDeletedBySender = true;
  //   if (user._id.toString() === message.senderId.toString()) {
  //     message.messageDeletedByReceiver = true;
  //   }
  // } else {
  //   message.messageDeletedByReceiver = true;

  //   if (user._id.toString() === message.senderId.toString()) {
  //     message.messageDeletedBySender = true;
  //   }
  // }

  message.messageDeletedBySender = true;
  message.messageDeletedByReceiver = true;

  await message.save();
  return message;
};

export default {
  createMessage,
  queryMessages,
  editMessage,
  deleteMessage,
};
