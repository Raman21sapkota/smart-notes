import prisma from "../config/prisma.js";

export const findByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = (data) => {
  return prisma.user.create({
    data
  });
};

// linking google account to existing user
export const linkGoogleAccount = (userId, googleId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { googleId: googleId },
  });
}