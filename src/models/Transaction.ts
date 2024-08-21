import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
    _id: Types.ObjectId;
  fromUserId?: Types.ObjectId;
  toUserId?: Types.ObjectId;
  amount: number;
  transactionType: 'payment' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ['payment', 'transfer'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
