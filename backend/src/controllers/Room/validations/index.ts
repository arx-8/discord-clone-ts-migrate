import Joi from 'joi';
// @ts-expect-error TS(2614): Module '"../../../validations/custom.validation"' ... Remove this comment to see the full error message
import { objectId } from '../../../validations/custom.validation';

const getOrCreateRoom = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const closeRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId),
  }),
};

export default {
  getOrCreateRoom,
  closeRoom,
};
