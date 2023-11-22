const replaceQueryOperator = (req, res, next) => {
    const strQuery = JSON.stringify(req.query).replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    req.query = JSON.parse(strQuery);
    next();
};
export { replaceQueryOperator };
//# sourceMappingURL=replaceQueryOperators.js.map