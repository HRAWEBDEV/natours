import { Schema, InferSchemaType, model } from 'mongoose';
import validator from 'validator';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'please insert your name'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.default.isEmail, 'please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minLength: [8, 'a password must be at least eight characters'],
  },
  passwordConfrim: {
    type: String,
    required: [true, 'please confirm your password'],
    // * only works for save and create (not on save)
    validate: {
      validator(this: any, value: string) {
        return value == this.password;
      },
      message: 'confirm password is wrong',
    },
  },
});

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
  }
  next();
});

type TUser = InferSchemaType<typeof userSchema>;
const User = model('User', userSchema);
export { type TUser, User };
