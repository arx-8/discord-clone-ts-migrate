import mongoose from 'mongoose';
import { toJSON } from './plugins';
// @ts-expect-error TS(2614): Module '"../config/tokens"' has no exported member... Remove this comment to see the full error message
import { tokenTypes } from '../config/tokens';

// @ts-expect-error TS(2348): Value of type 'typeof Schema' is not callable. Did... Remove this comment to see the full error message
const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);

export default Token;
