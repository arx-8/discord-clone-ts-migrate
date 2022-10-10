import httpStatus from 'http-status';
import friendService from '../../services/friend.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req, res) => {
  const pendingList = await friendService.cancelPendingRequest(req.body.id);
  res.status(httpStatus.OK).send(pendingList);
});
