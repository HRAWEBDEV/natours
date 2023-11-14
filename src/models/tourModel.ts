import { Schema, model } from 'mongoose';

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'a tour name must be provided'],
    unique: true,
  },
  rating: { type: Number, default: 4.6 },
  price: { type: Number, required: [true, 'a tour must have price'] },
});

const Tour = model('Tour', tourSchema);
export { Tour };
