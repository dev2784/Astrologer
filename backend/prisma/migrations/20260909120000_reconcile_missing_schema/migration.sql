-- Reconcile schema changes previously applied outside migration history.
-- Existing tables/columns/data are preserved. Safe on fresh and already-synced databases.
BEGIN;
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL, ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT,
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "googleId" TEXT,
  ADD COLUMN IF NOT EXISTS "avatar" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "bookingDate" TIMESTAMP(3);
-- CreateTable
CREATE TABLE IF NOT EXISTS "Muhurat" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "tithi" TEXT NOT NULL,
    "muhurat" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Muhurat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Panchang" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Panchang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL,
    "pujaId" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT NOT NULL,
    "userCity" TEXT,
    "userPhone" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Gallery" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT,
    "imageUrl" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AboutSection" (
    "id" TEXT NOT NULL DEFAULT 'default_about',
    "name" TEXT NOT NULL DEFAULT 'Acharya Rishi Nagar Ji',
    "image" TEXT,
    "descriptionEn" TEXT NOT NULL,
    "descriptionHi" TEXT,
    "yearsExp" INTEGER NOT NULL DEFAULT 20,
    "pujasDone" INTEGER NOT NULL DEFAULT 5000,
    "whatsappNo" TEXT NOT NULL DEFAULT '919340553012',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Muhurat_date_idx" ON "Muhurat"("date");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Panchang_date_key" ON "Panchang"("date");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Panchang_date_idx" ON "Panchang"("date");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Review_pujaId_idx" ON "Review"("pujaId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Review_isApproved_idx" ON "Review"("isApproved");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Gallery_isFeatured_idx" ON "Gallery"("isFeatured");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Review_pujaId_fkey' AND conrelid = '"Review"'::regclass) THEN
    ALTER TABLE "Review" ADD CONSTRAINT "Review_pujaId_fkey" FOREIGN KEY ("pujaId") REFERENCES "Puja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Review_userId_fkey' AND conrelid = '"Review"'::regclass) THEN
    ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
COMMIT;
