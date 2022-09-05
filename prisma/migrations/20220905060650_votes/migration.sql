-- CreateTable
CREATE TABLE "Vote" (
    "number" INT4 NOT NULL,
    "userId" STRING NOT NULL,
    "projectId" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_number_userId_key" ON "Vote"("number", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_projectId_userId_key" ON "Vote"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
