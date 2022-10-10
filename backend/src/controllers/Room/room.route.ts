// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'expr... Remove this comment to see the full error message
import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import validations from './validations';
// @ts-expect-error TS(1192) FIXME: Module '"/Users/mitsuhiro.h/study/discord-clone-ts... Remove this comment to see the full error message
import roomsController from './index';

const router = express.Router();

router.post('/get-or-create', auth(), validate(validations.getOrCreateRoom), roomsController.getOrCreateRoom);
router.get('/open-rooms', auth(), roomsController.getOpenRooms);
router.put('/close-room/:roomId', auth(), validate(validations.closeRoom), roomsController.closeRoom);

export default router;
