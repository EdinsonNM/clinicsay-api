import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

type AppointmentStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

export interface PrismaPatientRecord {
  id: string;
  fullName: string;
  dni: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface PrismaDoctorRecord {
  id: string;
  name: string;
  cmp: string;
}

export interface PrismaSpecialtyRecord {
  id: string;
  name: string;
}

export interface PrismaAppointmentRecord {
  id: string;
  patientId: string;
  doctorId: string;
  specialtyId: string;
  date: Date;
  status: AppointmentStatus;
  reason: string | null;
}

export interface PrismaAppointmentWithRelations extends PrismaAppointmentRecord {
  patient: PrismaPatientRecord;
  doctor: PrismaDoctorRecord;
  specialty: PrismaSpecialtyRecord;
}

export interface PrismaDoctorSpecialtyRecord {
  doctorId: string;
  specialtyId: string;
  doctor: PrismaDoctorRecord;
}

interface PrismaClientLike {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  patient: {
    findMany(
      args: unknown,
    ): Promise<Array<Pick<PrismaPatientRecord, 'id' | 'fullName' | 'dni'>>>;
    findUnique(args: unknown): Promise<PrismaPatientRecord | null>;
    create(args: unknown): Promise<PrismaPatientRecord>;
  };
  doctor: {
    findMany(args: unknown): Promise<
      Array<
        PrismaDoctorRecord & {
          specialties: Array<{ specialtyId: string }>;
        }
      >
    >;
    findUnique(args: unknown): Promise<
      | (PrismaDoctorRecord & {
          specialties: Array<{ specialtyId: string }>;
        })
      | null
    >;
    create(args: unknown): Promise<
      PrismaDoctorRecord & {
        specialties: Array<{ specialtyId: string }>;
      }
    >;
    update(args: unknown): Promise<
      PrismaDoctorRecord & {
        specialties: Array<{ specialtyId: string }>;
      }
    >;
    delete(args: unknown): Promise<PrismaDoctorRecord>;
  };
  specialty: {
    findMany(args: unknown): Promise<PrismaSpecialtyRecord[]>;
    findUnique(args: unknown): Promise<PrismaSpecialtyRecord | null>;
    create(args: unknown): Promise<PrismaSpecialtyRecord>;
    update(args: unknown): Promise<PrismaSpecialtyRecord>;
    delete(args: unknown): Promise<PrismaSpecialtyRecord>;
    count(args: unknown): Promise<number>;
  };
  doctorSpecialty: {
    findMany(args: unknown): Promise<PrismaDoctorSpecialtyRecord[]>;
    findUnique(
      args: unknown,
    ): Promise<{ doctorId: string; specialtyId: string } | null>;
    createMany(args: unknown): Promise<{ count: number }>;
    deleteMany(args: unknown): Promise<{ count: number }>;
  };
  appointment: {
    findMany(args: unknown): Promise<PrismaAppointmentWithRelations[]>;
    findUnique(args: unknown): Promise<PrismaAppointmentWithRelations | null>;
    create(args: unknown): Promise<PrismaAppointmentRecord>;
    count(args: unknown): Promise<number>;
  };
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly isEnabled =
    Boolean(process.env.DATABASE_URL) && process.env.NODE_ENV !== 'test';
  private client?: PrismaClientLike;

  get db(): PrismaClientLike {
    if (!this.client) throw new Error('Prisma no esta inicializado');
    return this.client;
  }

  async onModuleInit(): Promise<void> {
    if (!this.isEnabled) return;
    const client = new PrismaClient() as unknown as PrismaClientLike;
    this.client = client;
    await client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) await this.client.$disconnect();
  }
}
