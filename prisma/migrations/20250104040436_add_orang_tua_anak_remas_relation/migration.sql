-- CreateTable
CREATE TABLE "orang_tua_anak_remas" (
    "id" TEXT NOT NULL,
    "orangTuaId" TEXT NOT NULL,
    "anakRemasId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orang_tua_anak_remas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orang_tua_anak_remas_orangTuaId_anakRemasId_key" ON "orang_tua_anak_remas"("orangTuaId", "anakRemasId");

-- AddForeignKey
ALTER TABLE "orang_tua_anak_remas" ADD CONSTRAINT "orang_tua_anak_remas_orangTuaId_fkey" FOREIGN KEY ("orangTuaId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orang_tua_anak_remas" ADD CONSTRAINT "orang_tua_anak_remas_anakRemasId_fkey" FOREIGN KEY ("anakRemasId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
