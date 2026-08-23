-- CreateEnum
CREATE TYPE "AccionAuditada" AS ENUM ('EMPRESA_ACTUALIZADA', 'PERSONA_INVITADA', 'PERSONA_EDITADA', 'PERSONA_DESACTIVADA', 'PERSONA_REACTIVADA', 'INVITACION_RENOVADA', 'INVITACION_ACEPTADA', 'VALOR_CREADO', 'VALOR_RETIRADO', 'VALOR_REACTIVADO');

-- AlterEnum
BEGIN;
CREATE TYPE "TipoNotificacion_new" AS ENUM ('RECONOCIMIENTO_RECIBIDO', 'COMENTARIO', 'REACCION');
ALTER TABLE "notifications" ALTER COLUMN "tipo" TYPE "TipoNotificacion_new" USING ("tipo"::text::"TipoNotificacion_new");
ALTER TYPE "TipoNotificacion" RENAME TO "TipoNotificacion_old";
ALTER TYPE "TipoNotificacion_new" RENAME TO "TipoNotificacion";
DROP TYPE "public"."TipoNotificacion_old";
COMMIT;

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "actorId" TEXT,
    "actorNombre" TEXT,
    "accion" "AccionAuditada" NOT NULL,
    "objetivoId" TEXT,
    "objetivoNombre" TEXT,
    "cambios" JSONB,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_companyId_creadoEn_idx" ON "audit_logs"("companyId", "creadoEn");

-- CreateIndex
CREATE INDEX "audit_logs_companyId_accion_creadoEn_idx" ON "audit_logs"("companyId", "accion", "creadoEn");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
