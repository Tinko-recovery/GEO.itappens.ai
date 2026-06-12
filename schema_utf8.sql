-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AuditPlan" AS ENUM ('FREE', 'STARTER', 'GROWTH', 'AUTHORITY');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('LEAD_CREATED', 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'RAZORPAY');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('AWAITING_PAYMENT', 'ACTIVE', 'PAUSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "normalizedDomain" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT,
    "targetKeywords" TEXT[],
    "shareToken" TEXT NOT NULL,
    "plan" "AuditPlan" NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'LEAD_CREATED',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "paymentProvider" "PaymentProvider",
    "checkoutSessionId" TEXT,
    "paymentOrderId" TEXT,
    "paymentId" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "crawlDepth" INTEGER NOT NULL DEFAULT 5,
    "freeScore" INTEGER,
    "fullScore" INTEGER,
    "submittedIpHash" TEXT,
    "captchaVerifiedAt" TIMESTAMP(3),
    "summaryJson" JSONB,
    "reportJson" JSONB,
    "reportHtml" TEXT,
    "errorMessage" TEXT,
    "paymentCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "targetQueries" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "geoScore" INTEGER,
    "geoReport" JSONB,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "automationStatus" TEXT NOT NULL DEFAULT 'pending',
    "externalId" TEXT,
    "enrichedData" JSONB,
    "competitors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastContactedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "toneOfVoice" TEXT NOT NULL DEFAULT 'Professional & Authoritative',
    "bufferAccessToken" TEXT,
    "linkedinProfileId" TEXT,
    "twitterProfileId" TEXT,
    "instagramProfileId" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPost" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "publishedAt" TIMESTAMP(3),
    "bufferId" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailOTP" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailOTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCredits" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "stripeCustomerId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCredits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressSite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "appUser" TEXT NOT NULL,
    "appToken" TEXT NOT NULL,
    "toneOfVoice" TEXT DEFAULT 'Professional and Authoritative',
    "targetAudience" TEXT DEFAULT 'General Audience',
    "formattingRules" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordPressSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AeoArticle" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "targetQuery" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "wpPostId" INTEGER,
    "scheduledFor" TIMESTAMP(3),
    "seedKeyword" TEXT,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "ecommerceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AeoArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "icp" TEXT,
    "competitors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetMarkets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "goals" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencyClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyAudit" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "results" JSONB,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AgencyAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyStrategy" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "roadmap" JSONB,
    "clusters" JSONB,
    "competitorTargets" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "AgencyStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyContentItem" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "strategyId" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "draftMarkdown" TEXT,
    "schemaJson" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "publishedUrl" TEXT,

    CONSTRAINT "AgencyContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyReport" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "citationRate" JSONB,
    "topPages" JSONB,
    "competitorMovement" JSONB,
    "actionsTaken" JSONB,
    "actionsPlanned" JSONB,
    "pdfUrl" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgencyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyMcpConfig" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "apiKey" TEXT,
    "config" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgencyMcpConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyAuditLog" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgencyAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "readTime" TEXT NOT NULL DEFAULT '5 min read',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Audit_shareToken_key" ON "Audit"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "Audit_checkoutSessionId_key" ON "Audit"("checkoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Audit_paymentOrderId_key" ON "Audit"("paymentOrderId");

-- CreateIndex
CREATE INDEX "Audit_email_createdAt_idx" ON "Audit"("email", "createdAt");

-- CreateIndex
CREATE INDEX "Audit_normalizedDomain_createdAt_idx" ON "Audit"("normalizedDomain", "createdAt");

-- CreateIndex
CREATE INDEX "Audit_status_createdAt_idx" ON "Audit"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_auditId_createdAt_idx" ON "AuditEvent"("auditId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_email_key" ON "ClientProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_token_key" ON "ClientProfile"("token");

-- CreateIndex
CREATE UNIQUE INDEX "EmailOTP_email_key" ON "EmailOTP"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserCredits_email_key" ON "UserCredits"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserCredits_stripeCustomerId_key" ON "UserCredits"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditTransaction_stripeSessionId_key" ON "CreditTransaction"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPost" ADD CONSTRAINT "ClientPost_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "UserCredits"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AeoArticle" ADD CONSTRAINT "AeoArticle_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "WordPressSite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyAudit" ADD CONSTRAINT "AgencyAudit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AgencyClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyStrategy" ADD CONSTRAINT "AgencyStrategy_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AgencyClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyContentItem" ADD CONSTRAINT "AgencyContentItem_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AgencyClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyContentItem" ADD CONSTRAINT "AgencyContentItem_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "AgencyStrategy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyReport" ADD CONSTRAINT "AgencyReport_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AgencyClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyMcpConfig" ADD CONSTRAINT "AgencyMcpConfig_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AgencyClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyAuditLog" ADD CONSTRAINT "AgencyAuditLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "AgencyClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

