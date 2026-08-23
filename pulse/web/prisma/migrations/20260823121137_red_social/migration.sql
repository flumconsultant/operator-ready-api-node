-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('RECONOCIMIENTO_RECIBIDO', 'COMENTARIO', 'REACCION', 'CELEBRACION');

-- AlterTable
ALTER TABLE "recognitions" ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "cargo" TEXT,
ADD COLUMN     "cumpleanos" TIMESTAMP(3),
ADD COLUMN     "fechaIngreso" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "recognitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEn" TIMESTAMP(3),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actorId" TEXT,
    "recognitionId" TEXT,
    "tipo" "TipoNotificacion" NOT NULL,
    "texto" TEXT NOT NULL,
    "enlace" TEXT NOT NULL,
    "leidaEn" TIMESTAMP(3),
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comments_recognitionId_creadoEn_idx" ON "comments"("recognitionId", "creadoEn");

-- CreateIndex
CREATE INDEX "notifications_userId_leidaEn_creadaEn_idx" ON "notifications"("userId", "leidaEn", "creadaEn");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_recognitionId_fkey" FOREIGN KEY ("recognitionId") REFERENCES "recognitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recognitionId_fkey" FOREIGN KEY ("recognitionId") REFERENCES "recognitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
