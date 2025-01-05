/*
  Warnings:

  - Changed the type of `category` on the `posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('PENGUMUMAN', 'KAJIAN', 'KEGIATAN', 'RAPAT', 'LAINNYA');

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "category",
ADD COLUMN     "category" "PostCategory" NOT NULL;
