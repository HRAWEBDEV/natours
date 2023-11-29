import { Schema, model, InferSchemaType, Types } from 'mongoose';
import slugify from 'slugify';

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal than 40 characters'],
      minLength: [10, 'A tour name must have more or equal than 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator(this: any, val: number) {
          return val < (this.price as number);
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coodinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coodinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: Schema.ObjectId, ref: 'User' }],
  },
  {
    virtuals: {
      durationWeeks: {
        get() {
          return Math.floor(this.duration / 7);
        },
      },
    },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

// * run before save and create middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify.default(this.name, { lower: true });
  next();
});

// * save middleware
tourSchema.post('save', function (doc, next) {
  next();
});

type TTour = InferSchemaType<typeof tourSchema>;
const Tour = model('Tour', tourSchema);
export { Tour, type TTour };
