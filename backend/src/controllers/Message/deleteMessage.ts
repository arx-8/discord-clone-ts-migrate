import httpStatus from 'http-status';
import messageService from '../../services/message.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const { messageId } = req.params;

  const deleted = await messageService.deleteMessage(req.user, messageId);
  res.status(httpStatus.OK).send(deleted);
});
