import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
      required: [true, 'Comments are required'],
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

const Feedback =
  mongoose.models.feedbacks || mongoose.model('feedbacks', feedbackSchema);

export default Feedback;
