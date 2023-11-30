import { Tour } from '../models/tourModel.js';
import { ApiFeatures } from '../utils/ApiFeatures.js';
import { AppError } from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
const getAllTours = async (req, res) => {
    const { page, limit, sort, select, fields, ...otherQueries } = req.query;
    let features = new ApiFeatures({ limit, sort, page, select, fields, ...otherQueries }, Tour.find(otherQueries));
    features.sort().select().paginate();
    const tours = await features.query();
    res.status(StatusCodes.OK).json({
        status: 'success',
        result: tours.length,
        page: features.page,
        limit: features.limit,
        data: tours,
    });
};
const getById = async (req, res) => {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    if (!tour)
        throw new AppError('no tour found with that id', 404);
    res.status(StatusCodes.OK).json({ status: 'success', data: tour });
};
const saveTour = async (req, res) => {
    const tour = await Tour.create({ ...req.body, date: new Date() });
    res.status(StatusCodes.CREATED).json({ status: 'success', data: tour });
};
const deleteTour = async (req, res) => {
    const id = req.params.id;
    const tour = await Tour.findByIdAndDelete(id);
    if (!tour)
        throw new AppError('no tour found with that id', 404);
    res.status(StatusCodes.OK).json({ status: 'success', data: tour });
};
const updateTour = async (req, res) => {
    const id = req.params.id;
    const newTour = req.body;
    const tour = await Tour.findByIdAndUpdate(id, newTour, {
        new: true,
        runValidators: true,
    });
    if (!tour)
        throw new AppError('no tour found with that id', 404);
    res.status(StatusCodes.CREATED).json({ status: 'success', data: tour });
};
const getTourStats = async (req, res) => {
    // * aggregation is a way to manipulate the data in a advanced way
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                // group by id and then calculate required fields
                _id: '$difficulty',
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: {
                avgPrice: 1,
            },
        },
        {
            $match: { _id: { $ne: 'easy' } },
        },
    ]);
    res.json({
        status: 'success',
        data: stats,
    });
};
const getTourMonthlyPlan = async (req, res) => {
    const { year } = req.params;
    // * powerful stuff
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        { $addFields: { month: '$_id' } },
        { $project: { _id: 0 } },
        { $sort: { month: 1 } },
    ]);
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: plan,
    });
};
export { getAllTours, saveTour, deleteTour, updateTour, getById, getTourStats, getTourMonthlyPlan, };
//# sourceMappingURL=tourController.js.map