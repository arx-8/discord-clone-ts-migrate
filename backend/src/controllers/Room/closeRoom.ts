import httpStatus from 'http-status';
import roomService from '../../services/room.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const { user } = req;
  const { roomId } = req.params;

  const rooms = await roomService.closeRoom(user, roomId);
  res.status(httpStatus.OK).send(rooms);
});
