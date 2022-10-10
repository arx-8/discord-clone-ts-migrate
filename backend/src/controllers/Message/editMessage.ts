import httpStatus from 'http-status';
import messageService from '../../services/message.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const { message } = req.body;
  const { messageId } = req.params;

  const result = await messageService.editMessage(req.user, { message, messageId });
  res.status(httpStatus.CREATED).send(result);
});
