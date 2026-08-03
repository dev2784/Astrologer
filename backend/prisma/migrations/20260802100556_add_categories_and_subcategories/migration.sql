/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Subcategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nameEn]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameHi]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nameEn` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameHi` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `Subcategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameHi` to the `Subcategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionHi" TEXT,
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameHi" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subcategory" DROP COLUMN "name",
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameHi" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_nameEn_key" ON "Category"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "Category_nameHi_key" ON "Category"("nameHi");
