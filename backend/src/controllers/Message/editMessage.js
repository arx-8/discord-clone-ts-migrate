import httpStatus from 'http-status';
import messageService from '../../services/message.service';
import catchAsync from '../../utils/catchAsync';

module.exports = catchAsync(async (req, res) => {
  const { message } = req.body;
  const { messageId } = req.params;

  const result = await messageService.editMessage(req.user, { message, messageId });
  res.status(httpStatus.CREATED).send(result);
});
