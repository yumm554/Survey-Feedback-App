import mongoose from 'mongoose';

export const dbConnect = async () => {
  try {
    // mongoose.connect(process.env.MONGO_URI!)
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('Connected to MongoDB successfully');
    });

    connection.on('error', (err) => {
      console.error('Failed to connect to MongoDB', err);
      process.exit();
    });
  } catch (error) {
    console.log('Something went wrong!', error);
  }
};
