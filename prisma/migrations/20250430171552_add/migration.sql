/*
  Warnings:

  - A unique constraint covering the columns `[publicId,folderId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_publicId_folderId_key" ON "File"("publicId", "folderId");
