/*
  Warnings:

  - A unique constraint covering the columns `[belongsToLink]` on the table `LinkStatistics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `belongsToLink` to the `LinkStatistics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LinkStatistics" DROP CONSTRAINT "LinkStatistics_statId_fkey";

-- AlterTable
ALTER TABLE "LinkStatistics" ADD COLUMN     "belongsToLink" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LinkStatistics_belongsToLink_key" ON "LinkStatistics"("belongsToLink");

-- AddForeignKey
ALTER TABLE "LinkStatistics" ADD CONSTRAINT "LinkStatistics_belongsToLink_fkey" FOREIGN KEY ("belongsToLink") REFERENCES "Link"("linkId") ON DELETE RESTRICT ON UPDATE CASCADE;
