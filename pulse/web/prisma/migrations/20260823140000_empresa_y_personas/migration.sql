-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "dominioCorreo" TEXT,
ADD COLUMN     "logo" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "invitacionExpira" TIMESTAMP(3),
ADD COLUMN     "primerAcceso" TIMESTAMP(3),
ADD COLUMN     "tokenInvitacion" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_tokenInvitacion_key" ON "users"("tokenInvitacion");
