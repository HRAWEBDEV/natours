const notFound = async (req, res) => {
    res.status(404).json({
        status: 'failed',
        message: `can't find ${req.originalUrl}`,
    });
};
export { notFound };
//# sourceMappingURL=notFound.js.map