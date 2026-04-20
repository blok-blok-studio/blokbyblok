import { config } from "dotenv";
config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ACHIEVEMENT_DEFINITIONS = [
  { key: "first_lesson", name: "First Steps", description: "Complete your first lesson", icon: "🎯", category: "learning", order: 1 },
  { key: "ten_lessons", name: "Bookworm", description: "Complete 10 lessons", icon: "📚", category: "learning", threshold: 10, order: 2 },
  { key: "fifty_lessons", name: "Knowledge Seeker", description: "Complete 50 lessons", icon: "🧠", category: "learning", threshold: 50, order: 3 },
  { key: "first_course", name: "Graduate", description: "Complete your first course", icon: "🎓", category: "learning", order: 4 },
  { key: "all_courses", name: "Valedictorian", description: "Complete every available course", icon: "👑", category: "learning", order: 5 },
  { key: "streak_3", name: "Getting Started", description: "Maintain a 3-day learning streak", icon: "🔥", category: "streak", threshold: 3, order: 6 },
  { key: "streak_7", name: "Weekly Warrior", description: "Maintain a 7-day learning streak", icon: "⚡", category: "streak", threshold: 7, order: 7 },
  { key: "streak_14", name: "Consistent", description: "Maintain a 14-day learning streak", icon: "💪", category: "streak", threshold: 14, order: 8 },
  { key: "streak_30", name: "Dedicated", description: "Maintain a 30-day learning streak", icon: "🏆", category: "streak", threshold: 30, order: 9 },
  { key: "streak_100", name: "Unstoppable", description: "Maintain a 100-day learning streak", icon: "💎", category: "streak", threshold: 100, order: 10 },
  { key: "level_5", name: "Halfway There", description: "Reach Level 5", icon: "⭐", category: "milestone", threshold: 5, order: 11 },
  { key: "level_10", name: "Legend Status", description: "Reach Level 10", icon: "🌟", category: "milestone", threshold: 10, order: 12 },
  { key: "xp_1000", name: "XP Collector", description: "Earn 1,000 total XP", icon: "💰", category: "milestone", threshold: 1000, order: 13 },
  { key: "xp_5000", name: "XP Hoarder", description: "Earn 5,000 total XP", icon: "💎", category: "milestone", threshold: 5000, order: 14 },
];

async function main() {
  console.log("Seeding achievements...");

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: {
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        threshold: achievement.threshold || null,
        order: achievement.order,
      },
      create: {
        key: achievement.key,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        threshold: achievement.threshold || null,
        order: achievement.order,
      },
    });
    console.log(`  ✅ ${achievement.name}`);
  }

  // Create UserStats for all existing users that don't have one
  const usersWithoutStats = await prisma.user.findMany({
    where: { stats: null },
    select: { id: true },
  });

  for (const user of usersWithoutStats) {
    await prisma.userStats.create({
      data: { userId: user.id },
    });
    console.log(`  📊 Created stats for user ${user.id}`);
  }

  console.log("\nAchievements seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
