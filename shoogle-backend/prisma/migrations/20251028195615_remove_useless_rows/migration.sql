/*
  Warnings:

  - You are about to drop the column `email` on the `identities` table. All the data in the column will be lost.
  - You are about to drop the column `last_sign_in` on the `identities` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."identities_email_key";

-- AlterTable
ALTER TABLE "identities" DROP COLUMN "email",
DROP COLUMN "last_sign_in",
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
