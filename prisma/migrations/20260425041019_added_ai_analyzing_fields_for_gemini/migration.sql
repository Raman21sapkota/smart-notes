-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "actionItems" TEXT[],
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "tags" TEXT[];
