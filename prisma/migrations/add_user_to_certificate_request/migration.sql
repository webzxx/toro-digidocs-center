-- AlterTable
ALTER TABLE "CertificateRequest" ADD COLUMN "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;