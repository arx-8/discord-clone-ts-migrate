import httpStatus from 'http-status';
import roomService from '../../services/room.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const rooms = await roomService.getOpenRooms(req.user);
  res.status(httpStatus.CREATED).send(rooms);
});
