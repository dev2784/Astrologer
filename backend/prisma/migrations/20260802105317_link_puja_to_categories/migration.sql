-- CreateTable
CREATE TABLE "Puja" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "imageUrl" TEXT,
    "placeOfPuja" TEXT NOT NULL,
    "noOfYajman" TEXT NOT NULL,
    "estimatedTime" TEXT NOT NULL,
    "samagri" TEXT,
    "about" TEXT,
    "benefits" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Puja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PujaFaq" (
    "id" TEXT NOT NULL,
    "pujaId" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "questionHi" TEXT,
    "answerHi" TEXT,

    CONSTRAINT "PujaFaq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Puja_slug_key" ON "Puja"("slug");

-- AddForeignKey
ALTER TABLE "Puja" ADD CONSTRAINT "Puja_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puja" ADD CONSTRAINT "Puja_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PujaFaq" ADD CONSTRAINT "PujaFaq_pujaId_fkey" FOREIGN KEY ("pujaId") REFERENCES "Puja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
