-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('A20', 'A30', 'A40', 'A50', 'A60P');

-- CreateEnum
CREATE TYPE "BudgetTier" AS ENUM ('LOW', 'MID', 'HIGH');

-- CreateEnum
CREATE TYPE "TimePreference" AS ENUM ('WEEKDAY_EVENING', 'WEEKEND', 'BOTH');

-- CreateEnum
CREATE TYPE "RelationshipPref" AS ENUM ('SOLO', 'PEOPLE', 'ANY');

-- CreateEnum
CREATE TYPE "SpacePref" AS ENUM ('INDOOR', 'OUTDOOR', 'ANY');

-- CreateEnum
CREATE TYPE "VariantMode" AS ENUM ('SOLO', 'GROUP', 'HYBRID');

-- CreateEnum
CREATE TYPE "VariantSpace" AS ENUM ('INDOOR', 'OUTDOOR', 'MIXED');

-- CreateEnum
CREATE TYPE "VariantBudgetTier" AS ENUM ('LOW', 'MID', 'HIGH');

-- CreateEnum
CREATE TYPE "TimeTier" AS ENUM ('MICRO', 'SHORT', 'LONG');

-- CreateEnum
CREATE TYPE "Seasonality" AS ENUM ('ALL', 'SPRING', 'SUMMER', 'FALL', 'WINTER');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MID', 'HIGH');

-- CreateEnum
CREATE TYPE "VariantStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "BoardStatus" AS ENUM ('SAVED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TriedStatus" AS ENUM ('TRIED', 'NOT_TRIED');

-- CreateEnum
CREATE TYPE "PerceivedDifficulty" AS ENUM ('EASY', 'NORMAL', 'HARD');

-- CreateEnum
CREATE TYPE "SpendCategory" AS ENUM ('FASHION', 'DINING', 'TRAVEL', 'DIGITAL_CONTENT', 'FITNESS', 'CULTURE', 'SELF_DEV', 'HOME_LIVING', 'PET', 'FINANCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ageGroup" "AgeGroup" NOT NULL,
    "budgetTier" "BudgetTier" NOT NULL,
    "timePreference" "TimePreference" NOT NULL,
    "relationshipPref" "RelationshipPref" NOT NULL,
    "spacePref" "SpacePref" NOT NULL,
    "topSpend1" "SpendCategory" NOT NULL,
    "topSpend2" "SpendCategory" NOT NULL,
    "topSpend3" "SpendCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hobby" (
    "id" TEXT NOT NULL,
    "hobbyKey" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "oneLiner" TEXT NOT NULL,
    "coreTags" TEXT[],
    "starterKit" TEXT[],
    "contraindications" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "variantKey" TEXT NOT NULL,
    "hobbyId" TEXT NOT NULL,
    "mode" "VariantMode" NOT NULL,
    "space" "VariantSpace" NOT NULL,
    "budgetTier" "VariantBudgetTier" NOT NULL,
    "timeTier" "TimeTier" NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "seasonality" "Seasonality" NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "weeklyPlan7d" TEXT[],
    "plan30d" TEXT[],
    "shortCaption" TEXT NOT NULL,
    "longCaption" TEXT NOT NULL,
    "hashtags" TEXT[],
    "proofPrompt" TEXT NOT NULL,
    "status" "VariantStatus" NOT NULL DEFAULT 'DRAFT',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reasonLine" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationItem" (
    "id" TEXT NOT NULL,
    "logId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "explain" TEXT NOT NULL,
    "estCost" TEXT NOT NULL,
    "estTime" TEXT NOT NULL,
    "supplies" TEXT[],

    CONSTRAINT "RecommendationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "triedStatus" "TriedStatus" NOT NULL,
    "satisfaction" INTEGER NOT NULL,
    "perceivedDifficulty" "PerceivedDifficulty" NOT NULL,
    "spendAmount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "status" "BoardStatus" NOT NULL DEFAULT 'SAVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_ageGroup_idx" ON "UserProfile"("ageGroup");

-- CreateIndex
CREATE INDEX "UserProfile_budgetTier_idx" ON "UserProfile"("budgetTier");

-- CreateIndex
CREATE UNIQUE INDEX "Hobby_hobbyKey_key" ON "Hobby"("hobbyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_variantKey_key" ON "Variant"("variantKey");

-- CreateIndex
CREATE INDEX "Variant_status_idx" ON "Variant"("status");

-- CreateIndex
CREATE INDEX "Variant_budgetTier_timeTier_space_mode_idx" ON "Variant"("budgetTier", "timeTier", "space", "mode");

-- CreateIndex
CREATE INDEX "RecommendationItem_variantId_idx" ON "RecommendationItem"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "RecommendationItem_logId_rank_key" ON "RecommendationItem"("logId", "rank");

-- CreateIndex
CREATE INDEX "Feedback_userId_createdAt_idx" ON "Feedback"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Feedback_variantId_createdAt_idx" ON "Feedback"("variantId", "createdAt");

-- CreateIndex
CREATE INDEX "BoardItem_userId_status_idx" ON "BoardItem"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BoardItem_userId_variantId_key" ON "BoardItem"("userId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicProfile_userId_key" ON "PublicProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicProfile_shareToken_key" ON "PublicProfile"("shareToken");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_hobbyId_fkey" FOREIGN KEY ("hobbyId") REFERENCES "Hobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationLog" ADD CONSTRAINT "RecommendationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationItem" ADD CONSTRAINT "RecommendationItem_logId_fkey" FOREIGN KEY ("logId") REFERENCES "RecommendationLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationItem" ADD CONSTRAINT "RecommendationItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardItem" ADD CONSTRAINT "BoardItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardItem" ADD CONSTRAINT "BoardItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicProfile" ADD CONSTRAINT "PublicProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
