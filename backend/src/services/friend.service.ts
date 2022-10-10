import httpStatus from 'http-status';
import { User, FriendRequest } from '../models';
import { FRIEND_STATUS } from '../config/constants/modelsConstants';
import ApiError from '../utils/ApiError';

/**
 * Create a friend request
 * @param {Object} user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createFriendRequest = async (user: $TSFixMe, userBody: $TSFixMe) => {
  const { username, shortId } = userBody;

  const foundUser = await User.findOne({ username, shortId });

  if (!foundUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Hm, didn't work. Double check that the capitalization, spelling, any spaces, and numbers are correct.`
    );
  }

  if (foundUser._id.toString() === user.id.toString()) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, `You cannot invite yourself!`);
  }

  const alreadyRequest = await FriendRequest.findOne({ from: user.id, to: foundUser._id });

  if (alreadyRequest) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'You already send the request');
  }

  const friendRequest = await FriendRequest.create({ from: user.id, to: foundUser._id });

  return friendRequest;
};

/**
 * get pending friend requests
 * @param {Object} user
 * @returns {Promise<User>}
 */
const pendingFriendRequests = async (user: $TSFixMe) => {
  const friendRequest = await FriendRequest.find({ to: user.id, status: FRIEND_STATUS.PENDING })
    .populate({ path: 'to' })
    .populate({ path: 'from' });

  return friendRequest;
};

/**
 * get outgoing friend requests
 * @param {Object} user
 * @returns {Promise<User>}
 */
const outGoingRequests = async (user: $TSFixMe) => {
  const friendRequest = await FriendRequest.find({ from: user.id, status: FRIEND_STATUS.PENDING })
    .populate({ path: 'to' })
    .populate({ path: 'from' });

  return friendRequest;
};

/**
 * accept friend request
 * @param {ObjectId} requestId
 * @returns {Promise<User>}
 */
const cancelPendingRequest = async (requestId: $TSFixMe) => {
  const deletedRequest = await FriendRequest.findByIdAndRemove({ _id: requestId });

  return deletedRequest;
};

/**
 * accept friend request
 * @param {ObjectId} requestId
 * @returns {Promise<User>}
 */
const acceptPendingRequest = async (user: $TSFixMe, requestId: $TSFixMe) => {
  const friendRequest = await FriendRequest.findById({ _id: requestId });

  if (friendRequest.status !== FRIEND_STATUS.PENDING) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Request status is not correct');
  }

  if (user.id.toString() !== friendRequest.to.toString()) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'You cant accept friend request');
  }

  friendRequest.status = FRIEND_STATUS.FRIEND;
  const result = await friendRequest.save();

  return result;
};

/**
 * get all friends
 * @param {ObjectId} requestId
 * @returns {Promise<User>}
 */
const getAllFriends = async (user: $TSFixMe) => {
  const friends = await FriendRequest.find({ $or: [{ to: user.id }, { from: user.id }], status: FRIEND_STATUS.FRIEND })
    .populate({ path: 'to' })
    .populate({ path: 'from' });

  return friends;
};

export default {
  createFriendRequest,
  pendingFriendRequests,
  outGoingRequests,
  cancelPendingRequest,
  acceptPendingRequest,
  getAllFriends,
};
