import { Tour } from '../models/tourModel.js';
const getAllTours = async (req, res) => {
    const { page, sort, ...otherQueries } = req.query;
    const tours = await Tour.find(otherQueries);
    res
        .status(200)
        .json({ status: 'success', result: tours.length, data: tours });
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
export { getAllTours, saveTour, deleteTour, updateTour, getById };
//# sourceMappingURL=tourController.js.map