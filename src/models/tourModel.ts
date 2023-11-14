import { Schema, model } from 'mongoose';

const tourSchema = new Schema({});

const Tour = model('Tour', tourSchema);
export { Tour };
