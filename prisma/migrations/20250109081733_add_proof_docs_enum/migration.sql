/*
  Warnings:

  - The values [INSTITUTION_PROOF,COMPANY_PROOF,STUDENT_ID] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('INSTITUTION_ID', 'AUTHORIZATION_LETTER', 'COMPANY_ID', 'BUSINESS_CARD', 'GOVERNMENT_ID', 'DEPARTMENT_LETTER');
ALTER TABLE "Document" ALTER COLUMN "type" TYPE "DocumentType_new" USING ("type"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
COMMIT;
