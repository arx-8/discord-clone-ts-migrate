import httpStatus from 'http-status';
import friendService from '../../services/friend.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const pendingList = await friendService.getAllFriends(req.user);
  res.status(httpStatus.OK).send(pendingList);
});
