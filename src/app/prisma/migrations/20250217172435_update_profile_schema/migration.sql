-- CreateTable
CREATE TABLE "ProfileLanguage" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "proficiency" INTEGER NOT NULL,

    CONSTRAINT "ProfileLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileMovingPreference" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ProfileMovingPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileStayingPreference" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ProfileStayingPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileLanguage" ADD CONSTRAINT "ProfileLanguage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMovingPreference" ADD CONSTRAINT "ProfileMovingPreference_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileStayingPreference" ADD CONSTRAINT "ProfileStayingPreference_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
