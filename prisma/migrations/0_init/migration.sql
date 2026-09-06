-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('PRODUCER', 'CLIENT');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."Genre" AS ENUM ('INDIE', 'HIPHOP', 'TRAP', 'POP', 'LOFI', 'REGGAETON', 'RNB', 'ELECTRONICA', 'ROCK', 'OTRO');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProducerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "specialty" TEXT,
    "stripeAccountId" TEXT,
    "stripeOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProducerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Beat" (
    "id" TEXT NOT NULL,
    "producerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "genre" "public"."Genre" NOT NULL,
    "bpm" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "priceCurrency" TEXT NOT NULL DEFAULT 'USD',
    "previewFileUrl" TEXT NOT NULL,
    "fullFileUrl" TEXT NOT NULL,
    "previewDurationSeconds" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stem" (
    "id" TEXT NOT NULL,
    "beatId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "beatId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConversationUser" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ConversationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "ProducerProfile_userId_key" ON "public"."ProducerProfile"("userId");

-- CreateIndex
CREATE INDEX "Beat_genre_idx" ON "public"."Beat"("genre");

-- CreateIndex
CREATE INDEX "Beat_producerId_idx" ON "public"."Beat"("producerId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON "public"."Order"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Order_clientId_idx" ON "public"."Order"("clientId");

-- CreateIndex
CREATE INDEX "Order_beatId_idx" ON "public"."Order"("beatId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "public"."Order"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationUser_conversationId_userId_key" ON "public"."ConversationUser"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "public"."Message"("conversationId");

-- AddForeignKey
ALTER TABLE "public"."ProducerProfile" ADD CONSTRAINT "ProducerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Beat" ADD CONSTRAINT "Beat_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "public"."ProducerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Stem" ADD CONSTRAINT "Stem_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "public"."Beat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_beatId_fkey" FOREIGN KEY ("beatId") REFERENCES "public"."Beat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationUser" ADD CONSTRAINT "ConversationUser_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationUser" ADD CONSTRAINT "ConversationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

