/*
  Warnings:

  - The values [Pengumuman,Kajian,Kegiatan,Rapat,Lainnya] on the enum `PostCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [anakremas,koordinator_anakremas,orangtuawali,marbot,takmir,admin] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostCategory_new" AS ENUM ('PENGUMUMAN', 'KAJIAN', 'KEGIATAN', 'RAPAT', 'LAINNYA');
ALTER TABLE "posts" ALTER COLUMN "category" TYPE "PostCategory_new" USING ("category"::text::"PostCategory_new");
ALTER TYPE "PostCategory" RENAME TO "PostCategory_old";
ALTER TYPE "PostCategory_new" RENAME TO "PostCategory";
DROP TYPE "PostCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ANAK_REMAS', 'KOORDINATOR_ANAK_REMAS', 'ORANG_TUA_WALI', 'MARBOT', 'TAKMIR', 'ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ANAK_REMAS';
