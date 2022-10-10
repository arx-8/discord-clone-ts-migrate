import Joi from 'joi';
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

module.exports = {
  getOrCreateRoom,
  closeRoom
};
