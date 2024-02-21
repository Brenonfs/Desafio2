-- CreateTable
CREATE TABLE "communications" (
    "id" SERIAL NOT NULL,
    "messageType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schoolId" INTEGER NOT NULL,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
