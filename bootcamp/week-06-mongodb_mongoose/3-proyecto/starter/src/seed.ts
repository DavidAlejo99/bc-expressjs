import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { Parent } from './models/parent.model';
import { Child } from './models/child.model';

async function seed(): Promise<void> {
  await connectDB();

  await Child.deleteMany({});
  await Parent.deleteMany({});
  console.log('Collections cleared');

  const [laura, carlos] = await Parent.insertMany([
    { fullName: 'Laura Gómez', email: 'laura.gomez@example.com', phone: '3001234567' },
    { fullName: 'Carlos Ramírez', email: 'carlos.ramirez@example.com', phone: '3009876543' },
  ]);
  console.log('Parents inserted');

  await Child.insertMany([
    { name: 'Sofía Gómez', enrollmentCode: 'JI-2026-001', group: 'Maternal', monthlyFee: 350000, active: true, birthDate: new Date('2023-04-12'), parent: laura._id },
    { name: 'Mateo Gómez', enrollmentCode: 'JI-2026-002', group: 'Párvulos', monthlyFee: 380000, active: true, birthDate: new Date('2022-01-20'), parent: laura._id },
    { name: 'Valentina Ramírez', enrollmentCode: 'JI-2026-003', group: 'Jardín', monthlyFee: 420000, active: true, birthDate: new Date('2021-08-05'), parent: carlos._id },
    { name: 'Samuel Ramírez', enrollmentCode: 'JI-2026-004', group: 'Transición', monthlyFee: 450000, active: false, birthDate: new Date('2020-11-30'), parent: carlos._id },
  ]);
  console.log('Children inserted');

  console.log('Seed completed successfully');
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});