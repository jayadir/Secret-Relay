import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    message: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export interface User extends Document {
    name: string;
    email: string;
    messages: Message[];
    password: string;
    otp: string;
    otpExpires: Date;
    isVerified: boolean;
    isAccepting: boolean;
}

const userSchema: Schema<User> = new Schema({
    name: {
        type: String, required: [true, "username is required"], trim: true, unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v: string) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    messages: [messageSchema],
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isAccepting: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }
})

const User = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);

export default User;