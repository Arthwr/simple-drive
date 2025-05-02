/*
  Warnings:

  - A unique constraint covering the columns `[storagePath]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "storagePath" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "File_storagePath_key" ON "File"("storagePath");
