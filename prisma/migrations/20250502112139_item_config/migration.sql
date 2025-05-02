/*
  Warnings:

  - A unique constraint covering the columns `[userId,itemId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quantity` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_itemId_key" ON "CartItem"("userId", "itemId");
