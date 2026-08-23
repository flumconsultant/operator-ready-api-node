-- Iconos de valores, banderas de onboarding y presentaciones.

ALTER TABLE "companies" ADD COLUMN "onboardingEn" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "onboardingEn" TIMESTAMP(3);

-- Los valores pasan de un emoji escrito a mano a una clave del catálogo.
ALTER TABLE "values" ADD COLUMN "icono" TEXT NOT NULL DEFAULT 'chispa';

-- Se traduce lo que ya había en vez de dejarlo todo en el icono por defecto:
-- una empresa piloto que ya tenía sus cinco valores no debería encontrárselos
-- todos iguales el día que actualiza.
UPDATE "values" SET "icono" = CASE "emoji"
  WHEN '🤝' THEN 'colaboracion'
  WHEN '🎯' THEN 'cliente'
  WHEN '🧭' THEN 'criterio'
  WHEN '🌱' THEN 'aprendizaje'
  WHEN '🫱' THEN 'cuidado'
  WHEN '❤️' THEN 'pasion'
  WHEN '🔥' THEN 'impulso'
  WHEN '💡' THEN 'ideas'
  WHEN '⚡' THEN 'energia'
  WHEN '🚀' THEN 'ambicion'
  WHEN '🏆' THEN 'logro'
  WHEN '⭐' THEN 'excelencia'
  WHEN '🛡️' THEN 'integridad'
  WHEN '👀' THEN 'atencion'
  WHEN '⏰' THEN 'puntualidad'
  WHEN '🔍' THEN 'curiosidad'
  WHEN '📣' THEN 'voz'
  WHEN '🎁' THEN 'generosidad'
  ELSE 'chispa'
END;

ALTER TABLE "values" DROP COLUMN "emoji";

-- Las presentaciones: el «Say Hi» de quien se incorpora.
CREATE TABLE "presentaciones" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presentaciones_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "presentaciones_userId_key" ON "presentaciones"("userId");
CREATE INDEX "presentaciones_companyId_creadaEn_idx" ON "presentaciones"("companyId", "creadaEn");

ALTER TABLE "presentaciones" ADD CONSTRAINT "presentaciones_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "presentaciones" ADD CONSTRAINT "presentaciones_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
