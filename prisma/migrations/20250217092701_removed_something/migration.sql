/*
  Warnings:

  - Made the column `website` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `website` on table `Institution` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'STUDENT_ID';

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "website" SET NOT NULL;

-- AlterTable
ALTER TABLE "Institution" ALTER COLUMN "website" SET NOT NULL;
