/*
  Warnings:

  - The `microdeposit_url` column on the `checkout_clients` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."checkout_clients" DROP COLUMN "microdeposit_url",
ADD COLUMN     "microdeposit_url" JSONB;
