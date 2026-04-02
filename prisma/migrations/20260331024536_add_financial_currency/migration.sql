-- CreateEnum
CREATE TYPE "GoalCurrency" AS ENUM ('INR', 'CAD');

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "currency" "GoalCurrency";

-- CreateIndex
CREATE INDEX "Goal_currency_idx" ON "Goal"("currency");
