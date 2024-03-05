/*
  Warnings:

  - A unique constraint covering the columns `[originalUrl,belongsToOwner]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_originalUrl_belongsToOwner_key" ON "Link"("originalUrl", "belongsToOwner");
