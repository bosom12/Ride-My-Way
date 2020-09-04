import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: 'fullName is required',
    },
    username: {
      type: String,
      trim: true,
      required: 'username is required',
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: 'phone number is required ',
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: 'email is required',
    },
    password: {
      type: String,
      trim: true,
      required: 'password is required',
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
    verifyToken: String,
    verifyExpire: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function () {
  // if (this.isModified('password')) {
    const saltRounds = 10;

    const genSalt = await bcrypt.genSalt(saltRounds);

    const hash = await bcrypt.hash(this.password, genSalt);

    this.password = hash;
    return;
  // }
});

const comparePassword = async function (password) {
  const user = this;
  console.log('data =>>>', password + ',', 'hash =>>>', user.password)
  return await bcrypt.compare(password, user.password);
};

UserSchema.methods.comparePassword = comparePassword

UserSchema.methods.toJSON = function () {
  const _user = this.toObject();
  delete _user.password;
  return _user;
};

const user = mongoose.model('User', UserSchema);

export default user;
