import mongoose from 'mongoose';
// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'vali... Remove this comment to see the full error message
import validator from 'validator';
// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'bcry... Remove this comment to see the full error message
import bcrypt from 'bcryptjs';
import { toJSON, paginate } from './plugins';
// @ts-expect-error TS(2614) FIXME: Module '"../config/roles"' has no exported member ... Remove this comment to see the full error message
import { roles } from '../config/roles';

// @ts-expect-error TS(2348) FIXME: Value of type 'typeof Schema' is not callable. Did... Remove this comment to see the full error message
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: $TSFixMe) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    shortId: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email: $TSFixMe, excludeUserId: $TSFixMe) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password: $TSFixMe) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function(this: $TSFixMe, next: $TSFixMe) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

export default User;
