/*
  Warnings:

  - Added the required column `belongsToOwner` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_linkId_fkey";

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "belongsToOwner" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_belongsToOwner_fkey" FOREIGN KEY ("belongsToOwner") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
