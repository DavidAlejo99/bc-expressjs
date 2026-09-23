import 'dotenv/config';
import { app } from './app.js';
import { connectDB } from './lib/mongoose.js';
import bcrypt from 'bcrypt';
import { User } from './models/user.model.js';
import { ChildModel } from './models/child.model.js';

const PORT = Number(process.env.PORT ?? 3000);
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27021/jardin_seguridad_dev';

async function seed(): Promise<void> {
  const count = await User.countDocuments();
  if (count > 0) return;

  const staffPassword = await bcrypt.hash('Staff1234!', 12);
  const adminPassword = await bcrypt.hash('Admin1234!', 12);

  const [staff, admin] = await User.create([
    { name: 'Educadora Ana', email: 'staff@test.com', password: staffPassword, role: 'staff' },
    { name: 'Directora Marta', email: 'admin@test.com', password: adminPassword, role: 'admin' },
  ]);

  await ChildModel.create([
    {
      name: 'Sofía Ramírez',
      enrollmentCode: 'JI-0001',
      group: 'Pre-jardín',
      monthlyFee: 350000,
      birthDate: new Date('2021-03-14'),
      createdBy: staff._id,
    },
    {
      name: 'Mateo Gómez',
      enrollmentCode: 'JI-0002',
      group: 'Jardín',
      monthlyFee: 380000,
      birthDate: new Date('2020-07-02'),
      createdBy: admin._id,
    },
  ]);

  console.log('Seed: staff@test.com / Staff1234! | admin@test.com / Admin1234!');
}

async function main(): Promise<void> {
  await connectDB(MONGODB_URI);
  await seed();

  app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/v1/health`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
