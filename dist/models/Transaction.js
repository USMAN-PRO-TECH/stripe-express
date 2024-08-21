import mongoose, { Schema } from 'mongoose';
const TransactionSchema = new Schema({
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ['payment', 'transfer'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('Transaction', TransactionSchema);
