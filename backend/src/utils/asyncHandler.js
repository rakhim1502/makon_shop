const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
        error.message = error.message || 'Server xatoligi';
      }
      next(error);
    });
  };
};

export default asyncHandler;
