import * as authService from "../services/authService.js";
import { generateToken } from "../utils/jwt.js";

//controller for registering user
export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registration successful",
      data : user,
    });

  } 
  
  catch (error) {
    next(error);
  }
};

//controller for login
export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    //setting cookie with the token generated in loginUser function
    res.cookie("jwt", result.token,
       { httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 }); 


    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error) {
    next(error);
  }
};


//logout controller
export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


//google oauth callback controller
export const googleAuthCallback = async (req, res, next) => {
  try {
  
    // generating token for the authenticated user
    const token = generateToken({
      id: req.user.id,
      email: req.user.email,
    }); 

    // setting cookie with the generated token

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000, 
    });


   res.redirect(process.env.CLIENT_URL);


  } catch (error) { 
    next(error);
  }
};


