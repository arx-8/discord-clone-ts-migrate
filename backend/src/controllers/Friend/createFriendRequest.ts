import httpStatus from 'http-status';
import friendService from '../../services/friend.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const user = await friendService.createFriendRequest(req.user, req.body);
  res.status(httpStatus.CREATED).send(user);
});
