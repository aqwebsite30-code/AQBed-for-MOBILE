import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.product.deleteMany({
    where: { slug: "luxury-divan-bed" },
  });
  console.log(`Deleted ${result.count} product(s) with slug "luxury-divan-bed"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
