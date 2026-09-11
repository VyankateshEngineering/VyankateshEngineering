import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@vyankateshengg.com";
  const password = "admin123";
  const rounds = 10;

  const passwordHash = await bcrypt.hash(password, rounds);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "admin",
    },
    create: {
      email,
      passwordHash,
      role: "admin",
    },
  });

  console.log(`Seeded admin user: ${user.email} (id: ${user.id})`);
  // Verify hash round check (optional)
  const verify = await bcrypt.compare(password, user.passwordHash);
  console.log(`Password verification: ${verify ? "OK" : "FAIL"} (rounds=${rounds})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
