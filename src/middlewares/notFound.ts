import { Request, Response } from 'express';

const notFound = async (req: Request, res: Response) => {
  res.status(404).json({
    status: 'failed',
    message: `can't find ${req.originalUrl}`,
  });
};

export { notFound };
