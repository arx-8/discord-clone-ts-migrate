import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import validations from './validations';
import roomsController from './index';

const router = express.Router();

router.post('/get-or-create', auth(), validate(validations.getOrCreateRoom), roomsController.getOrCreateRoom);
router.get('/open-rooms', auth(), roomsController.getOpenRooms);
router.put('/close-room/:roomId', auth(), validate(validations.closeRoom), roomsController.closeRoom);

module.exports = router;
