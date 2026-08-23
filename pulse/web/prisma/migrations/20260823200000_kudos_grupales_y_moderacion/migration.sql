-- Un reconocimiento pasa a tener varios destinatarios, se puede retirar, y
-- cada persona puede enlazar su Discord con un código de un solo uso.

ALTER TYPE "AccionAuditada" ADD VALUE IF NOT EXISTS 'PUBLICACION_RETIRADA';
ALTER TYPE "AccionAuditada" ADD VALUE IF NOT EXISTS 'EMPRESA_CREADA';

ALTER TABLE "users"
  ADD COLUMN "codigoDiscord" TEXT,
  ADD COLUMN "codigoDiscordExpira" TIMESTAMP(3);
CREATE UNIQUE INDEX "users_codigoDiscord_key" ON "users"("codigoDiscord");

ALTER TABLE "recognitions"
  ADD COLUMN "retiradoEn" TIMESTAMP(3),
  ADD COLUMN "retiradoPorId" TEXT,
  ADD COLUMN "motivoRetirada" TEXT;

ALTER TABLE "recognitions" ADD CONSTRAINT "recognitions_retiradoPorId_fkey"
  FOREIGN KEY ("retiradoPorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "recognition_recipients" (
    "recognitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "recognition_recipients_pkey" PRIMARY KEY ("recognitionId","userId")
);

CREATE INDEX "recognition_recipients_userId_idx" ON "recognition_recipients"("userId");

-- Se traspasa el destinatario único que había a la tabla nueva ANTES de soltar
-- la columna. Sin esto, actualizar una instalación con datos deja todos los
-- reconocimientos sin nadie que los haya recibido.
INSERT INTO "recognition_recipients" ("recognitionId", "userId")
SELECT "id", "paraUserId" FROM "recognitions";

ALTER TABLE "recognition_recipients" ADD CONSTRAINT "recognition_recipients_recognitionId_fkey"
  FOREIGN KEY ("recognitionId") REFERENCES "recognitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recognition_recipients" ADD CONSTRAINT "recognition_recipients_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP INDEX IF EXISTS "recognitions_paraUserId_creadoEn_idx";
ALTER TABLE "recognitions" DROP CONSTRAINT IF EXISTS "recognitions_paraUserId_fkey";
ALTER TABLE "recognitions" DROP COLUMN "paraUserId";

CREATE INDEX "recognitions_companyId_retiradoEn_creadoEn_idx"
  ON "recognitions"("companyId", "retiradoEn", "creadoEn");

-- Las menciones tienen su propio tipo de notificación: «te mencionó» dice más
-- que «comentó un reconocimiento», que es lo que llegaba antes.
ALTER TYPE "TipoNotificacion" ADD VALUE IF NOT EXISTS 'MENCION';
