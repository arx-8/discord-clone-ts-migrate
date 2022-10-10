import httpStatus from 'http-status';
import messageService from '../../services/message.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const { roomId } = req.params;
  const { page } = req.query;
  const filter = {
    roomId,
  };
  const options = {
    sortBy: '_id:desc',
    page,
    populate: 'senderId',
  };
  const messages = await messageService.queryMessages(filter, options, req.user);
  res.status(httpStatus.CREATED).send(messages);
});
