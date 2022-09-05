/*
  Warnings:

  - Added the required column `height` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_projectId_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "height" INT4 NOT NULL;
ALTER TABLE "File" ADD COLUMN     "width" INT4 NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
