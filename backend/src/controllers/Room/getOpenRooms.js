import httpStatus from 'http-status';
import roomService from '../../services/room.service';
import catchAsync from '../../utils/catchAsync';

module.exports = catchAsync(async (req, res) => {
  const rooms = await roomService.getOpenRooms(req.user);
  res.status(httpStatus.CREATED).send(rooms);
});
