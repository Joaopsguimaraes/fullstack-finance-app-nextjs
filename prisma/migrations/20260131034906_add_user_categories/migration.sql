-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categories_user_id_idx" ON "categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_user_id_key" ON "categories"("name", "user_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert system categories
INSERT INTO "categories" ("id", "name", "user_id", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'FOOD', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'TRANSPORT', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'ENTERTAINMENT', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'UTILITIES', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'HEALTH', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'EDUCATION', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'DEBTS', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'SALARY', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'FREELANCE', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'INVESTMENTS', NULL, NOW(), NOW()),
  (gen_random_uuid(), 'OTHER', NULL, NOW(), NOW());

-- AlterTable - Add category_id column
ALTER TABLE "transactions" ADD COLUMN "category_id" TEXT;

-- AlterTable - Convert category enum to text by creating temp column
ALTER TABLE "transactions" ADD COLUMN "category_temp" TEXT;
UPDATE "transactions" SET "category_temp" = "category"::text;

-- Link existing transactions to system categories
UPDATE "transactions" t
SET "category_id" = c.id
FROM "categories" c
WHERE t."category_temp" = c.name AND c.user_id IS NULL;

-- Drop old category column and rename temp
ALTER TABLE "transactions" DROP COLUMN "category";
ALTER TABLE "transactions" RENAME COLUMN "category_temp" TO "category";
ALTER TABLE "transactions" ALTER COLUMN "category" SET NOT NULL;

-- DropEnum
DROP TYPE "TransactionCategory";

-- CreateIndex
CREATE INDEX "transactions_category_id_idx" ON "transactions"("category_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
