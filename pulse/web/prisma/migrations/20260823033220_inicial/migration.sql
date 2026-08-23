-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'MANAGER', 'COLABORADOR');

-- CreateEnum
CREATE TYPE "Canal" AS ENUM ('WEB', 'DISCORD');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'piloto',
    "discordGuildId" TEXT,
    "discordCanalFeedId" TEXT,
    "limiteIaMensual" INTEGER NOT NULL DEFAULT 2000,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "values" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "emoji" TEXT NOT NULL DEFAULT '✨',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "emailVerified" TIMESTAMP(3),
    "imagen" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'COLABORADOR',
    "equipo" TEXT,
    "discordId" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "invitadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recognitions" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "deUserId" TEXT NOT NULL,
    "paraUserId" TEXT NOT NULL,
    "valueId" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "canal" "Canal" NOT NULL DEFAULT 'WEB',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentimientoScore" DOUBLE PRECISION,
    "especificidad" DOUBLE PRECISION,
    "sentimientoTono" TEXT,
    "analizadoEn" TIMESTAMP(3),

    CONSTRAINT "recognitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "recognitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '👏',
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_insights" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "semanaIso" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "datos" JSONB NOT NULL,
    "generadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "companies_discordGuildId_key" ON "companies"("discordGuildId");

-- CreateIndex
CREATE INDEX "values_companyId_activo_idx" ON "values"("companyId", "activo");

-- CreateIndex
CREATE UNIQUE INDEX "values_companyId_nombre_key" ON "values"("companyId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_discordId_key" ON "users"("discordId");

-- CreateIndex
CREATE INDEX "users_companyId_idx" ON "users"("companyId");

-- CreateIndex
CREATE INDEX "recognitions_companyId_creadoEn_idx" ON "recognitions"("companyId", "creadoEn");

-- CreateIndex
CREATE INDEX "recognitions_paraUserId_creadoEn_idx" ON "recognitions"("paraUserId", "creadoEn");

-- CreateIndex
CREATE INDEX "recognitions_deUserId_creadoEn_idx" ON "recognitions"("deUserId", "creadoEn");

-- CreateIndex
CREATE INDEX "recognitions_companyId_analizadoEn_idx" ON "recognitions"("companyId", "analizadoEn");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_recognitionId_userId_key" ON "reactions"("recognitionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_insights_companyId_semanaIso_key" ON "weekly_insights"("companyId", "semanaIso");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "values" ADD CONSTRAINT "values_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recognitions" ADD CONSTRAINT "recognitions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recognitions" ADD CONSTRAINT "recognitions_deUserId_fkey" FOREIGN KEY ("deUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recognitions" ADD CONSTRAINT "recognitions_paraUserId_fkey" FOREIGN KEY ("paraUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recognitions" ADD CONSTRAINT "recognitions_valueId_fkey" FOREIGN KEY ("valueId") REFERENCES "values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_recognitionId_fkey" FOREIGN KEY ("recognitionId") REFERENCES "recognitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_insights" ADD CONSTRAINT "weekly_insights_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
