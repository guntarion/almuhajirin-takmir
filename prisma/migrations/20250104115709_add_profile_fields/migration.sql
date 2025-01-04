-- AlterTable
ALTER TABLE "users" ADD COLUMN     "alamatRumah" TEXT,
ADD COLUMN     "avatar" TEXT DEFAULT '/avatars/avatar-01.jpg',
ADD COLUMN     "keterangan" TEXT,
ADD COLUMN     "nomerWhatsapp" TEXT,
ADD COLUMN     "rtRumah" TEXT,
ADD COLUMN     "rwRumah" TEXT,
ADD COLUMN     "sekolah" TEXT,
ADD COLUMN     "tanggalLahir" TIMESTAMP(3);
