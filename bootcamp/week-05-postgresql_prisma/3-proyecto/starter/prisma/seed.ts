import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.child.deleteMany();
  await prisma.parent.deleteMany();

  const parent1 = await prisma.parent.create({
    data: { fullName: 'Laura Gómez', email: 'laura.gomez@example.com', phone: '3001234567' },
  });

  const parent2 = await prisma.parent.create({
    data: { fullName: 'Carlos Ramírez', email: 'carlos.ramirez@example.com', phone: '3009876543' },
  });

  await prisma.child.createMany({
    data: [
      { name: 'Sofía Gómez', enrollmentCode: 'JI-2026-001', group: 'Maternal', monthlyFee: 350000, active: true, birthDate: new Date('2023-04-12'), parentId: parent1.id },
      { name: 'Mateo Gómez', enrollmentCode: 'JI-2026-002', group: 'Párvulos', monthlyFee: 380000, active: true, birthDate: new Date('2022-01-20'), parentId: parent1.id },
      { name: 'Valentina Ramírez', enrollmentCode: 'JI-2026-003', group: 'Jardín', monthlyFee: 420000, active: true, birthDate: new Date('2021-08-05'), parentId: parent2.id },
      { name: 'Samuel Ramírez', enrollmentCode: 'JI-2026-004', group: 'Transición', monthlyFee: 450000, active: false, birthDate: new Date('2020-11-30'), parentId: parent2.id },
    ],
  });

  console.log('Seed completado: 2 padres y 4 niños creados.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });