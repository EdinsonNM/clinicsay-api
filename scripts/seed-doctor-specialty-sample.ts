/**
 * Inserta 5 relaciones simuladas Doctor–Especialidad (tabla DoctorSpecialty).
 * Ejecutar desde la raíz del proyecto:
 *   pnpm prisma:generate && ts-node ./scripts/seed-doctor-specialty-sample.ts
 */
import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const specialties = await Promise.all(
    [
      { id: 'ds-demo-s1', name: 'Traumatologia' },
      { id: 'ds-demo-s2', name: 'Neurologia' },
      { id: 'ds-demo-s3', name: 'Oftalmologia' },
      { id: 'ds-demo-s4', name: 'Medicina General' },
      { id: 'ds-demo-s5', name: 'Ginecologia' },
    ].map((s) =>
      prisma.specialty.upsert({
        where: { name: s.name },
        update: {},
        create: s,
      }),
    ),
  );

  const doctors = await Promise.all(
    [
      { id: 'ds-demo-d1', name: 'Dr. Martin Vega', cmp: 'CMP-DEMO-DS01' },
      { id: 'ds-demo-d2', name: 'Dra. Lucia Ramos', cmp: 'CMP-DEMO-DS02' },
      { id: 'ds-demo-d3', name: 'Dr. Carlos Nuñez', cmp: 'CMP-DEMO-DS03' },
      { id: 'ds-demo-d4', name: 'Dra. Elena Soto', cmp: 'CMP-DEMO-DS04' },
      { id: 'ds-demo-d5', name: 'Dr. Pablo Costa', cmp: 'CMP-DEMO-DS05' },
    ].map((d) =>
      prisma.doctor.upsert({
        where: { cmp: d.cmp },
        update: {},
        create: d,
      }),
    ),
  );

  const pairs = doctors.map((doctor, i) => ({
    doctorId: doctor.id,
    specialtyId: specialties[i]!.id,
  }));

  for (const row of pairs) {
    await prisma.doctorSpecialty.upsert({
      where: {
        doctorId_specialtyId: {
          doctorId: row.doctorId,
          specialtyId: row.specialtyId,
        },
      },
      update: {},
      create: row,
    });
  }

  console.log(
    'Insertadas (o ya existían) 5 filas en DoctorSpecialty:',
    pairs.map((p) => `${p.doctorId} → ${p.specialtyId}`).join(', '),
  );
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
