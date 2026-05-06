import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const authMiddleware = (req, res, next) => {
  try {

    const token = req.cookies.jwt;

    if (!token) {
      throw new AppError("Unauthorized: No token provided", 401);
    }   
    // Get token from header
   // const authHeader = req.headers.authorization;

   // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   throw new AppError("Unauthorized: Invalid token", 401);
    // }

    // Extracting token
   // const token = authHeader.split(" ")[1];

    //  Verifying token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attaching user to the request
    req.user = decodedToken;

    next();

  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export default authMiddleware;