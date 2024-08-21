import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
});
export default mongoose.model('User', UserSchema);
