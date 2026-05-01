import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const cardiology = await prisma.specialty.upsert({
    where: { name: 'Cardiologia' },
    update: {},
    create: { id: 's-1', name: 'Cardiologia' },
  });
  const pediatrics = await prisma.specialty.upsert({
    where: { name: 'Pediatria' },
    update: {},
    create: { id: 's-2', name: 'Pediatria' },
  });
  const dermatology = await prisma.specialty.upsert({
    where: { name: 'Dermatologia' },
    update: {},
    create: { id: 's-3', name: 'Dermatologia' },
  });

  const garcia = await prisma.doctor.upsert({
    where: { cmp: 'CMP001' },
    update: {},
    create: { id: 'd-44', name: 'Dra. Garcia', cmp: 'CMP001' },
  });
  const lopez = await prisma.doctor.upsert({
    where: { cmp: 'CMP002' },
    update: {},
    create: { id: 'd-45', name: 'Dr. Lopez', cmp: 'CMP002' },
  });
  const torres = await prisma.doctor.upsert({
    where: { cmp: 'CMP003' },
    update: {},
    create: { id: 'd-46', name: 'Dra. Torres', cmp: 'CMP003' },
  });

  for (const relation of [
    [garcia.id, cardiology.id],
    [lopez.id, pediatrics.id],
    [torres.id, cardiology.id],
    [torres.id, dermatology.id],
  ] as const) {
    await prisma.doctorSpecialty.upsert({
      where: { doctorId_specialtyId: { doctorId: relation[0], specialtyId: relation[1] } },
      update: {},
      create: { doctorId: relation[0], specialtyId: relation[1] },
    });
  }

  const juan = await prisma.patient.upsert({
    where: { dni: '12345678A' },
    update: {},
    create: { id: 'p-99', fullName: 'Juan Perez', dni: '12345678A', email: 'juan@example.com', phone: '999111222', address: 'Av. Demo 123' },
  });
  const maria = await prisma.patient.upsert({
    where: { dni: '87654321B' },
    update: {},
    create: { id: 'p-100', fullName: 'Maria Rodriguez', dni: '87654321B' },
  });

  await prisma.appointment.upsert({
    where: { id: 'cl-12345' },
    update: {},
    create: { id: 'cl-12345', patientId: juan.id, doctorId: garcia.id, specialtyId: cardiology.id, date: new Date('2026-05-15T10:00:00.000Z'), reason: 'Consulta cardiologica' },
  });
  await prisma.appointment.upsert({
    where: { id: 'cl-12346' },
    update: {},
    create: { id: 'cl-12346', patientId: maria.id, doctorId: lopez.id, specialtyId: pediatrics.id, date: new Date('2026-05-16T11:00:00.000Z'), reason: 'Control pediatrico' },
  });
  await prisma.appointment.upsert({
    where: { id: 'cl-12347' },
    update: {},
    create: { id: 'cl-12347', patientId: juan.id, doctorId: torres.id, specialtyId: dermatology.id, date: new Date('2026-05-10T09:00:00.000Z'), status: 'COMPLETED', reason: 'Revision dermatologica' },
  });
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
