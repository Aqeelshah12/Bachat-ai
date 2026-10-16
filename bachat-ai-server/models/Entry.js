import mongoose from 'mongoose'

const entrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rawText: { type: String, required: true },
    income: [
      {
        amount: Number,
        period: String,
        note: String,
      },
    ],
    expenses: [
      {
        type: { type: String },
        amount: Number,
        frequency: String,
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Entry', entrySchema)