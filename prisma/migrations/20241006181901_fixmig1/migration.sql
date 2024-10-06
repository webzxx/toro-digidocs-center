-- AlterTable
ALTER TABLE "CertificateRequest" ALTER COLUMN "referenceNumber" SET DEFAULT concat('VVFJ-', to_char(nextval('reference_number_seq'), 'FM00000'));

-- AlterTable
ALTER TABLE "Resident" ALTER COLUMN "bahayToroSystemId" SET DEFAULT concat('BAHAY-TORO-', to_char(nextval('bahay_toro_system_id_seq'), 'FM00000'));
