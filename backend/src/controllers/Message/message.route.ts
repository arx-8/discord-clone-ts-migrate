import express from 'express';
import multer from 'multer';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import validations from './validations';
import messageController from './index';

const upload = multer();
const router = express.Router();

router.get('/:roomId', auth(), messageController.getMessages);
router.post('/send-message', auth(), upload.none(), messageController.sendMessage);
router.put('/edit-message/:messageId', auth(), validate(validations.editMessage), messageController.editMessage);
router.delete('/:messageId', auth(), messageController.deleteMessage);

export default router;
