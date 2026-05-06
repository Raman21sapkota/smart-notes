/*
  Warnings:

  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_provider_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "provider",
ADD COLUMN     "googleId" TEXT;
