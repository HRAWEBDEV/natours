import { Request, Response, NextFunction } from 'express';

const replaceQueryOperator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const strQuery = JSON.stringify(req.query).replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match: string) => `$${match}`,
  );
  req.query = JSON.parse(strQuery);
  next();
};

export { replaceQueryOperator };
