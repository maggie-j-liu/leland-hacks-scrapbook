/*
  Warnings:

  - You are about to drop the column `number` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[place,userId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `place` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('FIRST', 'SECOND', 'THIRD');

-- DropIndex
DROP INDEX "Vote_number_userId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "number";
ALTER TABLE "Vote" ADD COLUMN     "place" "VoteType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_place_userId_key" ON "Vote"("place", "userId");
