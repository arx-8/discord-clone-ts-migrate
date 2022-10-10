import express from 'express';
import authRoute from '../../controllers/Auth/auth.route';
import userRoute from '../../controllers/User/user.route';
import friendRoute from '../../controllers/Friend/friend.route';
import roomRoute from '../../controllers/Room/room.route';
import messageRoute from '../../controllers/Message/message.route';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/friends', friendRoute);
router.use('/rooms', roomRoute);
router.use('/messages', messageRoute);

module.exports = router;
