-- CreateTable
CREATE TABLE "CheckedIn" (
    "email" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckedIn_email_key" ON "CheckedIn"("email");
