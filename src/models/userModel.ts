import { Schema, InferSchemaType, model } from 'mongoose';
import validator from 'validator';
import bycrypt from 'bcryptjs';

const userSchema = new Schema(
  {
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
      select: false,
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
    changedUserAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    methods: {
      async correctPassword(candidatePassword: string, userPassword: string) {
        return await bycrypt.compare(candidatePassword, userPassword);
      },
      changedPasswordAfter(jwtIAT: number) {
        if (this.changedUserAt) {
          const changedUserTimestamp = this.changedUserAt.getTime() / 1000;
          return jwtIAT < changedUserTimestamp;
        }
        return false;
      },
    },
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    //  hash password
    this.password = await bycrypt.hash(this.password, 12);
    // @ts-ignore
    this.passwordConfrim = undefined;
  }
  next();
});

type TUser = InferSchemaType<typeof userSchema>;
const User = model('User', userSchema);
export { type TUser, User };
