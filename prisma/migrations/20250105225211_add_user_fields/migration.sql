-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "panggilan" TEXT NOT NULL DEFAULT '',
    "gender" TEXT NOT NULL DEFAULT '',
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ANAK_REMAS',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "kategori" TEXT NOT NULL DEFAULT 'mkidz',
    "groupId" TEXT,
    "avatar" TEXT DEFAULT '/avatars/avatar-01.jpg',
    "tanggalLahir" DATETIME,
    "age" INTEGER NOT NULL DEFAULT 0,
    "nomerWhatsapp" TEXT,
    "alamatRumah" TEXT,
    "rwRumah" TEXT,
    "rtRumah" TEXT,
    "sekolah" TEXT,
    "kelas" INTEGER,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("active", "alamatRumah", "avatar", "createdAt", "email", "groupId", "id", "keterangan", "name", "nomerWhatsapp", "password", "role", "rtRumah", "rwRumah", "sekolah", "tanggalLahir", "updatedAt", "username") SELECT "active", "alamatRumah", "avatar", "createdAt", "email", "groupId", "id", "keterangan", "name", "nomerWhatsapp", "password", "role", "rtRumah", "rwRumah", "sekolah", "tanggalLahir", "updatedAt", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
