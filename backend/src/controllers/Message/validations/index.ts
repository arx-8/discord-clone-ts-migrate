import Joi from 'joi';
// @ts-expect-error TS(2614) FIXME: Module '"../../../validations/custom.validation"' ... Remove this comment to see the full error message
import { objectId } from '../../../validations/custom.validation';

const createMessage = {
  body: Joi.object().keys({
    text: Joi.string().required(),
    roomId: Joi.string().custom(objectId),
  }),
};

const editMessage = {
  body: Joi.object().keys({
    message: Joi.string().required(),
  }),
  params: Joi.object().keys({
    messageId: Joi.string().required(),
  }),
};

export default {
  createMessage,
  editMessage,
};
