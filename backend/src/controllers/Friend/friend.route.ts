import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import validations from './validations';
// @ts-expect-error TS(1192) FIXME: Module '"/Users/mitsuhiro.h/study/discord-clone-ts... Remove this comment to see the full error message
import friendsController from './index';

const router = express.Router();

router.post('/add-friend-request', auth(), validate(validations.createFriendRequest), friendsController.createFriendRequest);
router.get('/pending-requests', auth(), friendsController.getPendingRequests);
router.get('/outgoing-requests', auth(), friendsController.outGoingRequests);
router.patch('/cancel-pending-request', auth(), friendsController.cancelPendingRequest);
router.patch('/accept-pending-request', auth(), friendsController.acceptPendingRequest);
router.get('/all-friends', auth(), friendsController.getAllFriends);

export default router;
