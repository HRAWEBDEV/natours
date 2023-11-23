import { Tour } from '../models/tourModel.js';
import { ApiFeatures } from '../utils/ApiFeatures.js';
const getAllTours = async (req, res) => {
    const { page, limit, sort, select, fields, ...otherQueries } = req.query;
    let features = new ApiFeatures({ limit, sort, page, select, fields, ...otherQueries }, Tour.find(otherQueries));
    features.sort().select().paginate();
    const tours = await features.query();
    res.status(200).json({
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
    res.status(200).json({ status: 'success', data: tour });
};
const saveTour = async (req, res) => {
    try {
        const tour = await Tour.create({ ...req.body, date: new Date() });
        res.status(200).json({ status: 'success', data: tour });
    }
    catch (err) {
        res.status(404).json({ status: 'failed', error: err });
    }
};
const deleteTour = async (req, res) => {
    const id = req.params.id;
    try {
        const tour = await Tour.findByIdAndDelete(id);
        res.status(200).json({ status: 'success', data: tour });
    }
    catch (err) { }
};
const updateTour = async (req, res) => {
    const id = req.params.id;
    const newTour = req.body;
    try {
        const tour = await Tour.findByIdAndUpdate(id, newTour, {
            new: true,
            runValidators: true,
        });
        res.status(301).json({ status: 'success', data: tour });
    }
    catch (err) { }
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
            },
        },
        { $sort: { _id: 1 } },
    ]);
    res.status(200).json({
        status: 'success',
        data: plan,
    });
};
export { getAllTours, saveTour, deleteTour, updateTour, getById, getTourStats, getTourMonthlyPlan, };
//# sourceMappingURL=tourController.js.map