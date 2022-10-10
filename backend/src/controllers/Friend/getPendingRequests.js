import httpStatus from 'http-status';
import friendService from '../../services/friend.service';
import catchAsync from '../../utils/catchAsync';

module.exports = catchAsync(async (req, res) => {
  const pendingList = await friendService.pendingFriendRequests(req.user);
  res.status(httpStatus.OK).send(pendingList);
});
