import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins';

// @ts-expect-error TS(2348): Value of type 'typeof Schema' is not callable. Did... Remove this comment to see the full error message
const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    roomId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Room',
      required: true,
    },
    message: {
      type: String,
    },
    messageDeletedBySender: {
      type: Boolean,
      default: false,
    },
    messageDeletedByReceiver: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema);

export default Message;
