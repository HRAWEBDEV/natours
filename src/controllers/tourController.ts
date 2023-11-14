import { Request, Response, NextFunction } from 'express';
import { Tour } from '../models/tourModel.js';

const getAllTours = async (req: Request, res: Response) => {};
const saveTour = async (req: Request, res: Response) => {};
const deleteTour = async (req: Request, res: Response) => {};
const updateTour = async (req: Request, res: Response) => {};

export { getAllTours, saveTour, deleteTour, updateTour };
