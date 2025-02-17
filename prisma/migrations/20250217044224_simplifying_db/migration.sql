/*
  Warnings:

  - You are about to drop the column `description` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `CompanyProfile` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `CompanyProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Institution` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Institution` table. All the data in the column will be lost.
  - You are about to drop the column `cgpa` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_courseId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "description",
DROP COLUMN "industry",
DROP COLUMN "pincode";

-- AlterTable
ALTER TABLE "CompanyProfile" DROP COLUMN "department",
DROP COLUMN "designation";

-- AlterTable
ALTER TABLE "Institution" DROP COLUMN "phone",
DROP COLUMN "pincode";

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "cgpa",
DROP COLUMN "courseId",
DROP COLUMN "skills";

-- DropTable
DROP TABLE "Course";
