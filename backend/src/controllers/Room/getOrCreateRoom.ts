import httpStatus from 'http-status';
import roomService from '../../services/room.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const room = await roomService.getOrCreateRoom(req.user, req.body);
  res.status(httpStatus.CREATED).send(room);
});
