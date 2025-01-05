/*
  Warnings:

  - The values [PENDING,APPROVED,REJECTED] on the enum `CommentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,PUBLISHED] on the enum `PostStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `views` on the `posts` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommentStatus_new" AS ENUM ('pending', 'approved', 'rejected');
ALTER TABLE "comments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "comments" ALTER COLUMN "status" TYPE "CommentStatus_new" USING ("status"::text::"CommentStatus_new");
ALTER TYPE "CommentStatus" RENAME TO "CommentStatus_old";
ALTER TYPE "CommentStatus_new" RENAME TO "CommentStatus";
DROP TYPE "CommentStatus_old";
ALTER TABLE "comments" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PostStatus_new" AS ENUM ('draft', 'published', 'archived');
ALTER TABLE "posts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "posts" ALTER COLUMN "status" TYPE "PostStatus_new" USING ("status"::text::"PostStatus_new");
ALTER TYPE "PostStatus" RENAME TO "PostStatus_old";
ALTER TYPE "PostStatus_new" RENAME TO "PostStatus";
DROP TYPE "PostStatus_old";
ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'published';
COMMIT;

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "views",
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'published';
