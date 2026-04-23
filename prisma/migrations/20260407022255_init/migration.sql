-- CreateEnum
CREATE TYPE "AuditPlan" AS ENUM ('FREE', 'STARTER', 'GROWTH', 'AUTHORITY');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('LEAD_CREATED', 'AWAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'RAZORPAY');

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

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
