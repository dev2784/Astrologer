/*
  Warnings:

  - Added the required column `charges` to the `Puja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Puja" ADD COLUMN     "charges" TEXT NOT NULL;
