const excludeQueryList = ['sort', 'page', 'limit', 'skip'];
const filterQuery = ({ query }) => {
    const queryCopy = { ...query };
    excludeQueryList.forEach((item) => delete queryCopy[item]);
    return queryCopy;
};
export { filterQuery };
//# sourceMappingURL=excludeQuery.js.map