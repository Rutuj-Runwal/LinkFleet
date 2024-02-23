-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "linkId" SERIAL NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "encrypt" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("linkId")
);

-- CreateTable
CREATE TABLE "LinkStatistics" (
    "statId" SERIAL NOT NULL,
    "visits" TIMESTAMP(3)[],
    "region" TEXT[],

    CONSTRAINT "LinkStatistics_pkey" PRIMARY KEY ("statId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkStatistics_statId_key" ON "LinkStatistics"("statId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkStatistics" ADD CONSTRAINT "LinkStatistics_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Link"("linkId") ON DELETE RESTRICT ON UPDATE CASCADE;
