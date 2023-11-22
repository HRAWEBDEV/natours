import { Request } from 'express-serve-static-core';

const excludeQueryList = ['sort', 'page', 'limit', 'skip'];

const filterQuery = ({ query }: { query: Request['query'] }) => {
  const queryCopy = { ...query };
  excludeQueryList.forEach((item) => delete queryCopy[item]);
  return queryCopy;
};

export { filterQuery };
