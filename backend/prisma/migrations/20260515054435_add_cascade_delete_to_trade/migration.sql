-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_skillId_fkey";

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
