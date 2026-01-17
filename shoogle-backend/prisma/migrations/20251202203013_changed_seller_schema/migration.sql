/*
  Warnings:

  - You are about to drop the column `brand_name` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `mobile_number` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `seller` table. All the data in the column will be lost.
  - The `subscription_plan` column on the `seller` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "subscriptionPlan" AS ENUM ('free', 'pro', 'enterprise');

-- DropIndex
DROP INDEX "public"."seller_email_key";

-- AlterTable
ALTER TABLE "seller" DROP COLUMN "brand_name",
DROP COLUMN "email",
DROP COLUMN "full_name",
DROP COLUMN "mobile_number",
DROP COLUMN "whatsapp",
ADD COLUMN     "business_name" TEXT,
ADD COLUMN     "whatsapp_number" TEXT,
DROP COLUMN "subscription_plan",
ADD COLUMN     "subscription_plan" "subscriptionPlan" NOT NULL DEFAULT 'free';
