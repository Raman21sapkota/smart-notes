import bcrypt from "bcrypt";
import * as userRepository from "../repositories/userRepository.js";
import { generateToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";


// this portion is for user registration
export const registerUser = async ({ name, email, password }) => {

  // validating the input
  //  if (!name || !email || !password) {
  //   throw new AppError("All fields are required", 400);
  // }

  // if (!email.includes("@")) {
  //   throw new AppError("Invalid email format", 400);
  // }

  // if (password.length < 6) {
  //   throw new AppError("Password must be at least 6 characters", 400);
  //   }

  // const normalizedEmail = email.toLowerCase().trim();
  // const normalizedName = name.trim();

  // checking existing user
  const existingUser = await userRepository.findByEmail(email);

  //checking if user exists and if user registered with google Oauth

  if (existingUser) {

    if (!existingUser.password) {
      throw new AppError("Please login using Google", 400);
    }
    else {
      throw new AppError("Email already in use", 400);
    }



  }



  // hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // creating the user
  const user = await userRepository.createUser({
    name: name,
    email: email,
    password: hashedPassword,
  });

  // removing the password such that it is not sent to frontend
  const { password: _, ...safeUser } = user;
  return safeUser;
};

// this portion is for login
export const loginUser = async ({ email, password }) => {
  // if (!email || !password) {
  //   throw new AppError("Email and password are required", 400);
  // }

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  //checking if user registered with google Oauth
  if (!user.password) {
    throw new AppError("Please login using Google", 400);
  }

  //checking if user registered with google Oauth
  // if (user.provider === "google") {
  //   throw new AppError("Please login with Google", 400);
  // }


  const passwordValidityCheck = await bcrypt.compare(password, user.password);

  if (!passwordValidityCheck) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  // removing password before sending user data to frontend
  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    token,
    expiresIn: "12h"
  };
};



