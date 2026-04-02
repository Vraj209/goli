-- CreateEnum
CREATE TYPE "GoalKind" AS ENUM ('STANDARD', 'FINANCIAL');

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "kind" "GoalKind" NOT NULL DEFAULT 'STANDARD';

-- CreateIndex
CREATE INDEX "Goal_kind_idx" ON "Goal"("kind");
