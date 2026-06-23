import mongoose from 'mongoose';

const itemSchema =
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  });

export const Item =
  mongoose.model(
    'Item',
    itemSchema
  );