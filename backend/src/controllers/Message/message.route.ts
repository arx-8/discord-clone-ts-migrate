// @ts-expect-error TS(7016): Could not find a declaration file for module 'expr... Remove this comment to see the full error message
import express from 'express';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'mult... Remove this comment to see the full error message
import multer from 'multer';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import validations from './validations';
// @ts-expect-error TS(1192): Module '"/Users/mitsuhiro.h/study/discord-clone-ts... Remove this comment to see the full error message
import messageController from './index';

const upload = multer();
const router = express.Router();

router.get('/:roomId', auth(), messageController.getMessages);
router.post('/send-message', auth(), upload.none(), messageController.sendMessage);
router.put('/edit-message/:messageId', auth(), validate(validations.editMessage), messageController.editMessage);
router.delete('/:messageId', auth(), messageController.deleteMessage);

export default router;
