/*
  Warnings:

  - You are about to drop the column `files` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "files";

-- CreateTable
CREATE TABLE "File" (
    "url" STRING NOT NULL,
    "mediaType" STRING NOT NULL,
    "projectId" STRING
);

-- CreateIndex
CREATE UNIQUE INDEX "File_url_key" ON "File"("url");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
