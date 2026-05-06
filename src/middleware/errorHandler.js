const errorHandler = (err, req, res, next) => {
  
  console.error(err);

  // to handle prisma duplicate entry error
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${err.meta?.target}`,
    });
  }


  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;