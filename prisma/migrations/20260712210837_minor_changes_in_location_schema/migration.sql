/*
  Warnings:

  - You are about to drop the column `scheduledAt` on the `Class` table. All the data in the column will be lost.
  - Added the required column `startsAt` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "scheduledAt",
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "location" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;
