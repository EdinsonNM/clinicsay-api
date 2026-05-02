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
    findUnique(args: unknown): Promise<PrismaDoctorRecord | null>;
  };
  specialty: {
    findMany(args: unknown): Promise<PrismaSpecialtyRecord[]>;
    findUnique(args: unknown): Promise<PrismaSpecialtyRecord | null>;
  };
  doctorSpecialty: {
    findMany(args: unknown): Promise<PrismaDoctorSpecialtyRecord[]>;
    findUnique(
      args: unknown,
    ): Promise<{ doctorId: string; specialtyId: string } | null>;
  };
  appointment: {
    findMany(args: unknown): Promise<PrismaAppointmentWithRelations[]>;
    findUnique(args: unknown): Promise<PrismaAppointmentWithRelations | null>;
    create(args: unknown): Promise<PrismaAppointmentRecord>;
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
