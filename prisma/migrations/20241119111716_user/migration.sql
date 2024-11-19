/*
  Warnings:

  - The values [PUBLIC,PRIVATE,PARTNERSHIP,STARTUP,GOVERNMENT] on the enum `CompanyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompanyType_new" AS ENUM ('public', 'private', 'partnership', 'startup', 'government');
ALTER TABLE "Corporate" ALTER COLUMN "companyType" TYPE "CompanyType_new" USING ("companyType"::text::"CompanyType_new");
ALTER TYPE "CompanyType" RENAME TO "CompanyType_old";
ALTER TYPE "CompanyType_new" RENAME TO "CompanyType";
DROP TYPE "CompanyType_old";
COMMIT;
