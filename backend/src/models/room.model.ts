import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins';

// @ts-expect-error TS(2348) FIXME: Value of type 'typeof Schema' is not callable. Did... Remove this comment to see the full error message
const roomRequestSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    senderLastSeenMessage: {
      type: String,
    },
    receiverLastSeenMessage: {
      type: String,
    },
    roomDeletedBySender: {
      type: Boolean,
      default: false,
    },
    roomDeletedByReceiver: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
roomRequestSchema.plugin(toJSON);
roomRequestSchema.plugin(paginate);

/**
 * @typedef Room
 */
const Room = mongoose.model('room', roomRequestSchema);

export default Room;
