import httpStatus from 'http-status';
import messageService from '../../services/message.service';
import catchAsync from '../../utils/catchAsync';

export default catchAsync(async (req: $TSFixMe, res: $TSFixMe) => {
  const formData = JSON.parse(JSON.stringify(req.body));
  const message = await messageService.createMessage(req.user, formData);
  res.status(httpStatus.CREATED).send(message);
});
