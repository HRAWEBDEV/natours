import { Schema, model } from 'mongoose';
import validator from 'validator';
import bycrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'please insert your name'],
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'lead-guide'],
        default: 'user',
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
            validator(value) {
                return value == this.password;
            },
            message: 'confirm password is wrong',
        },
    },
    changedUserAt: {
        type: Date,
        default: Date.now(),
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
}, {
    methods: {
        async correctPassword(candidatePassword, userPassword) {
            return bycrypt.compare(candidatePassword, userPassword);
        },
        changedPasswordAfter(jwtIAT) {
            if (this.changedUserAt) {
                const changedUserTimestamp = this.changedUserAt.getTime() / 1000;
                return jwtIAT < changedUserTimestamp;
            }
            return false;
        },
        createPasswordResetToken() {
            const resetToken = randomBytes(32).toString('hex');
            this.passwordResetToken = createHash('sha256')
                .update(resetToken)
                .digest('hex');
            this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
            return resetToken;
        },
    },
});
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        //  hash password
        this.password = await bycrypt.hash(this.password, 12);
        // @ts-ignore
        this.passwordConfrim = undefined;
    }
    next();
});
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.changedUserAt = new Date(Date.now() + 1000);
    next();
});
const User = model('User', userSchema);
export { User };
//# sourceMappingURL=userModel.js.map