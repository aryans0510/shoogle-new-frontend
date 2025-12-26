/*
  Warnings:

  - You are about to drop the column `type` on the `listings` table. All the data in the column will be lost.
  - Added the required column `availability` to the `listings` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `listings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Electronics', 'Appliances', 'Services', 'Clothing', 'Toys', 'Art', 'Health', 'Other');

-- CreateEnum
CREATE TYPE "ListingAvailability" AS ENUM ('pickup', 'delivery', 'both');

-- AlterTable
ALTER TABLE "listings" DROP COLUMN "type",
ADD COLUMN     "availability" "ListingAvailability" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
